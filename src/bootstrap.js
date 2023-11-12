import {globalErrorMiddleware} from "./middleware/globalErrorMiddleware.js"
import authnRouter from "./modules/Auth/auth.routes.js"
import { AppError } from "./utils/AppError.js"

export const bootstrap = (app)=>{
    app.get("/", (req, res) => {
        res.send({message: 'Hello World!'})
    })
// Authentication (endpoint)
app.use('/api/v1/auth',authnRouter)



    app.all('*', (req, res, next)=>{
        next(new AppError('Not found endpoint', 404))
    })
    // error middleware
    app.use(globalErrorMiddleware)
}