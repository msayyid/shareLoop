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
}

module.exports = { Request };