const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js")
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware.js")
const userController = require("../controllers/user.js")


        

router
   .route("/signup")

   // render signup form
   .get( userController.renderSignupFrom)

   // register user
   .post(wrapAsync(userController.registerUser))

        

router
   .route("/login")

   // render login form
   .get( userController.renderLoginForm)

   // login user 
   .post( saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true}), userController.loginUser)

        
        // logout user

router.get("/logout",userController.logout)

module.exports = router