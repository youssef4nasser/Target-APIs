import {globalErrorMiddleware} from "./middleware/globalErrorMiddleware.js"

export const bootstrap = (app)=>{
    app.get("/", (req, res) => {
        res.send({message: 'Hello World!'})
    })
    app.all('*', (req, res, next)=>{
        next(new AppError('Not found endpoint', 404))
    })
    // error middleware
    app.use(globalErrorMiddleware)
}