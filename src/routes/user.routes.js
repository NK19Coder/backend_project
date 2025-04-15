import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
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


export default router;