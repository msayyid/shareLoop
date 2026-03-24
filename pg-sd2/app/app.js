// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("app/static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// pug template engine
app.set("view engine", "pug");
app.set("views", "./app/views");


// load user class (model)
const { User } = require("./models/user");
const { Listing } = require("./models/listing");
const { Category } = require("./models/category");

// Create a route for root - /
app.get("/", function(req, res) {
    res.render("home-page")
});

// users

app.get("/all-users-formatted", async function(req, res) {
    const sql = `select * from users`;
    const results = await db.query(sql);

    // set the pictures path
    results.forEach(user => {
        if (user.profile_pic) {
            user.image_path = `/images/users/${user.profile_pic}`;
        } else {
            user.image_path = `/images/users/default-avatar.jpg`;
        }
    })
    res.render("all-users-formatted", {
        results: results
    });
    console.log("i can see all the users that will be formatted in here");
    console.log(results);

});

app.get("/single-user/:id", async function(req, res) {
    const uId = req.params.id;
    let user = new User(uId);
    await user.getUser();
    await user.setProfilePic("profile_pic_1.jpg");
    res.render("user", {
        user:user
    });
    console.log("now i need to be seeing a user with a givn id");
    console.log(user);
});

// listings

app.get("/all-listings-formatted", async function(req, res) {
    const sql = `select l.*, c.category_name
                        from listings l
                        join categories c on l.category_id = c.category_id`;
    const result = await db.query(sql);
    const tags = await Listing.getAllTags();
    const listings_count = await Listing.getListingsCount();
    res.render("all-listings-formatted", {
        listings:result,
        tags:tags
    });
    console.log(result);
    console.log("these are the tags only");
    console.log(tags);

    console.log("here i have got LISTINGS COUNT");
    console.log(listings_count);
});

app.get("/listing-detail/:listing_id", async function (req, res){
    const listing_id = req.params.listing_id;
    let listing = new Listing(listing_id);
    await listing.getListingData();
    res.render("listing-detail", {
        listing:listing
    });
    console.log(listing);
});

// categories
app.get("/all-categories", async function(req, res) {
    const categories = await Category.getAllCategories();
    // const category_id = categories[0]
    // const total = await Category.getListingsCountByCategory(category_id);
    res.render("all-categories", {
        categories:categories
    });
    console.log("i am checking whether categories loading or not");
    console.log(categories);
});

app.get("/all-categories/:id", async function(req, res) {
    const category_id = req.params.id;
    const listings = await Listing.getListingsByCategoryId(category_id);
    res.render("category-by-id", {
        listings:listings
    });
    console.log("this is what i need");
    console.log(listings);

});

// get listings by tags
app.get("/tags/:id", async function(req, res) {
    const tag_id = req.params.id;
    const listings = await Listing.getListingsByTagId(tag_id);
    const tags = await Listing.getAllTags();
    res.render("tag-listings", {
        listings:listings,
        tags:tags
    });
    console.log("we ve got tag listings in here");
    console.log(listings);
});

app.get("/project_db_test", async function (req, res) {
    const sql = `select user_id, first_name, last_name, email, location, bio
                 from users`;
    const results = await db.query(sql);
    res.send(results);
    console.log("we ve got the results from our poject_db database");
    console.log(results)
})

// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});

// questions:
// regarding the multiple database queries 
// i am calling one in for example in models (user, listing)
// and one more to get all the data in app.js (all-users-formatted, etc) 
// is this how it is supposed to be? could we optimize it?