
const Listing = require("./models/listing")
const Review = require("./models/reviews")
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next)=>{
   
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "You must be LoggedIn ")
        return res.redirect("/login")
    }
    next()
}


module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async (req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)

    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error", "You don't have permission")
        return res.redirect(`/listings/${id}`)
    }

    next()
}


module.exports.validateListing = (req, res, next)=>{

    let {error} = listingSchema.validate(req.body)
    if(error){
        throw new ExpressError(400, error.message)
    }else{
        next()
    }

}

module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body)
    if(error){
        throw new ExpressError(400, error.message)
    }else{
        next()
    }
}

module.exports.isReviewAuthor = async (req, res, next)=>{
    let {id ,reviewId} = req.params
    let review = await Review.findById(reviewId)
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "You Did Not Create this Review")
        return res.redirect(`/listings/${id}`)
    }
    next()
}