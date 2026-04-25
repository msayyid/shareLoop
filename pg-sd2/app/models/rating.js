const db = require("./../services/db")

class Rating {
    rating_id;
    request_id;
    rater_id;
    rated_id;
    score;
    comment;
    rating_type;
    created_at;

    constructor(rating_id) {
        this.rating_id = rating_id;
    }

    static async hasUserRated(requestId, userId) {
        const sql = `select * from ratings
                     where request_id = ?
                     and rater_id = ?`; // should we not have rated id as well in here?
        const result = await db.query(sql, [parseInt(requestId), parseInt(userId)]);
        console.log("CHECK QUERY:", requestId, userId, result);
        return result.length > 0; // return boolean, true if rated false if not 
    }

    static async createRating(requestId, raterId, ratedId, score, comment) {
        const sql = `insert into ratings (request_id, rater_id, rated_id, score, comment)
                            values (?, ?, ?, ?, ?)`;
        const result = await db.query(sql, [requestId, raterId, ratedId, score, comment]);
        return result;
    }
}

module.exports = { Rating };