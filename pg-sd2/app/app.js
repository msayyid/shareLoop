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

// enable POST usage
app.use(express.urlencoded({ extended: true}));


// load user class (model)
const { User } = require("./models/user");
const { Listing } = require("./models/listing");
const { Category } = require("./models/category");
const { Request } = require("./models/request");
const { Rating } = require("./models/rating");
const { Message } = require("./models/message");
const { Notification } = require("./models/notification");

const bcrypt = require("bcryptjs");

// set the sessions
const session = require("express-session");
app.use(session({
    secret: "secretkeyofmine",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));


// requireLogin middleware
function requireLogin(req, res, next) {
    const uId = req.session.uId;
    if (!uId) {
        console.log("the guest is sent to login page");
        return res.redirect("/login");
    }
    next();

}

// loggedIn middleware
app.use((req, res, next) => {
    res.locals.loggedIn = req.session.uId;
    next(); // move to the next middleware
});

// notification middleware
app.use(async (req, res, next) => {
    if (req.session.uId) {
        const notifications = await db.query(
            `select * from notifications
            where user_id = ?
            and is_read = false
            order by created_at desc
            limit 5`,
            [req.session.uId]
        );

        const unreadCount = await db.query(
            `select count(*) as count
            from notifications
            where user_id = ?
            and is_read = false`,
            [req.session.uId]
        );

        res.locals.notifications = notifications;
        res.locals.unreadCount = unreadCount[0].count;
    } else {
        res.locals.notifications = [];
    }
    next();
});



// make categories global
app.use(async (req, res, next) => { // next - continue to the next middleware/route
    // request → middleware → middleware → route → response
    try {
        const categories = await Category.getAllCategories();
        res.locals.categories = categories;
        next();
    } catch (err) {
        console.error(err);
        res.locals.categories = [];
        next();
    }
});

// login route
app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", async function(req, res) {
    let userData = await User.getUserByEmail(req.body.email);
    const password = req.body.password;
    if (!userData) {
        
        console.log("user data from /authenticate, userdata not defined");
        return res.redirect("/login");
    } else {
        let match = await User.authenticate(password, userData.password_hash);
        if(!match) {
            console.log("passwords didn't match");
            return res.redirect("/login");
        } else {
            req.session.uId = userData.user_id;
            console.log("Successful login redirecting to home page");
            return res.redirect("/dashboard");

        }  
        
    }
    
});


// set passwords for the existing users (hashed password)
// app.get("/set-passwords", async function(req, res) {
//     let allUsers = await User.getAllUsers();
//     // console.log(allUsers);
//     // res.send(allUsers);
//     for (let user of allUsers) {
//         await User.updatePassword(user.user_id, "12345");
//     }
//     console.log(allUsers);
//     res.send(allUsers);

// });


// register route
app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", async function(req, res) {
    const {first_name, last_name, email, password} = req.body;
    if (!email || !password || !first_name || !last_name) {
        console.error("missing fields in register page");
        return res.redirect("/register");
    }

    const password_hash = await bcrypt.hash(password, 10);

    try {
        const user = await User.createUser(first_name, last_name, email, password_hash);
        return res.redirect("/login");
    } catch (err) {
        console.error(err);
        res.send("error registering a user");

    }
    
});


//logout route
app.get("/logout", requireLogin, async function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.error(err);
            return res.send("error loggin out");
        }
        res.redirect("/");
    });
});

// dashboard
app.get("/dashboard", requireLogin, async function (req, res) {
    const uId = req.session.uId;

    const user = new User(uId);
    await user.getUser();
    const listings = await Listing.getListingsByUserId(uId);
    const requests = await Request.getRequestsForOwner(uId);

    for (let req of requests) {
        req.hasRated = await Rating.hasUserRated(req.request_id, uId);
    }
    console.log(user);
    console.log("AND HERE WE HAVE GOT USER'S LISTINGS");
    console.log(listings);
    res.render("dashboard", {
        user: user,
        listings: listings,
        requests:requests
    });
});



// create listing route
app.get("/listings/new", requireLogin, (req, res) => {
    res.render("create-listing");
});

app.post("/listings", requireLogin, async function(req, res) {
    const uId = req.session.uId;
    const { title, description, exchange_type, category_id } = req.body;
    try {
        await Listing.createListing(uId, title, description, exchange_type, category_id);
        res.redirect("/dashboard");
    } catch(err) {
        console.error(err)
        res.send("Error creating listing");
    }
    
});

// edit listing route get
app.get("/listings/:id/edit", requireLogin, async function(req, res) {
    const listingId = req.params.id;
    const uId = req.session.uId;
    const listing = await Listing.getListingById(listingId);
    if (!listing) {
        
        console.error("No listing found");
        res.redirect("/");
        return;
    }

    // check ownership
    if (listing.user_id !== parseInt(uId)) {
        // block access 
        console.error("Unauthorized access attempt");
        return res.redirect("/dashboard");
    }

    res.render("edit", {
        listing:listing
    });
    }
);

// edit listing route POST
app.post("/listings/:id/edit", requireLogin, async function(req, res) {
    const uId = req.session.uId;
    const listingId = req.params.id;
    const listing = await Listing.getListingById(listingId);

    if (!listing) {
        console.error("no listing found");
        return res.redirect("/dashboard");
    }

    if (parseInt(uId) !== listing.user_id) {
        console.error("unauthorized edit attempt");
        return res.redirect("/dashboard");
    }

    // extract form data from the body
    const {title, description, exchange_type, category_id} = req.body;
    try {
        const result = await Listing.updateListing(listingId, title, description, exchange_type, category_id);
        if (result.affectedRows >= 0) {
            return res.redirect(`/listing-detail/${listingId}`); // redirect to the listing detail page with new data, does it get updated in there btw?
        } else {
            console.error("update failed");
            return res.redirect("/dashboard");
        }
    } catch(err) {
        console.error(err);
        console.log("update failed going to back to edit page");
        res.redirect(`/listings/${listingId}/edit`); // how do i send a message or do i need it
        return;

    }
});

// delete route post
app.post("/listings/:id/delete", requireLogin, async function (req, res) {
    const uId = req.session.uId;
    const listingId = req.params.id;
    const listing = await Listing.getListingById(listingId);

    // check listing
    if (!listing) {
        console.error("no listing found");
        res.redirect("/dashboard");
        return;
    }

    // check ownership
    if (listing.user_id !== parseInt(uId)) {
        console.log("unauthorized access");
        return res.redirect("/dashboard");
    }

    // now delete
    result = await Listing.deleteListing(listingId);
    if (result.affectedRows === 0) {
        console.error("error deleting a listing");
        return res.redirect("/dashboard");
    }
    console.log(`listing with id: ${listingId} just got deleted`);
    return res.redirect("/dashboard");
});


// REQUEST ROUTES
app.post("/listings/:id/request", async function (req, res) {
    const listingId = parseInt(req.params.id);
    const uId = req.session.uId;

    // if not logged in redirect to login page
    if (!uId) {
        return res.redirect("/login");
    }

    const listing = await Listing.getListingById(listingId);

    if (!listing) {
        console.error("no listing found");
        return res.redirect(`/listing-detail/${listingId}`);
    }

    if (parseInt(uId) === listing.user_id) {
        console.error("Cannot request your own item");
        return res.redirect("/dashboard");
    }

    // check if ANY request exists (including inquiry)

    const activeRequest = await Request.findActiveRequest(uId, listingId);
    const inquiryRequest = await Request.findInquiryRequest(uId, listingId);

    let requestId;

    if (activeRequest) {
        // already active request exists
        console.error("already requested");
        return res.redirect(`/listing-detail/${listingId}`);

    } else if (inquiryRequest) {
        // convert inquiry → real request
        await Request.confirmRequest(inquiryRequest.request_id);
        requestId = inquiryRequest.request_id;
        console.log("inquiry converted to real request");

    } else {
        // create new request
        requestId = await Request.createRequest(uId, listingId, false);
        console.log("new request created");
    }

    // notifications
    await Notification.create(
        listing.user_id,
        "request",
        "Someone requested your item",
        `/requests/${requestId}/messages`
    );
    // const activeRequest = await Request.findActiveRequest(uId, listingId);

    // const existingRequest = await Request.findByUserAndListing(uId, listingId);

    // if (activeRequest) {
    //     // already has active request
    //     console.error("already requested");
    //     return res.redirect(`/listing-detail/${listingId}`);

    // } else if (existingRequest && existingRequest.is_inquiry) {
    //     // convert inquiry → real request
    //     await Request.confirmRequest(existingRequest.request_id);
    //     console.log("inquiry converted to real request");

    // } else {
    //     // create new request
    //     await Request.createRequest(uId, listingId, false);
    //     console.log("new request created");
    // }

    return res.redirect(`/listing-detail/${listingId}`);
});

// accept request route POST
app.post("/requests/:id/accept", requireLogin, async function(req, res) {
    const requestId = req.params.id;
    const uId = req.session.uId; // requireLogin is used therefore there's no need to do extra check on uId

    const request = await Request.getRequestById(requestId);
    if (!request) {
        console.error("no request found, accept route problem");
        return res.redirect("/dashboard");
    }

    if (request.status !== "pending") {
        console.error("Already accepted REQUEST");
        return res.redirect("/dashboard");
    }
    
    const listing = await Listing.getListingById(request.listing_id);
    if (!listing) {
        console.error("no listing found, accept route problem");
        return res.redirect("/dashboard");
    }

    // check ownership
    if (parseInt(uId) !== listing.user_id) {
        console.error("this is not a request to your listing!!!!");
        return res.redirect("/dashboard");
    }

    // update statuc
    const updated = await Request.acceptRequest(requestId);
    if (updated.affectedRows == 0) {
        console.error("Erorr accepting the request");
        return res.redirect("/dashboard");
    } else {
        // update listing availability
        await Listing.markUnavailable(listing.listing_id);

        // cancel the request for this item for other users
        await Request.declineOtherRequests(listing.listing_id, requestId);
        console.log("Request Accepted successfully");
        // notify requester
        await Notification.create(
            request.requester_id,
            "request",
            "Your request was accepted",
            `/requests/${requestId}/messages`
        );

        return res.redirect("/dashboard");
    }
});

// reject request route
app.post("/requests/:id/reject", requireLogin, async function(req, res) {
    const requestId = req.params.id; // route param always exists no need for extra check
    const uId = req.session.uId;

    const request = await Request.getRequestById(requestId);
    if (!request) {
        console.error("no request found, reject route");
        return res.redirect("/dashboard");
    }

    if (request.status !== "pending") {
        console.error("request is not pending, can't be rejected!!!");
        return res.redirect("/dashboard");
    }

    const listing = await Listing.getListingById(request.listing_id);
    if (!listing) {
        console.error("no listing found to reject");
        return res.redirect("/dashboard");
    }

    // check ownership
    if (listing.user_id !== parseInt(uId)) {
        console.error("unauthorized access");
        return res.redirect("/dashboard");
    }

    // update status
    const updated = await Request.rejectRequest(requestId);
    if (updated.affectedRows === 0) {
        console.error("error occured rejecting a request");
        return res.redirect("/dashboard");
    } else {

        console.log("request rejected/declined successfully");

        // notify requester
        await Notification.create(
            request.requester_id,
            "request",
            "Your request was declined",
            `/requests/${requestId}/messages`
        );

        return res.redirect("/dashboard");
    }
});

// MY REQUESTS ROUTE
app.get("/my-requests", requireLogin, async function(req, res) {
    const uId = req.session.uId;

    const requests = await Request.getRequestsByUser(uId);
    for (let req of requests) {
        req.hasRated = await Rating.hasUserRated(req.request_id, uId);
        console.log("DEBUG:", req.request_id, req.hasRated);
    }
    console.log(requests);
    res.render("my-requests", {
        requests:requests
    });

});

// cancel a pending request POST
app.post("/requests/:id/cancel", requireLogin, async function(req, res) {
    const requestId = req.params.id;
    const uId = req.session.uId;
    const request = await Request.getRequestById(requestId);
    if (!request) {
        console.error("no request found");
        return res.redirect("/my-requests");
    }
    // ownership check
    if (parseInt(uId) !== request.requester_id) {
        console.error("unauthorized access!!");
        return res.redirect("/my-requests");
    }

    if (request.status !== "pending") {
        console.error("you can't cancel non-pending requests");
        return res.redirect("/my-requests");
    }

    const cancelled = await Request.cancelRequest(requestId); // i do not have htis method yet
    if (cancelled.affectedRows === 0) {
        console.error("error occured while cancelling a reqeust");
        return res.redirect("/my-requests");
    }
    console.log("request cancelled successfully");
    return res.redirect("/my-requests");

});

// mark a request as completed by owner
app.post("/requests/:id/complete", requireLogin, async function(req, res) {
    const requestId = req.params.id;
    const uId = req.session.uId;

    const request = await Request.getRequestById(requestId);
    if (!request) {
        console.error("no request found");
        return res.redirect("/dashboard");
    }
    const listing = await Listing.getListingById(request.listing_id);
    if (!listing) {
        console.error("no listing found");
        return res.redirect("/dashboard");
    }

    if (parseInt(uId) !== listing.user_id) { // i do not have user_id in requests table and this method does not include we can get it from listings, i will need to rewrite the sql for this method?
        console.error("it is not your item to makr!!!");
        return res.redirect("/dashboard");
    }
    
    if (request.status !== "accepted") {
        console.error("you can't mark non-accepted requests completed");
        return res.redirect("/dashboard");
    }

    await Request.markComplete(requestId); // i do not have htis yet
    // mark listing available if lending
    if (listing.exchange_type === "lending") {
        await Listing.markAvailable(listing.listing_id);
        // we could have more checks in here
    }
    console.log("request marked complete and listing updated if needed");
    res.redirect("/dashboard")

});

// RATINGS
app.post("/requests/:id/rate", requireLogin, async function (req, res) {
    const requestId = req.params.id;
    const uId = req.session.uId;

    const request = await Request.getRequestById(requestId);
    if (!request) {
        console.error("no request found");
        return res.redirect("/my-requests");
    }

    if (request.status !== "completed") {
        console.error("you can't rate non-completed requests");
        return res.redirect("/my-requests"); // i dont' know where to redirect
    }

    const listing = await Listing.getListingById(request.listing_id);
    if (!listing) {
        console.error("no listing found");
        return res.redirect("/my-requests"); // ?????
    }

    const isRequester = uId === request.requester_id;
    const redirectUrl = isRequester ? "/my-requests" : "/dashboard";

    // check user is a part of request
    // user is NOT requester AND NOT owner
    if (uId !== request.requester_id && uId !== listing.user_id) {
        // checking if the user is either a requester or the owner
        console.error("you can't rate. you are not part of this request");
        return res.redirect(redirectUrl); // i am not sure about this at all now
    }


    // check user has not rated yet

    const alreadyRated = await Rating.hasUserRated(requestId, uId);
    if (alreadyRated) {
        console.error("you already rated");
        return res.redirect(redirectUrl);
    }

    const { score, comment } = req.body;
    if (!score || score < 1 || score > 5) {
        console.error("invalid score");
        return res.redirect(redirectUrl);
    }

    if (comment && comment.length > 500) {
        console.error("comment too long");
        return res.redirect(redirectUrl);
    }
    let ratedId;

    if (uId === request.requester_id) {
        // requester rating owner
        ratedId = listing.user_id;
    } else {
        // owner is rating requester
        ratedId = request.requester_id;
    }
    try {
        await Rating.createRating(requestId, uId, ratedId, score, comment);
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            console.error("user already rated (DB CONSTRAINT)");
            return res.redirect(redirectUrl);
        }
        throw err; // other errors
    }
    return res.redirect(redirectUrl);
});

// rating route
app.get("/requests/:id/rate", requireLogin, async function (req, res) {
    const requestId = req.params.id;
    const uId = req.session.uId;
    const request = await Request.getRequestById(requestId);
    if (!request) {
        console.error("no request found");
        return res.redirect("/my-requests");
    }

    if (request.status !== "completed") {
        console.error("you can't rate non-completed requests");
        return res.redirect("/my-requests");
    }

    const listing = await Listing.getListingById(request.listing_id);
    if (!listing) {
        console.error("no listing found");
        return res.redirect("/my-requests");
    }

    const isRequester = uId === request.request_id;
    const redirectUrl = isRequester ? "/my-requests" : "/dashboard";
    // user part of the request
    if (uId !== listing.user_id && uId !== request.requester_id) {
        console.error("you are not part of the request");
        return res.redirect(redirectUrl);
    }

    const alreadyRated = await Rating.hasUserRated(requestId, uId);
    if (alreadyRated) {
        console.error("rating failed");
        return res.redirect(redirectUrl);
    }

    return res.render("rate", {
        request,
        listing
    });

});

// messaging routes 
app.get("/requests/:id/messages", requireLogin, async function (req, res) {
    const requestId = req.params.id;
    const uId = req.session.uId;

    const request = await Request.getRequestById(requestId);
    if (!request) {
        console.error("no request found");
        return res.redirect("/dashboard"); // dashboard for now
    }

    const listing = await Listing.getListingById(request.listing_id);
    if (!listing) {
        console.error("no listing found");
        return res.redirect("/dashboard");
    }

    // permission check
    // i m not sure about this check
    // i need to check if the user that want to message is either a requester or an owner? wait i don' tknow in here

    if (parseInt(uId) !== listing.user_id && parseInt(uId) !== request.requester_id) {
        console.error("permission errror");
        return res.redirect("/dashboard");
    }

    const messages = await Message.getMessagesByRequestId(requestId);

    res.render("messages", {
        messages:messages,
        request:request,
        listing:listing,
        uId:uId
    });
});

// post route message
app.post("/requests/:id/messages", requireLogin, async function(req, res) {
    const requestId = req.params.id;
    const uId = req.session.uId;

    const request = await Request.getRequestById(requestId);
    if(!request) {
        console.error("no request found");
        return res.redirect("/dashboard");
    }
    const listing = await Listing.getListingById(request.listing_id);
    if (!listing) {
        console.error("no listing found");
        return res.redirect("/dashboard");
    }

    // permission check
    if (parseInt(uId) !== listing.user_id && parseInt(uId) !== request.requester_id) {
        console.error("permission denied");
        return res.redirect("/dashboard");
    }

    const message = req.body.message.trim();

    if (!message) {
        console.error("INVALID MESSAGE");  
        return res.redirect(`/requests/${requestId}/messages`);
    }

    // determine receiverId
    let receiverId;
    if (uId === request.requester_id) {
        receiverId = listing.user_id;
    } else {
        receiverId = request.requester_id;
    }

    await Message.createMessage(requestId, uId, receiverId, message);
    await Notification.create(
        receiverId, 
        "message", 
        "You have a new message",
        `/requests/${requestId}/messages`
    );
    res.redirect(`/requests/${requestId}/messages`);
});

// ajax api for messages
app.get("/api/requests/:id/messages", requireLogin, async function(req, res) {
    const requestId = req.params.id;
    const uId = parseInt(req.session.uId);

    const request = await Request.getRequestById(requestId);
    if (!request) {
        console.error("no rquest found");
        return res.status(404).json({ error: "Request not found"});
    }

    const listing = await Listing.getListingById(request.listing_id);
    if (!listing) {
        console.error("no lisitng found");
        return res.status(404).json({ error: "Listing not found"});
    }

    // permission check
    if (uId !== listing.user_id && uId !== request.requester_id) {
        console.error("permission denied");
        return res.status(404).json({ error: "Permission denied"});
    }

    // determine receiverId // i mixed thiese up with post route
    // let receiverId;
    // if (uId === request.requester_id) {
    //     receiverId = listing.user_id;
    // } else {
    //     receiverId = request.request_id;
    // }
    const messages = await Message.getMessagesByRequestId(requestId);

    return res.json(messages);

    // await Message.createMessage(requestId, uId, receiverId, message);
});


app.get("/requests/:listingId/start-chat", requireLogin, async function (req, res) {
    const listingId = req.params.listingId;
    const uId = req.session.uId;

    const listing = await Listing.getListingById(listingId);
    if(!listing) {
        console.error("no listing found");
        return res.redirect("/dashboard");
    }

    if (parseInt(uId) === listing.user_id) {
        console.error("Cannot chat on your own listing");
        return res.redirect("/dashboard");
    }

    // check if request already exists
    let request = await Request.findByUserAndListing(uId, listingId);

    if (!request) {
        const requestId = await Request.createRequest(uId, listingId, true);
        request = { request_id : requestId };
    }

    // redirect to chat
    res.redirect(`/requests/${request.request_id}/messages`);
});

// confirm route for request
app.post("/requests/:id/confirm", requireLogin, async function (req, res) {
    const requestId = req.params.id;
    await Request.confirmRequest(requestId);
    res.redirect(`requests/${requestId}/messages`);
});


// chats
app.get("/my-chats", requireLogin, async function (req, res) {
    const uId = req.session.uId;
    const chats = await Message.getUserChats(uId);
    res.render("my-chats", {chats});
});

// notifications read
app.get("/notifications/:id/read", requireLogin, async function (req, res) {
    const notificationId = req.params.id;
    await Notification.markAsRead(notificationId);

    const notification = await Notification.getById(notificationId);
    if (!notification) {
        return res.redirect("/dashboard");
    }
    res.redirect(notification.link);
});

// api route for notifications
app.get("/api/notifications", requireLogin, async function (req, res)  {
    const userId = req.session.uId;

    const notifications = await db.query(
        `select * from notifications
         where user_id = ?
         and is_read = false
         order by created_at desc
         limit 5`,
        [userId]
    );

    const unreadCount = await db.query(
        `select count(*) as count
         from notifications
         where user_id = ?
         and is_read = false`,
         [userId]
    );
    res.json({
        unreadCount: unreadCount[0].count,
        notifications: notifications
    });
});

// Create a route for root - / home page
app.get("/", async function(req, res) {
    const listings = await Listing.getRecentListings();
    res.render("home-page", {
        listings:listings
    });

    console.log("THIS IS THE HOME PAGE RETURNED OBJECTS");
    console.log(listings);
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
    });
    
    res.render("all-users-formatted", {
        results: results
    });
    console.log("i can see all the users that will be formatted in here");
    console.log(results);

});

app.get("/single-user/:id", async function(req, res) {
    const profileUserId = req.params.id;
    let user = new User(profileUserId);
    await user.getUser();
    user.setImagePath();
    let listings = await Listing.getListingsByUserId(profileUserId);

    // get average rating for the user
    const ratingData = await Rating.getAverageRating(profileUserId);
    console.log("RATING DATA: ", ratingData);

    // get reviews for the user
    const reviews = await Rating.getRatingsForUser(profileUserId);

    res.render("user", {
        user:user,
        listings:listings,
        ratingData:ratingData,
        reviews:reviews
    });
    // console.log("now i need to be seeing a user with a givn id");
    // console.log(user);
    // console.log("these are the listings of the current user");
    // console.log(listings);
});

// listings

app.get("/all-listings-formatted", async function(req, res) {
    const sql = `select l.*, c.category_name
                        from listings l
                        join categories c on l.category_id = c.category_id`;
    const result = await db.query(sql);
    result.forEach(listing => {
        if (listing.photo_url_1) {
            listing.image_path = `/images/listings/${listing.photo_url_1}`;
        } else {
            listing.image_path = `/images/listings/default-listing-pic.jpg`;
        }
    });
    const tags = await Listing.getAllTags();
    res.render("all-listings-formatted", {
        listings:result,
        tags:tags
    });
    console.log(result);
    console.log("these are the tags only");
    console.log(tags);

});

app.get("/listing-detail/:listing_id", async function (req, res){
    const uId = req.session.uId;
    
    const listing_id = req.params.listing_id;

    let listing = new Listing(listing_id);
    await listing.getListingData();

    let hasRequested = false;

    if (uId) {
        hasRequested = await Request.hasUserRequested(uId, listing_id);
    }

    listing.setImagePath();
    res.render("listing-detail", {
        listing:listing,
        hasRequested:hasRequested,
        uId:uId
    });
    console.log(listing);
});

// categories
// app.get("/all-categories", async function(req, res) {
//     const categories = await Category.getAllCategories();
//     // const category_id = categories[0]
//     // const total = await Category.getListingsCountByCategory(category_id);
//     res.render("all-categories", {
//         categories:categories
//     });
//     console.log("i am checking whether categories loading or not");
//     console.log(categories);
// });

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