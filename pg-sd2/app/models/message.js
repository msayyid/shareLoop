const db = require("./../services/db");

class Message {
    message_id;
    request_id;
    sender_id;
    receiver_id;
    message;
    is_read;
    created_at;

    constructor(message_id) {
        this.message_id = message_id;
    }

    static async createMessage(requestId, senderId, receiverId, message) {
        const sql = `insert into messages (request_id, sender_id, receiver_id, message)
                                values (?, ?, ?, ?)`;
        const result = await db.query(sql, [requestId, senderId, receiverId, message]);
        return result.insertId;
    }

    static async getMessagesByRequestId(requestId) {
        const sql = `select m.*, u.first_name
                     from messages m
                     join users u on m.sender_id = u.user_id
                     where m.request_id = ?
                     order by m.created_at asc`;
        const result = await db.query(sql, [requestId]);
        return result;
    }

    static async getUserChats(userId) {
        const sql = `
                select DISTINCT r.request_id, l.title, u.first_name
                from messages m
                join requests r on m.request_id = r.request_id
                join listings l on r.listing_id = l.listing_id
                join users u on u.user_id = 
                    case
                        when m.sender_id = ? then m.receiver_id
                        else m.sender_id
                    end
                where m.sender_id = ? or m.receiver_id = ?`;
        const result = await db.query(sql, [userId, userId, userId]);
        return result;
    }
}

module.exports = { Message };