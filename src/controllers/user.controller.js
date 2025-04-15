import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
  //register user function
  //get user details from frontend or postman
  //validation lena hoga sabka  -> not empty
  //check if user is already present in db or not :username,email
  //check for images , check for avtar
  //upload them to coludnary , avatar 
  //create user object - create entry in db
  // remove passowrd and refresh token fields from user object
  //check for user creation
  //return response to frontend or postman or the error if not 

  const {fullName, email, username, password } = req.body 
    console.log("email : ",email) 

    // if(fullName === ""){
    //     throw new ApiError(400, "Full name is required")
    // } 

    if(
        [fullName,email,username,password].some((field)=> field?.trim()==="")
    ){
        throw new ApiError(400, "All fields are required")
    }      
     
   const existedUser = await User.findOne({$or: [{email}, {username}]}) //findOne will return the first one
    if(existedUser){
        throw new ApiError(409, "User already exists")
    }  

    // console.log(req.files);  
 
    const avatarLocalPath = req.files?.avatar[0]?.path; 
    // const coverImgLocalPath = req.files?.coverImg[0]?.path;
    let coverImgLocalPath  // Initialize coverImgLocalPath 
    if(req.files && Array.isArray(req.files.coverImg) && req.files.coverImg.length > 0){
        coverImgLocalPath = req.files.coverImg[0].path; // Assign the path if it exists
    }
  
    if(!avatarLocalPath){ 
        throw new ApiError(400, "Avatar is required")
    } 

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImg = await uploadOnCloudinary(coverImgLocalPath)

    
    if(!avatar){ 
        throw new ApiError(400, "Avatar is required")
    } 

   const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImg: coverImg?.url || "",
        email,
        password,
        username: username.toLowerCase()
    }) 
 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" // - means exclude these fields from the user object
    ) 
    
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while creating the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
    ) 
 
})                    
  
export {registerUser}  