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
                            where l.listing_id = ?`;

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
                            where l.category_id=?`;
        const result = await db.query(sql, [category_id]);
        result.forEach(listing => {
            if (listing.photo_url_1) {
                listing.image_path = `/images/listings/${listing.photo_url_1}`;
            } else {
                listing.image_path = `/images/listings/default-listing-pic.jpg`;
            }
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
                            where t.tag_id = ?`;
        const result = await db.query(sql, [tag_id]);
        console.log("THIS IS A METHOD TO GET LISTINGS BY TAGS");
        result.forEach(listing => {
            if (listing.photo_url_1) {
                listing.image_path = `/images/listings/${listing.photo_url_1}`;
            } else {
                listing.image_path = `/images/listings/default-listing-pic.jpg`;
            }
        });
        console.log(result);
        return result;

    }

    static async getListingsCount() {
        const sql = `select count(*) as total from listings`;
        const total = await db.query(sql);
        return total;
    }

    setImagePath() {
        if (this.photo_url_1) {
            this.image_path = `/images/listings/${this.photo_url_1}`;
        } else {
            this.image_path = `/images/listings/default-listing-pic.jpg`;
        }
    }

    static async getListingsByUserId(user_id) {
        const sql = `select * from listings where user_id = ?`;
        const result = await db.query(sql, [user_id]);
        result.forEach(listing => {
            if (listing.photo_url_1) {
                listing.image_path = `/images/listings/${listing.photo_url_1}`;
            } else {
                listing.image_path = `/images/listings/default-listing-pic.jpg`;
            }
        });
        return result;
    }

    static async getRecentListings() {
        const sql = `select l.*, c.category_name
                            from listings l
                            join categories c on c.category_id = l.category_id
                            order by l.created_at desc
                            limit 6
                             
                            `;
        const result = await db.query(sql);
        result.forEach(listing => {
            if(listing.photo_url_1) {
                listing.image_path = `/images/listings/${photo_url_1}`;
            } else {
                listing.image_path = `/images/listings/default-listing-pic.jpg`;
            }
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
}

module.exports = {Listing}