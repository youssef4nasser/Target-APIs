import { nanoid } from "nanoid";
import { userModel } from "../../../DataBase/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import { sendEmail } from "../../utils/email.js";
import bcrypt, { compare } from "bcrypt"
import Jwt from "jsonwebtoken";
import {OAuth2Client} from 'google-auth-library'
import axios from "axios";

//  ******************************* sign up ***************************

export const SignUp= catchError(
    async(req,res,next)=>{
        const {userName,email,password} = req.body 
        const userExist= await userModel.findOne({email})
        if(userExist) return next (new AppError("Email already exist ",409));

        const code = nanoid(4);
        sendEmail(email, "Confirm Your Email... ", `Code : ${code}`);

        const hashPass = bcrypt.hashSync(password, +process.env.Hash_Round);
        await userModel.create({
            userName,
            email,
            password:hashPass ,
            codeConfirmEmail:code,
        })
        res.status(200).json({message:" Done... PLZ Go To Confirm Your Email"})
})

//  ******************************* Confirm By code ***************************

export const confirm_Code= catchError(
    async(req,res,next)=>{
        const {email, code}= req.body 
        const userExist= await userModel.findOne({email})
        if(!userExist) return new AppError("email not found ",409);

        if(userExist.codeConfirmEmail == code && userExist.isVerified==false) {
            const confiermedEmail = await userModel.findOneAndUpdate(
                {email},
                {isVerified:true , codeConfirmEmail:null},
                {new:true}
            )
            return res.status(200).json({message:"email confiermed", user: confiermedEmail})
        }
        return next(new AppError('Email already confiermed', 409 )) 
})

//  ******************************* sign in ***************************

export const SignIn= catchError(
    async(req,res,next)=>{
    const {email,password} = req.body  
    const userExist= await userModel.findOne({email})
    if(!userExist || !bcrypt.compareSync(password, userExist.password)) return next(new AppError("incorrect email or password...", 409))
    if(!userExist.isVerified) return next(new AppError("please confirm your email first",409))

    const accses_token= Jwt.sign({
        email,
        id:userExist._id,
        userName:userExist.userName,
        role:userExist.role},
        process.env.Access_TOKEN_Signture,
        );

     res.status(200).json({message:" Done...",token:accses_token})
})

//  ******************************* forgetPassword ***************************

export const forgetPassword = catchError(
    async(req,res,next)=>{
        const {email}= req.body 
        const userExist= await userModel.findOne({email})
        if(!userExist) return next(new AppError("Email not exist ",409))

        const code = nanoid(4);

        sendEmail(email, "Reset Your Password.",`Code : ${code}`);;

        await userModel.findOneAndUpdate({email},{codeForgetPassword:code},{new:true})

        return res.status(200).json({message:" Done... PLZ check Your email "})
})

//  ******************************* resetPassword ***************************

export const resetPassword= catchError(
    async(req,res,next)=>{
        const{newPassword,email,code}= req.body;
        // find user
        const existUser= await userModel.findOne({email})
        if(!existUser) return next( new AppError("user not found ",404));
        // Hash new Password
        const hashPass = bcrypt.hashSync(newPassword, +process.env.Hash_Round);

        if(existUser.codeForgetPassword == code ) {
            await userModel.findOneAndUpdate(
                {email},
                {password:hashPass , codeForgetPassword:null},
                {new:true}
            )
        }else{
            return next(new AppError("expire code!",404));
        }
        return res.status(200).json({message:"Done New Password", existUser})
})

//  ******************************* loginGoogle ***************************

export const loginGoogle = catchError(
    async(req,res,next)=>{
        const {idToken} = req.body
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            return payload
        }
        const {given_name, family_name, email, email_verified, picture} = await verify()
        
        if(!email_verified) return next(new AppError('Email not verified with Google', 409 ) )
        
        const user = await userModel.findOne({email,  provider: "Google"})
        // LoginUser
        if(user){
            const accses_token= Jwt.sign({
                email,
                id:user._id,
                firstName:user.firstName},
                process.env.Access_TOKEN_Signture,
                {expiresIn:30*60});
            
            const ref_token=  Jwt.sign({
                email,
                id:user._id,
                firstName:user.firstName}
                ,process.env.Refresh_TOKEN_Signture,
            { expiresIn:60*60*24*365}
            );
            return res.status(200).json({message:" Done", token:accses_token,ref_token})    
        }
        // SignupUser
        const SignupUser = await userModel.create({
            firstName: given_name,
            lastName: family_name,
            email,
            image: picture,
            isVerified: email_verified,
            password: bcrypt.hashSync(nanoid(6), +process.env.Hash_Round),
            provider: "Google"
        })
        const accses_token = Jwt.sign({
            email,
            id:SignupUser._id,
            firstName:SignupUser.firstName},
            process.env.Access_TOKEN_Signture,
            {expiresIn:30*60});

        const ref_token=  Jwt.sign({
            email,
            id:SignupUser._id,
            firstName:SignupUser.firstName},
            process.env.Refresh_TOKEN_Signture,
            {expiresIn:60*60*24*365}
        );
        return res.status(201).json({message: "Done",token:accses_token, ref_token, user:SignupUser})
    }
)

//  ******************************* loginFacebook ***************************

export const loginFacebook = catchError(
    async(req, res)=> {
        const { accessToken } = req.body;
        const { data } = await axios.get(`https://graph.facebook.com/me?fields=id,name,picture,email&access_token=${accessToken}`);

        const user = await userModel.findOne({email: data.email,  provider: "Facebook"})
        // LoginUser
        if(user){
            const accses_token= Jwt.sign({
                email: user.email,
                id: user._id,
                firstName: user.firstName},
                process.env.Access_TOKEN_Signture,
                {expiresIn:30*60});
            
            const ref_token=  Jwt.sign({
                email: user.email,
                id: user._id,
                firstName: user.firstName},
                process.env.Refresh_TOKEN_Signture,
                {expiresIn:60*60*24*365}
            );
            return res.status(200).json({message:" Done", token:accses_token,ref_token})    
        }
        // SignupUser
        const SignupUser = await userModel.create({
            firstName: data.name.split(" ")[0],
            lastName: data.name.split(" ")[1],
            email: data.email,
            image: data.picture.data.url,
            isVerified: true,
            password: bcrypt.hashSync(nanoid(6), +process.env.Hash_Round),
            provider: "Facebook"
        })
        const accses_token = Jwt.sign({
            email:SignupUser.email,
            id:SignupUser._id,
            firstName:SignupUser.firstName},
            process.env.Access_TOKEN_Signture,
            {expiresIn:30*60});

        const ref_token=  Jwt.sign({
            email:SignupUser.email,
            id:SignupUser._id,
            firstName:SignupUser.firstName},
            process.env.Refresh_TOKEN_Signture,
            {expiresIn:60*60*24*365}
        );
        return res.status(201).json({message:" Done", token:accses_token,ref_token})    
    }
)
