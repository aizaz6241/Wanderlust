                        // This init folder is for the initialization of data in Database

const mongoose = require("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js")

const mongoURL = "mongodb://127.0.0.1:27017/wanderlust"


                            // Database Connection

async function main(){
    mongoose.connect(mongoURL);
}

main()
 .then(()=>{
    console.log("Connected to Wanderlust Database")
 })
 .catch(()=>{
    console.log("Error while connecting to database")
 })


                //initialization function


async function initDB  (){

    await Listing.deleteMany({})

    initData.data = initData.data.map((obj)=>({ ...obj, owner:'6875b600df5c11919b3ce8dc'}))

    await Listing.insertMany(initData.data)
    console.log("Data was saved")

}

initDB()
