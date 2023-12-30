import { cartModel } from "../../../DataBase/models/cart.model.js";
import { productModel } from "../../../DataBase/models/product.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";




// *****************************creat cart ************************************
export const creatCart = catchError(async (req, res, next) => {
    // get Data
    const { productId, quntitiy } = req.body

    // cheack valid product 

    const product = await productModel.findById(productId);
    if (!product) return next(new AppError("not found Product", 409));
    if (product.stock < (quntitiy || 1)) return next(new AppError(`quntitiy is ${product.stock} only`, 409));

    // cheack cart Exist 
    const cart = await cartModel.findOne({ userId: req.user._id });
    // ______not exist cart
    if (!cart) {
        // creat Cart
        const newCart = await cartModel.create({
            userId: req.user._id,
            products: [
                { productId, quntitiy }
            ]
        });
        return res.status(200).json({ messge: "Done", newCart })
    }

    // ______exist cart
    //  matchProduct is:-  flag to know if product exist or not
    let matchProduct = false
    for (let i = 0; i < cart.products.length; i++) {
        // tostring() because when match docuoment in DB we transform from BASON to Json
        // if product exist in item increase only the quntitity 
        if (cart.products[i].productId.toString() == productId) {
            cart.products[i].quntitiy = quntitiy
            matchProduct = true;
            break
        }
    }
    // if product not exist so push this product in [] of cart.products
    if (matchProduct == false) {
        cart.products.push({ productId, quntitiy })
    }

    await cart.save()
    return res.status(200).json({ message: "Done", cart })

})

// ****************************get loged Cart **********************************
export const getCart = catchError(async (req, res, next) => {


const cart = await cartModel.find({userId:req.user._id}).
populate("userId","firstName")
if(!cart) return next(new AppError('not exist cart',409))

    return res.status(200).json({ message: "Your Cart", cart })


})


// ************************** remove item from cart ***************************
export const removeSelectedItems = catchError(async (req, res, next) => {
    // get Data []
    const { productIds } = req.body;
    const itemsExist = await cartModel.findOneAndUpdate({ userId: req.user._id },
        {
            $pull: {
                products: {
                    productId: { $in: productIds }
                }
            }
        },
        { new: true }
    );


    return res.status(200).json({ message: "Done", itemsExist })







})

// ****************************clear Cart ************************************

export const clearCart = catchError(async (req, res, next) => {

    const itemsExist = await cartModel.findOneAndDelete({ userId: req.user._id },
        { products: [] }
        , {
            new: true
        });


    return res.status(200).json({ message: "Done", itemsExist })







})