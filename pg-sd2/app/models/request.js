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


    static async createRequest(requesterId, listingId) {
        // creates a new request with default status 'pending'
        const sql = `insert into requests (requester_id, listing_id, status)
                                values (?, ?, 'pending')`;
        const result = await db.query(sql, [requesterId, listingId]);
        return result;
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
                     where l.user_id = ? and l.is_active = 1`;
        const result = await db.query(sql, [userId]);
        return result;
    }
}

module.exports = { Request };