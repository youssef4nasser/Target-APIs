/*
1- sign up 
(confirm email(acces token && refresh token) /  )

2- signIn 
(accses token /refresh token )

3- forget password 

4- soicail login 
(login By facebook or google)

*/

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

export const SignUp= catchError(async(req,res,next)=>{
const {firstName,lastName,email,password}= req.body 
const userExist= await userModel.findOne({email})
if(userExist) return new AppError("email already exist ",409);
// %%%%%%%% confirm email (link or code )
//  1- code## 
// (// // user.codeConfirmEmail=code ) if use code put this line in userModel
// const code = nanoid(4);
// sendEmail(email,"Confirm Your Email... ",`<h1>CODE:  ${code} </h1>`);
// 2- link##
const token= Jwt.sign({email},process.env.Confirm_TOKEN_Signture, { expiresIn:30*60});
const link = `${req.protocol}://${req.headers.host}/api/v1/auth/confirme/${token}`
const ref_token= Jwt.sign({email},process.env.Confirm_refToken_Signture);
const ref_link = `${req.protocol}://${req.headers.host}/api/v1/auth/confirme/${ref_token}`
sendEmail(email,
    "Confirm Your Email... ",
    `<a href="${link}> Confirm  Email </a> 
    <a href="${ref_link}> Confirm  Email </a>
    `);

// ------------
const hashPass= bcrypt.hashSync(password, +process.env.Hash_Round);
 await userModel.create({
    firstName,
    lastName,
    email,
    password:hashPass ,
    provider: "Systeme"
})
 res.status(200).json({message:" Done... PLZ Go To Confirm Your Email ",link})
})


//  ******************************* sign in ***************************

export const SignIn= catchError(async(req,res,next)=>{
    const {email,password}= req.body  
    const userExist= await userModel.findOne({email})
    if(!userExist || !bcrypt.compareSync(password, userExist.password)) return next(new AppError("incorrect email or password... ",409))
    if(!userExist.isVerified) return next(new AppError("please confirm your email first",409))

    const accses_token= Jwt.sign({
        email,
        id:userExist._id,
        firstName:userExist.firstName},
        process.env.Access_TOKEN_Signture,
        {expiresIn:30*60});
       
    const ref_token=  Jwt.sign({
        email,
        id:userExist._id,
        firstName:userExist.firstName}
        ,process.env.Refresh_TOKEN_Signture,
       { expiresIn:60*60*24*365}
      );
  
    // ------------
    
    return res.status(200).json({message:" Done",token:accses_token,ref_token})
    
})



//  ******************************* Confirm By code ***************************

// export const confirm_Code= catchError(async(req,res,next)=>{
   
//     const {email, code}= req.body 
//     const userExist= await userModel.findOne({email})
//     if(!userExist) return new AppError("email already exist ",409);

//     if(!userExist.codeConfirmEmail) return new AppError("incorrect code",409);


//    if(userExist.codeConfirmEmail == code&& userExist.isVerified==false  ) {
//       await userModel.findOneAndUpdate(
//         {email,isVerified:false},
//         {isVerified:true},
//         {new:true}
//      )
    
//     }


    
//     userExist? 
//     res.status(200).json({message:"email confiermed PLZ login",userExist}):
//      next(new AppError('user not found or already confiermed', 409 ) ) 
    
//     })

//  ******************************* Confirm By link ***************************


export const confirm_Link= catchError(async(req,res,next)=>{
   
    const{ token }= req.params 
  
    if(!token) return new AppError("invalid token ",409);
const decoded = Jwt.verify(token,process.env.Confirm_TOKEN_Signture)
if(!decoded) return new AppError("invalid token verfiy ",409);
 
   const user=   await userModel.findOneAndUpdate(
        {email:decoded?.email,isVerified:false},
        {isVerified:true},
        {new:true}
     )
    
    user? 
    res.status(200).json({message:"email confiermed PLZ login",user}):
     next(new AppError('user not found or already confiermed', 409 ) ) 
    
})


//  *******************************forget Password ***************************

export const forgetPassword = catchError(async(req,res,next)=>{
const {email}= req.body 
const userExist= await userModel.findOne({email})
if(!userExist) return new AppError("email not exist ",409);
// %%%%%%%% create (hasing code and token )
//  1- code## 

const code = nanoid(4);
const hashCode= bcrypt.hashSync(code, +process.env.Hash_Round);

// 2- link && token##
const token_forgetPass= Jwt.sign(
    { email,code:hashCode},
    process.env.Token_forgetPass_TOKEN_Signture,
     { expiresIn:30*60}
     );
const link = `${req.protocol}://${req.headers.host}/api/v1/auth/resetPassword/${token_forgetPass}`

sendEmail(email,
    "reseet Password... ",
    `<a href="${link}> Reseet Password </a> 

    `);

// ------------
 await userModel.updateOne({email},{codeForgetPassword:hashCode},{new:true})



 res.status(200).json({message:" Done... PLZ Go To Reaset Your ForgetPassword ",link})

})

//  ******************************* resetPassword ***************************
export const resetPassword= catchError(async(req,res,next)=>{

    const{ token }= req.params 
    const{newPassword}= req.body
    if(!token) return new AppError("invalid token ",409);
const decoded = Jwt.verify(token,process.env.Token_forgetPassSignture)
if(!decoded) return new AppError("invalid token verfiy ",409);
const existUser= await userModel.findOne({email:decoded?.email})
if(!existUser) return new AppError("user not found ",409);
    if(decoded.code != existUser.codeForgetPassword) return new AppError("invalid token ",409);

const hashPass= bcrypt.hashSync(newPassword, +process.env.Hash_Round);

    const user=   await userModel.findOneAndUpdate(
        {email:decoded?.email,codeForgetPassword:decoded?.code},
        {password:hashPass},
        {new:true}
        )

        user? 
    res.status(200).json({message:"Done New Password",existUser}):
        next(new AppError('user not found ', 409 ) ) 
    
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
