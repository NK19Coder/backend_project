import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"

const generateAccesAndRefreshToken = async (userId) =>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken // setting refresh token in user object
        await user.save({validateBeforeSave: false}) // saving user object in db
 
        return {accessToken, refreshToken} // returning access token and refresh token
    }catch(error){  
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}


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

const loginUser = asyncHandler(async (req,res)=>{
    // req body -> data le aao
    // username or email
    //find the user in db
    //password check
    //access and refresh token send krna hai user ko
    //send secure cookie to the user

    const{email,username,password} = req.body
    if(!username && !email){
        throw new ApiError(400, "Username or email is required")
    }    
 
   const user = await User.findOne({$or:[{email},{username}]})
    if(!user){
        throw new ApiError(401, "Invalid credentials")
    }
   const isPasswordValid = await user.isPasswordMatched(password) // check password using bcryptjs
     
   if(!isPasswordValid){ 
    throw new ApiError(401, "Invalid Password") 
}     

const {accessToken, refreshToken} = await generateAccesAndRefreshToken(user._id)

const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken" // - means exclude these fields from the user object
)

const options ={
    httpOnly: true,
    secure: true
}
  
return res
        .status(200)
        .cookie("accessToken",accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            {
            user: loggedInUser,
            accessToken,
            refreshToken 
        },
        "User Logged In Successfully")
         ) 

})


const logoutUser = asyncHandler(async (req,res)=>{
    User.findByIdAndUpdate(
        req.user._id, 
        { 
            $set:{
                refreshToken: undefined // set refresh token to undefined
            }
        },
        {new:true} 
    )
    const options ={
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options) // clear access token cookie
        .clearCookie("refreshToken", options) // clear refresh token cookie
        .json(new ApiResponse(
            200,
            {}, 
            "User Logged Out Successfully"
        ))
    
})


// const existingUser = await User.findOne({ email: "nishantkumarcoder@gmail.com" });
// console.log("Existing user:", existingUser);



export {registerUser, loginUser, logoutUser}   