import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router(); 
 
router.route("/register").post(
    upload.fields([
        {
            name: "avatar", 
            maxCount: 1
        },
        {
            name: "coverImg",
            maxCount: 1
        }   
    ]),
    registerUser
)
//after coming from app.js it will go to fucntion userRegister in controller 
//user/register will be the route for this 

router.route("/login").post(loginUser)

 
//secured routes
router.route("/logout").post(verifyJWT, logoutUser) //verifyJWT is a middleware which will check if the user is logged in or not



export default router;