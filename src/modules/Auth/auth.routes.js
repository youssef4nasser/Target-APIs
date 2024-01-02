import express from "express"
import * as authController from "./auth.controller.js";

const authnRouter = express.Router();

authnRouter.post('/signUp',authController.SignUp)
authnRouter.post('/SignIn',authController.SignIn)
// *********************confirm with code****************************
authnRouter.post('/confirme',authController.confirm_Code);
// ********************* forget Password ****************************
authnRouter.post('/forgetPassword',authController.forgetPassword);
authnRouter.patch('/resetPassword',authController.resetPassword);

export default authnRouter
