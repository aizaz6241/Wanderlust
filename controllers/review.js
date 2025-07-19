const Review = require("../models/reviews.js")
const Listing = require("../models/listing.js")


        // Posting Reveiw Route

module.exports.postReview = async(req, res)=>{         

    let {id} = req.params;
    let listing = await Listing.findById(id)
    let newReview = new Review (req.body.review) 
    newReview.author= req.user._id
    listing.reviews.push(newReview)

    
    await newReview.save()
    await listing.save()

    req.flash("success", "Review Added Successfully")
    res.redirect(`/listings/${id}`)

}

        // Deleting Review Route

module.exports.deleteReview =  async (req, res)=>{          
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    
    req.flash("success", "Review deleted Successfully   ")
    res.redirect(`/listings/${id}`)

}