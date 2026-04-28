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
            SELECT 
                r.request_id,
                l.title,
                l.photo_url_1,
                u.first_name,

                MAX(m.created_at) AS last_message_time,

                SUBSTRING_INDEX(
                    GROUP_CONCAT(m.message ORDER BY m.created_at DESC),
                    ',', 1
                ) AS last_message,

                SUM(
                    CASE 
                        WHEN m.is_read = 0 AND m.sender_id != ? THEN 1
                        ELSE 0
                    END
                ) AS unread_count

            FROM requests r

            JOIN listings l ON r.listing_id = l.listing_id

            JOIN users u 
                ON (u.user_id = l.user_id AND r.requester_id = ?)
                OR (u.user_id = r.requester_id AND l.user_id = ?)

            LEFT JOIN messages m ON m.request_id = r.request_id

            WHERE r.requester_id = ? OR l.user_id = ?

            GROUP BY 
                r.request_id,
                l.title,
                l.photo_url_1,
                u.first_name

            ORDER BY last_message_time DESC
        `;

        const params = [
            userId, // unread calculation
            userId,
            userId,
            userId,
            userId
        ];

        const chats = await db.query(sql, params);

        // ✅ Fix image path
        chats.forEach(c => {
            if (c.photo_url_1) {
                if (c.photo_url_1.startsWith("/images")) {
                    c.image_path = c.photo_url_1;
                } else {
                    c.image_path = `/images/listings/${c.photo_url_1}`;
                }
            } else {
                c.image_path = `/images/listings/default-listing-pic.jpg`;
            }

            // ✅ Safety (avoid null issues)
            c.unread_count = c.unread_count || 0;
        });

        return chats;
    }

    static async markAsRead(requestId, userId) {
        const sql = `
            UPDATE messages
            SET is_read = 1
            WHERE request_id = ?
            AND sender_id != ?
        `;
        await db.query(sql, [requestId, userId]);
    }
}

module.exports = { Message };