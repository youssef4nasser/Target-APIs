
import mongoose from "mongoose";
import express from "express"
import * as authController from "./auth.controller.js";

const authnRouter = express.Router();

authnRouter.post('/signUp',authController.SignUp)
authnRouter.post('/SignIn',authController.SignIn)
// *********************confirm with code****************************

authnRouter.patch('/confirme',authController.confirm_Code);




// ********************confirm with link***************************8

// authnRouter.patch('/confirme/:token',authController.confirm_Link);

// forget Password


authnRouter.patch('/forgetPassword',authController.forgetPassword);
 authnRouter.patch('/resetPassword/:token',authController.resetPassword);


export default authnRouter