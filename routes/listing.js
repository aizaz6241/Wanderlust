
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn} = require("../middleware.js")
const {isOwner} = require("../middleware.js")
const {validateListing} = require("../middleware.js")
const listingController = require("../controllers/listing.js")
const {storage, cloudinary} = require("../cloudConfig.js")

const multer  = require('multer')
const upload = multer({ storage})

const express = require("express")
const router = express.Router()

                                    //Routes


router
   .route("/")      

   // All Listings                                 
   .get(wrapAsync(listingController.index))

   // create new listing
   .post(
      isLoggedIn, 
      upload.single("listing[image]"), 
      validateListing,
      wrapAsync (listingController.createListing)
    )


        // render new form
router.get("/new",isLoggedIn, listingController.renderNewForm)

router
   .route("/:id")

   // Show Listing Route
   .get( wrapAsync( listingController.showListing))
        
    // update listing
   .put(isLoggedIn,isOwner,upload.single("listing[image]"), validateListing,  wrapAsync (listingController.updateListing))

    // Delete Listing
   .delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing))


        //render edit form

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm))

module.exports = router;