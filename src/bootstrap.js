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
import addressRouter from "./modules/address/address.routes.js"
import cartRouter from "./modules/cart/cart.routes.js"
import orderRouter from "./modules/order/order.routes.js"
import userRoutes from "./modules/user/user.routes.js"
import { connectionBD } from "../DataBase/connectionDB.js"

export const bootstrap = (app)=>{
    app.use('/api/v1/auth',authnRouter)
    app.use('/api/v1/brands', brandRouter)
    app.use('/api/v1/categories', categoryRouter)
    app.use('/api/v1/subCategories', subCategoryRouter)
    app.use('/api/v1/coupons', couponRouter)
    app.use('/api/v1/products', productRouter)
    app.use('/api/v1/reviews', reviewRouter)
    app.use('/api/v1/wishlist', wishlistRouter)
    app.use('/api/v1/address', addressRouter)
    app.use('/api/v1/cart', cartRouter)
    app.use('/api/v1/order', orderRouter)
    app.use('/api/v1/user', userRoutes)
    app.use("/", (req, res, next)=>{
        res.send("welcome")
    })
    app.all('*', (req, res, next)=>{
        next(new AppError('Not found endpoint', 404))
    })
    // connection to database
    connectionBD()
    // error middleware
    app.use(globalErrorMiddleware)
    process.on('unhandledRejection', (err)=>{
        console.log(`Unhandled Rejection at: Promise ${Promise}\nReason:\n${err}\n`)
    })
}