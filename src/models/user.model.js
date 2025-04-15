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
    this.password = await bcrypt.has(this.password,10) // hashing password using bcryptjs
    next()
    }    
}) // pre hook for hashing password before saving to db
  
userSchema.methods.isPasswordMatched = async function(password){
    return await bcrypt.compare(password,this.password) // comparing password using bcryptjs
} 

//AccessToken -> check if user is logged in or not -> short term 
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
 
//RefreshToken -> used to create new access token -> long term
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


// when the access token expires we can use the refresh token to get a new access token

//Structure of JWT
// xxxxx.yyyyyy.zzzzzz
//  parts -> 1. Header -> contain algorithim and type of token
//           2. Payload -> contain data of user (like user_id)
//           3. Signature -> contain secret key and header and payload

//FLOW OF JWT
// 1. User login -> server will validates the creditanls ->server will generate access token and and refresh token
//->Access token stored in memory/local storage -> refresh token stroed in cookie(http)
//->client send access token in header of every request to server/API call -> server will verfiy the access token and respond
//->access token expires after some time -> client will send refresh token to server -> server will verify the refresh token and generate new access token and send it to client -> client will use the new access token for further requests
