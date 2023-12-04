import { AppError } from "../utils/AppError.js"
import { catchError } from "../utils/catchError.js"

export const allowedTo = (...roles)=>{
    return catchError(
        async(req, res, next)=>{
            if(!roles.includes(req.user.role)){
                return next(new AppError('its for ' + (req.user.role) + " check your role",401))
            }
            next()
        }
    )
}