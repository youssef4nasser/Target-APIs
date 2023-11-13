import {globalErrorMiddleware} from "./middleware/globalErrorMiddleware.js"
<<<<<<< HEAD
import brandRouter from "./modules/brand/brand.routes.js"
import categoryRouter from "./modules/category/category.routes.js"
import subCategoryRouter from "./modules/subCategory/subCategory.routes.js"
=======
import authnRouter from "./modules/Auth/auth.routes.js"
>>>>>>> 1bc340ae92bf65e3ae3c8ca771209cb44e345432
import { AppError } from "./utils/AppError.js"

export const bootstrap = (app)=>{
    app.get("/", (req, res) => {
        res.send({message: 'Hello World!'})
    })
<<<<<<< HEAD
    app.use('/api/v1/brands', brandRouter)
    app.use('/api/v1/categories', categoryRouter)
    app.use('/api/v1/subCategories', subCategoryRouter)
=======
// Authentication (endpoint)
app.use('/api/v1/auth',authnRouter)



>>>>>>> 1bc340ae92bf65e3ae3c8ca771209cb44e345432
    app.all('*', (req, res, next)=>{
        next(new AppError('Not found endpoint', 404))
    })
    // error middleware
    app.use(globalErrorMiddleware)
}