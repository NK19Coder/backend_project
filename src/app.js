import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"; 

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credential: true 
})) // for middleware  

app.use(express.json({
    limit:"16kb"  
}))    // for taking object 

app.use(express.urlencoded({extended:true, limit:"16kb"})) //for taking url
app.use(express.static("public")) //for taking static files
   
app.use(cookieParser()) 


//routes import

import userRoutes from "./routes/user.routes.js";

//routes declarations
app.use("/api/v1/user" , userRoutes) // for user routes
//it will redirect to route folder 
//http://localhost:8000/user/register     
export { app }     