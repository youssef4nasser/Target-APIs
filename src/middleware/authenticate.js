import { AppError } from "../utils/AppError.js"
import Jwt from "jsonwebtoken"
import { catchError } from "../utils/catchError.js"

export const authenticate = catchError(
    async (req, res, next)=>{
        const {token} = req.headers
        // check fi token not provide
        if(!token) return next(new AppError("Token is required", 401))
        // verify the token
        const decoded = Jwt.verify(token, process.env.JWT_SEC)
        if(!decoded?.id){
            return next(new AppError('Invalid token', 403))
        }
        // Verifiy Finding User
        const user = await userModel.findById(decoded?.id)
        if(!user){
            return next(new AppError('User not found'))
        }

        // check token after change password
        // ............

        req.user = user
        next()
    }
)
