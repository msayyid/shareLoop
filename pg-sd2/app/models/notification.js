const db = require("./../services/db");

class Notification {
    notification_id;
    user_id;
    type;
    message;
    link;
    is_read;
    created_at;

    constructor(notification_id) {
        this.notification_id = notification_id;
    }

    static async create(userId, type, message, link){
        const sql = `
            insert into notifications (user_id, type, message, link)
            values (?, ?, ?, ?)
        `;

        const result = await db.query(sql, [userId, type, message, link]);
        return result.insertId;
    }
}

module.exports = { Notification };