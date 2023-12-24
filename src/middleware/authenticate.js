import { AppError } from "../utils/AppError.js"
import { catchError } from "../utils/catchError.js"
import { userModel } from "../../DataBase/models/user.model.js"
import Jwt from "jsonwebtoken"

export const authenticate = catchError( async (req, res, next)=>{

        const {token} = req.headers
        // check if token not provide ()
        if(!token) return next(new AppError("Token is required", 401))
        // cheack Bareer_token (team__ )
        if(!token?.startsWith(process.env.BARER_TOKEN)) return next(new AppError('Invalid token', 403))
       
         // verify the token without Bareer_token
        const originToken= token?.split(process.env.BARER_TOKEN)[1]
        const decoded = Jwt.verify(originToken, process.env.Access_TOKEN_Signture)
        if(!decoded?.id){
            return next(new AppError('Invalid token', 403))
        }
        // Verifiy Finding User
        const user = await userModel.findById(decoded?.id)
        if(!user){
            return next(new AppError('User not found'))
        }

        // check token after change password


        if(user.changePasswordAt){
            let changePasswordDate= parseInt( user.changePasswordAt.getTime() /1000)
        
            if(changePasswordDate > decoded.iat) {
                 next(new AppError('token not valid',401));
            }
        }

        // ............

        req.user = user
        next()
    }
)
