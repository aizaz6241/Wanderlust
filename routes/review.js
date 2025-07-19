
const wrapAsync = require("../utils/wrapAsync.js")
const Review = require("../models/reviews.js")
const Listing = require("../models/listing.js")
const {isLoggedIn, validateReview, isOwner, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/review.js")

const express = require("express")
const app = express()
const router = express.Router({mergeParams: true})
const Joi = require('joi');


                                // Schema Validation Functions



        // post review 

router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.postReview))

        // delete review

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview))


module.exports = router