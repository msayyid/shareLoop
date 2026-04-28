const db = require("./../services/db");

class Request {
    request_id;
    requester_id;
    listing_id;
    status;
    message;
    requested_duration;
    swap_offer_description;
    requested_date;
    responded_date;
    completed_date;
    owner_notes;

    constructor(request_id) {
        this.request_id = request_id;
    }


    static async createRequest(requesterId, listingId, isInquiry = false) {
        // creates a new request with default status 'pending'
        const sql = `insert into requests (requester_id, listing_id, status, is_inquiry)
                                values (?, ?, 'pending', ?)`;
        const result = await db.query(sql, [requesterId, listingId, isInquiry]);
        return result.insertId;
    }

    static async getPendingRequest(requesterId, listingId) {
        const sql = `select * from requests
                     where requester_id = ?
                     and listing_id = ?
                     and status = 'pending'`;
        const result = await db.query(sql, [requesterId, listingId]);
        return result[0];
    }

    static async getRequestsForOwner(userId) {
        const sql = `select r.*, l.title, u.first_name
                     from requests r
                     join listings l on r.listing_id = l.listing_id
                     join users u on u.user_id = r.requester_id
                     where l.user_id = ? 
                    
                     and r.is_inquiry = false`;
                     //  and l.is_active = 1
        const result = await db.query(sql, [userId]);
        return result;
    }

    static async getRequestById(requestId) {
        const sql = `select * from requests
                     where request_id = ?`;
        const result = await db.query(sql, [requestId]);
        return result[0];
    }

    static async acceptRequest(requestId) {
        const sql = `update requests
                     set status = 'accepted'
                     where request_id = ? 
                     and status = 'pending'`;
        const result = await db.query(sql, [requestId]);
        return result; 
    }

    static async rejectRequest(requestId) {
        const sql = `update requests
                     set status = 'declined'
                     where request_id = ?
                     and status = 'pending'`;
        const result = await db.query(sql, [requestId]);
        return result;
    }

    static async getRequestsByUser(userId) {
        const sql = `select r.*, l.title
                     from requests r
                     join listings l on l.listing_id = r.listing_id
                     where r.requester_id = ?
                     and r.is_inquiry = false
                     order by r.requested_date desc`;
        const result = await db.query(sql, [userId]);
        return result;
    }

    static async cancelRequest(requestId) {
        const sql = `update requests
                     set status = 'cancelled'
                     where request_id = ?
                     and status = 'pending'`;
        const result = await db.query(sql, [requestId]);
        return result;
    }

    static async declineOtherRequests(listingId, acceptedRequestId) {
        const sql = `update requests
                     set status = 'declined'
                     where listing_id = ?
                     and request_id != ?
                     and status = 'pending'`;
        const result = await db.query(sql, [listingId, acceptedRequestId]);
        return result;
    }

    static async hasUserRequested(userId, listingId) {
        const sql = `select * from requests
                     where requester_id = ?
                     and listing_id = ?
                     and status = 'pending'
                     and is_inquiry = false`;
        const result = await db.query(sql, [userId, listingId]);
        return result.length > 0;
    }

    static async markComplete(requestId) {
        const sql = `update requests
                     set status = 'completed'
                     where request_id = ?
                     and status = 'accepted'`;
        const result = await db.query(sql, [requestId]);
        return result;
    }

    static async findByUserAndListing(userId, listingId) {
        const sql = `select * from requests
                     where requester_id = ? and listing_id = ?
                     limit 1`;
        const result = await db.query(sql, [userId, listingId]);
        return result[0];
    }

    static async confirmRequest(requestId) {
        const sql = `update requests
                     set is_inquiry = false
                     where request_id = ?`;
        await db.query(sql, [requestId]);
    }

    static async findActiveRequest(userId, listingId) {
        const sql = `select * 
                     from requests
                     where requester_id = ?
                     and listing_id = ?
                     and status IN ('pending', 'accepted')
                     and is_inquiry = false
                     limit 1`;
        const result = await db.query(sql, [userId, listingId]);
        return result[0];
    }


    static async findInquiryRequest(userId, listingId) {
        const sql = `
            SELECT *
            FROM requests
            WHERE requester_id = ?
            AND listing_id = ?
            AND is_inquiry = true
            LIMIT 1
        `;
        const result = await db.query(sql, [userId, listingId]);
        return result[0];
    }


    // static async getUserChats(userId) {
    //     const sql = `
    //         SELECT 
    //             r.request_id,
    //             l.title,
    //             l.photo_url_1,
    //             u.first_name,

    //             MAX(m.created_at) AS last_message_time,

    //             SUBSTRING_INDEX(
    //                 GROUP_CONCAT(m.message ORDER BY m.created_at DESC),
    //                 ',', 1
    //             ) AS last_message,

    //             SUM(
    //                 CASE 
    //                     WHEN m.is_read = 0 AND m.sender_id != ? THEN 1
    //                     ELSE 0
    //                 END
    //             ) AS unread_count

    //         FROM requests r

    //         JOIN listings l ON r.listing_id = l.listing_id

    //         JOIN users u 
    //             ON (u.user_id = l.user_id AND r.requester_id = ?)
    //             OR (u.user_id = r.requester_id AND l.user_id = ?)

    //         LEFT JOIN messages m ON m.request_id = r.request_id

    //         WHERE r.requester_id = ? OR l.user_id = ?

    //         GROUP BY r.request_id

    //         ORDER BY last_message_time DESC
    //     `;

    //     const params = [
    //         userId,
    //         userId,
    //         userId,
    //         userId,
    //         userId
    //     ];

    //     const chats = await db.query(sql, params);

    //     // set image path
    //     chats.forEach(c => {
    //         if (c.photo_url_1) {
    //             c.image_path = `/images/listings/${c.photo_url_1}`;
    //         } else {
    //             c.image_path = `/images/listings/default-listing-pic.jpg`;
    //         }
    //     });

    //     return chats;
    // }
}

module.exports = { Request };