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

    static async getAverageRating(userId) {
        const sql = `select avg(score) as avg_rating,
                            count(*) as total_ratings
                     from ratings 
                     where rated_id = ?`;
        const result = await db.query(sql, [userId]);
        console.log("RAW RESULT: ", result);

        const row = result[0];

        return {
            avg_rating: row.avg_rating ? parseFloat(row.avg_rating) : null,
            total_ratings: row.total_ratings
        };
    }


    static async getRatingsForUser(userId) {
        const sql = `select
                        r.score,
                        r.comment,
                        r.created_at,
                        u.first_name,
                        l.title
                        
                    from ratings r
                    join users u on r.rater_id = u.user_id
                    join requests req on r.request_id = req.request_id
                    join listings l on req.listing_id = l.listing_id
                    where r.rated_id = ?
                    order by r.created_at desc`;
        const result = await db.query(sql, [userId]);
        return result;
    }
}

module.exports = { Rating };