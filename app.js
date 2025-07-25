                            // Requiring Packages
if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}


const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const path = require("path")
const ejsMate = require("ejs-mate")
const session = require("express-session")
const MongoStore = require('connect-mongo');
const cookie = require("cookie-parser")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")


const User = require("./models/user.js")

const mongoURL = "mongodb://127.0.0.1:27017/wanderlust"
const dbUrl = process.env.ATLASDB_URL;

const ExpressError = require("./utils/ExpressError.js");


const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "public")))
app.use(methodOverride('_method'))


app.engine("ejs", ejsMate)


                            // Setting Up Database

async function main(){
    mongoose.connect(dbUrl);
}

main()
 .then(()=>{
    console.log("Connected to Wanderlust Database")
 })
 .catch(()=>{
    console.log("Error while connecting to database")
 })

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
})

store.on("error", ()=>{
    console.log("Error in Mongo Session Store")
})

const sessionOptions = ({
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true ,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true

    }
})



app.use(session(sessionOptions))
app.use(flash())


app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


                            // Setting Up Routes 

app.listen(port, (req, res)=>{

    console.log("Servier is listening on Port: ", port)

} )

// app.get("/", (req, res)=>{
//     res.send("Hi i am root")
// })


app.use((req, res, next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user
    next()
})


                        // Listing Routes

app.use("/listings", listingRouter)

                            //Review Routes

app.use("/listings/:id/reviews", reviewRouter)

                            //User Routes

app.use("/", userRouter)

                            //Other Routes


app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"))
})

        //Error Handling MiddleWare

app.use((err, req, res, next)=>{                                   
   
    let {statusCode = 500, message = "Some Issue"} = err
    res.status(statusCode).render("error.ejs", {message})
})




