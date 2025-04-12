// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";
// import {app} from './app.js'
dotenv.config({
    path: './.env'
})


   
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`Server is running at port : ${process.env.PORT}`)
    })          
}) 
.catch((err)=>{
    console.log("MONGO DB connection falied",err) 
})


 

//Approach 1 in which everthing is in IIFE and in index file
//But we have written all the code in one file only 
//So this is a appraoch but we can have an better approach


// import express from "express";
// const app = express()  
// (async () => {
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        app.on("error",(error)=>{
//         console.log("Error",error)
//         throw error  
//        })
 
//        app.listen(process.env.PORT,()=>{
//         console.log(`App is listening on port ${process.env.PORT}`)
//        })

//     }catch(error){
//         console.log("ERROR: ",error) 
//         throw err  
//     }
// })()  