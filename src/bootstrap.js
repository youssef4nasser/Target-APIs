import {globalErrorMiddleware} from "./middleware/globalErrorMiddleware.js"
import brandRouter from "./modules/brand/brand.routes.js"
import categoryRouter from "./modules/category/category.routes.js"
import subCategoryRouter from "./modules/subCategory/subCategory.routes.js"
import authnRouter from "./modules/Auth/auth.routes.js"
import { AppError } from "./utils/AppError.js"
import couponRouter from "./modules/coupon/coupon.routes.js"
import productRouter from "./modules/product/product.routes.js"
import reviewRouter from "./modules/review/review.routes.js"
import wishlistRouter from "./modules/wishlist/wishlist.routes.js"

export const bootstrap = (app)=>{
    app.get("/", (req, res) => {
        res.send({message: 'Hello World!'})
    })
    app.use('/api/v1/auth',authnRouter)
    app.use('/api/v1/brands', brandRouter)
    app.use('/api/v1/categories', categoryRouter)
    app.use('/api/v1/subCategories', subCategoryRouter)
    app.use('/api/v1/coupons', couponRouter)
    app.use('/api/v1/products', productRouter)
    app.use('/api/v1/reviews', reviewRouter)
    app.use('/api/v1/wishlist', wishlistRouter)
    app.all('*', (req, res, next)=>{
        next(new AppError('Not found endpoint', 404))
    })
    // error middleware
    app.use(globalErrorMiddleware)
}