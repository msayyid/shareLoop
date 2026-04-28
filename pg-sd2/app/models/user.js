const db = require("./../services/db");
const bcrypt = require("bcryptjs");

class User {
    // attributes
    user_id;
    email;
    password_hash;
    first_name;
    last_name;
    bio = null;
    location;
    latitude;
    longitude;
    profile_pic;
    points;
    average_rating;
    total_ratings;
    items_lent;
    items_borrowed;
    items_given;
    is_active;
    created_at;
    updated_at;
    formatted_created_at;
    formatted_updated_at;

    // constructor(email) {
    //     this.email = email;
    // }

    constructor(user_id) {
        // this.user_id = data.user_id;
        // this.email = data.email;
        this.user_id = user_id;

    }

    async getUser() {
        const sql = `select * from users
                            where user_id = ?`;
        // Execute the query safely using parameter binding (prevents SQL injection)
        const result = await db.query(sql, [this.user_id]);

        // result is an array of rows → we take the first row (since user_id is unique)
        // result[0] contains all columns from the users table
        const row = result[0];
        

        if (!row) {
            throw new Error("User not found");
        }

        this.formatted_created_at = row.created_at.toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"});
        this.formatted_updated_at = row.updated_at.toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"});

        // Copy all properties from the DB row into this object
        // e.g. row.email → this.email, row.first_name → this.first_name, etc.
        Object.assign(this, row);


    }


    // async setProfilePic(filename) {
    //     const sql = `update users set profile_pic = ? where user_id = ?`;
    //     await db.query(sql, [filename, this.user_id]);
    //     this.profile_pic = filename;

    // }
    setImagePath() {
        if (this.profile_pic) {
            this.image_path = `/images/users/${this.profile_pic}`;
        } else {
            this.image_path = `/images/users/default-avatar.jpg`;
        }
    }

    // login - register methods
    async getIdFromEmail() {
        const sql = "select id from users where users.email = ?";
        const result = await db.query(sql, [this.email]);

        console.log("getIdFromEmail() result: ", result);

        if (result.length > 0) {
            this.id = result[0].id;
            return this.id;
        } else {
            return false;
        }
    }


    static async getUserByEmail(email) {
        const sql = "select * from users where email = ?";
        const result = await db.query(sql, [email]);
        return result[0];
    }

    static async getAllUsers() {
        const sql = "select * from users";
        const allUsers = await db.query(sql);
        return allUsers;
    }

    async updatePassword(password) {
        const pw = await bcrypt.hash(password, 10);
        const sql = `update users 
                        set password_hash =  ?
                        where user_id = ?`;
        await db.query(sql, [pw, this.user_id]);

    }

    static async authenticate(submitted, existing) {
        const match = await bcrypt.compare(submitted, existing);
        return match;
    }

    static async createUser(first_name, last_name, email, password_hash) {
        const sql = `insert into users (first_name, last_name, email, password_hash)
                                values (?, ?, ?, ?)`;
        const result = await db.query(sql, [first_name, last_name, email, password_hash]);
        return result;
    }

    static async updateProfile(firstName, lastName, bio, location, imagePath, userId) {
        let sql = `
            UPDATE users
            SET first_name = ?, last_name = ?, bio = ?, location = ?
        `;

        const params = [firstName, lastName, bio, location];

        if (imagePath) {
            sql += `, profile_image = ?`;
            params.push(imagePath);
        }

        sql += ` WHERE user_id = ?`;
        params.push(userId);

        await db.query(sql, params);
    }

    setProfileImagePath() {
        if (this.profile_image) {
            if (this.profile_image.startsWith("/images")) {
                this.profile_image_path = this.profile_image;
            } else {
                this.profile_image_path = `/images/profiles/${this.profile_image}`;
            }
        } else {
            this.profile_image_path = `/images/profiles/default-avatar.jpg`;
        }
    }

    // filtered users
    static async getFilteredUsers({ page = 1, limit = 6, search, sort, hasRating }) {
        const offset = (page - 1) * limit;

        let sql = `
            SELECT 
                u.*,
                AVG(r.score) as avg_rating_calc,
                COUNT(r.rating_id) as total_ratings_calc
            FROM users u
            LEFT JOIN ratings r ON r.rated_id = u.user_id
            WHERE u.is_active = 1
        `;

        const params = [];

        // search
        if (search) {
            sql += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        sql += ` GROUP BY u.user_id`;

        // filter (must use HAVING, not WHERE!)
        if (hasRating === "1") {
            sql += ` HAVING total_ratings_calc > 0`;
        }

        // sorting
        if (sort === "rating") {
            sql += ` ORDER BY avg_rating_calc DESC`;
        } else if (sort === "points") {
            sql += ` ORDER BY u.points DESC`;
        } else {
            sql += ` ORDER BY u.created_at DESC`;
        }

        // count
        const countSql = `SELECT COUNT(*) as count FROM (${sql}) as sub`;
        const countResult = await db.query(countSql, params);
        const total = countResult[0].count;
        const totalPages = Math.ceil(total / limit);

        // pagination
        sql += ` LIMIT ${limit} OFFSET ${offset}`;

        const users = await db.query(sql, params);

        return { users, totalPages };
    }




}

module.exports = { User }