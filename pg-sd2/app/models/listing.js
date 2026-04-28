const db = require("./../services/db");

class Listing {
    // attributes
    listing_id;
    user_id;
    category_id;
    title;
    description;
    exchange_type; // [lending, giveaway, swap]
    condition_status;
    condition_notes;
    photo_url_1;
    photo_url_2;
    photo_url_3;
    swap_preferences;
    is_available; // boolean
    view_count;
    request_count;
    created_at;
    updated_at;
    category_name;
    first_name;
    formatted_created_at;
    formatted_updated_at;

    // constructor
    constructor(listing_id) {
        this.listing_id = listing_id;
    }

    // methods
    async getListingData() {
        const sql = `select l.*, c.category_name, u.first_name
                            from listings l
                            join categories c on l.category_id = c.category_id
                            join users u on u.user_id = l.user_id
                            where l.listing_id = ? and l.is_active = 1`;

        const result = await db.query(sql, [this.listing_id]);
        this.formatted_created_at = result[0].created_at.toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"});
        this.formatted_updated_at = result[0].updated_at.toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"});
        if (!result[0]) {
            throw new Error("Listing not found");
        }
        Object.assign(this, result[0]);
    }

    static async getListingsByCategoryId(category_id) {
        const sql = `select l.*, c.category_name 
                            from listings l
                            join categories c on c.category_id = l.category_id
                            where l.category_id=? and l.is_active = 1`;
        const result = await db.query(sql, [category_id]);
        result.forEach(listing => {
            const l = new Listing();
            Object.assign(l, listing);
            l.setImagePath();
            Object.assign(listing, l);
        });
        
        return result;
    }

    static async getAllTags() {
        const sql = `select * from tags`;
        const result = await db.query(sql);
        return result;
    }

    static async getListingsByTagId(tag_id) {
        const sql = `select l.*, t.tag_id, t.tag_name, c.category_name, c.category_id
                            from listings l
                            join listing_tags lt on lt.listing_id = l.listing_id
                            join tags t on t.tag_id = lt.tag_id
                            join categories c on c.category_id = l.category_id
                            where t.tag_id = ? and l.is_active = 1`;
        const result = await db.query(sql, [tag_id]);
        console.log("THIS IS A METHOD TO GET LISTINGS BY TAGS");
        result.forEach(listing => {
            const l = new Listing();
            Object.assign(l, listing);
            l.setImagePath();
            Object.assign(listing, l);
        });
        console.log(result);
        return result;

    }

    static async getListingsCount() {
        const sql = `select count(*) as total from listings where is_active = 1`;
        const total = await db.query(sql);
        return total;
    }

    setImagePath() {
        if (this.photo_url_1) {
            if (this.photo_url_1.startsWith("/images")) {
                this.image_path = this.photo_url_1;
            } else {
                this.image_path = `/images/listings/${this.photo_url_1}`;
            }
        } else {
            this.image_path = `/images/listings/default-listing-pic.jpg`;
        }
    }

    static async getListingsByUserId(user_id) {
        const sql = `select * from listings where user_id = ? and is_active = 1`;
        const result = await db.query(sql, [user_id]);
        result.forEach(listing => {
            const l = new Listing();
            Object.assign(l, listing);
            l.setImagePath();
            Object.assign(listing, l);
        });
        return result;
    }

    static async getRecentListings() {
        const sql = `select l.*, c.category_name
                            from listings l
                            join categories c on c.category_id = l.category_id
                            where l.is_active = 1
                            order by l.created_at desc
                            limit 6
                             
                            `;
        const result = await db.query(sql);
        result.forEach(listing => {
            const l = new Listing();
            Object.assign(l, listing);
            l.setImagePath();
            Object.assign(listing, l);
        });
        return result;
    }

    // create listing class method
    static async createListing(userId, title, description, exchangeType, categoryId) {
        const sql = `insert into listings (
                                user_id,
                                category_id,
                                title,
                                description,
                                exchange_type,
                                is_available
                                )
                    values (?, ?, ?, ?, ?, 1)`;
        const result = await db.query(sql, [userId, categoryId, title, description, exchangeType]);
        return result;
    }

    static async createListingFull(
        userId,
        title,
        description,
        exchangeType,
        categoryId,
        conditionStatus,
        conditionNotes,
        isAvailable,
        imagePath
    ) {
        const sql = `
            INSERT INTO listings (
                user_id,
                category_id,
                title,
                description,
                exchange_type,
                condition_status,
                condition_notes,
                is_available,
                photo_url_1
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const result = await db.query(sql, [
            userId,
            categoryId,
            title,
            description,
            exchangeType,
            conditionStatus,
            conditionNotes,
            isAvailable,
            imagePath
        ]);

        return result;
    }

    static async getListingById(listingId) {
        const sql = `select * from listings
                            where listing_id = ? and is_active = 1`;

        const result = await db.query(sql, [listingId]);
        return result[0];
    }

    // update/edit listing in db
    static async updateListing(listingId, title, description, exchange_type, category_id) {
        const sql = `update listings
                     set title = ?, description = ?, exchange_type = ?, category_id = ?
                     where listing_id = ?`;
        const result = await db.query(sql, [title, description, exchange_type, category_id, listingId]);
        return result;
    }

    // delete listing in db
    static async deleteListing(listingId) {

        const sql = `UPDATE listings SET is_active = 0 WHERE listing_id = ?`;
        const result = await db.query(sql, [listingId]);
        return result;
    }

    static async markUnavailable(listingId) {
        const sql = `update listings
                     set is_available = 0
                     where listing_id = ?`;
        const result = await db.query(sql, [listingId]);
        return result;
    }

    static async markAvailable(listingId) {
        const sql = `update listings
                     set is_available = 1
                     where listing_id = ?
                     and is_active = 1`;
        const result = await db.query(sql, [listingId]);
        return result;
    }

    static async updateListingFull(
        id,
        title,
        description,
        type,
        isAvailable,
        category,
        condition,
        notes,
        imagePath
    ) {
        const sql = `
            update listings
            set title = ?,
                description = ?,
                exchange_type = ?,
                is_available = ?,
                category_id = ?,
                condition_status = ?,
                condition_notes = ?,
                photo_url_1 = ?
            where listing_id = ?
        `;

        const result = await db.query(sql, [
            title,
            description,
            type,
            isAvailable,
            category,
            condition,
            notes,
            imagePath,
            id
        ]);

        return result;

    }

    // filtered listings
    static async getFilteredListings({ 
        page = 1, 
        limit = 9, 
        exchange, 
        condition, 
        available,
        search,
        sort
    }) {
        const offset = (page - 1) * limit;

        let sql = `
            SELECT 
                l.*, 
                c.category_name,
                u.first_name,
                AVG(r.score) as avg_rating,
                COUNT(r.rating_id) as total_ratings
            FROM listings l
            JOIN categories c ON l.category_id = c.category_id
            JOIN users u ON u.user_id = l.user_id
            LEFT JOIN ratings r ON r.rated_id = l.user_id
            WHERE l.is_active = 1
        `;

        const params = [];

        // filters
        if (exchange) {
            sql += " AND l.exchange_type = ?";
            params.push(exchange);
        }

        if (condition) {
            sql += " AND l.condition_status = ?";
            params.push(condition);
        }

        if (available === "1") {
            sql += " AND l.is_available = 1";
        }

        // 🔍 search
        if (search) {
            sql += " AND (l.title LIKE ? OR l.description LIKE ?)";
            params.push(`%${search}%`, `%${search}%`);
        }

        sql += " GROUP BY l.listing_id";

        // ↕️ sorting
        if (sort === "popular") {
            sql += " ORDER BY l.request_count DESC";
        } else {
            sql += " ORDER BY l.created_at DESC";
        }

        // count query
        const countSql = `
            SELECT COUNT(*) as count
            FROM (${sql}) as sub
        `;

        const countResult = await db.query(countSql, params);
        const total = countResult[0].count;
        const totalPages = Math.ceil(total / limit);

        // pagination
        sql += ` LIMIT ${limit} OFFSET ${offset}`;

        const listings = await db.query(sql, params);

        listings.forEach(listing => {
            const l = new Listing();
            Object.assign(l, listing);
            l.setImagePath();
            Object.assign(listing, l);
        });

        return { listings, totalPages };
    }


}

module.exports = {Listing}