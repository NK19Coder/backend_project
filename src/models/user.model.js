import mongoose from "mongoose";
import jwt from "jsonwebtoken"; 
import bcrypt from "bcryptjs"; 

const userSchema = new mongoose.Schema(
    {
        
        watchHistory:[
            { 
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video",
            }
        ], 
        username:{
            type: String,
            required: true, 
            unique: true,
            lowercase: true,
            trim: true,
            index: true 
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true 
        },
        fullname:{
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avtar:{
            type: String,
            required: true 
        },
        coverImg: {
            type: String, 
        },
        password:{
            type: String,
            required: [true,'Password is Required']
        },
        refreshToken:{ 
            type: String 
        }
    },{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next() 
    }else{
    this.password = bcrypt.has(this.password,10) // hashing password using bcryptjs
    next()
    }  
}) // pre hook for hashing password before saving to db
  
userSchema.methods.isPasswordMatched = async function(password){
    return await bcrypt.compare(password,this.password) // comparing password using bcryptjs
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }) // generating access token using jsonwebtoken
}      
 
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        { 
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }) // generating refresh token using jsonwebtoken
}
 
export const User = mongoose.model("User",userSchema)