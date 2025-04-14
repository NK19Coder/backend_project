import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router(); 

router.route("/register").post(registerUser)
//after coming from app.js it will go to fucntion userRegister in controller 


export default router;