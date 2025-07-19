
const User = require("../models/user")

        // render sign-up form

module.exports.renderSignupFrom =(req, res)=>{
    res.render("./users/signup.ejs")
}

        // register user

module.exports.registerUser = async (req, res)=>{

    try{

        let {username, email, password} = req.body;
        let newUser = new User ({
        email: email,
        username: username
        })

        let registeredUser = await User.register(newUser, password)

        req.login(registeredUser, (err)=>{
            if(err){
                return next(err)
            }
            req.flash("success", "User Registered Successfully")
            res.redirect("/listings")
        })

        

    }catch(err){

        req.flash("error", err.message)
        res.redirect("/signup")
    }

    
}

        // render login form

module.exports.renderLoginForm = (req, res)=>{  
    res.render("./users/login.ejs")
    
}

        // login user

module.exports.loginUser =  async(req, res)=>{
        req.flash("success", "Welcome to Wanderlust")
        let redirectUrl = res.locals.redirectUrl || "/listings"
        console.log(redirectUrl)
        res.redirect(redirectUrl)
}

        // logout user

module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if (err){
            return next(err)
        }
        req.flash("success", "Logged Out Successfully!")
        res.redirect("/login")
    })
}