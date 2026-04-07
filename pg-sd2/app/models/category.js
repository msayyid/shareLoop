const db = require("./../services/db");

class Category {
    // attributes
    category_id;
    category_name;
    description;
    icon;
    listing_count;

    // constructor

    constructor(category_id) {
        this.category_id = category_id;
    }

    static async getAllCategories() {
        const sql = `select c.*, count(l.listing_id) as listing_count
                                from categories c
                                left join listings l on l.category_id = c.category_id
                                group by c.category_id`;
        const result = await db.query(sql);
        return result;
    }

    async getCategory() {
        const sql = `select * from categories
                            where category_id = ?`;

        let result = await db.query(sql, [tihs.category_id]);
        if (!result[0]) {
            throw new Error("No category found");
        }
        Object.assign(this, result[0]);
    }


    // static async getListingsCountByCategory(category_id) {
    //     const sql = `select count(*) as total_by_category from listings
    //                             where category_id = ? `
    //     const total = await db.query(sql, [category_id]);
    //     return total;
    // }
}

module.exports = { Category }