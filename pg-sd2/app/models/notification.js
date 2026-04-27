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

    static async markAsRead(notificationId) {
        const sql = `update notifications
                     set is_read = true
                     where notification_id = ?`;
        await db.query(sql, [notificationId]);
    }

    static async getById(notificationId) {
        const sql = `select * from notifications
                     where notification_id = ?`;
        
        const result = await db.query(sql, [notificationId]);
        return result[0];
    }
}

module.exports = { Notification };