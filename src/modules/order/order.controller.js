import { cartModel } from "../../../DataBase/models/cart.model.js";
import { couponModel } from "../../../DataBase/models/coupon.model.js";
import { orderModel } from "../../../DataBase/models/order.model.js";
import { productModel } from "../../../DataBase/models/product.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
// import { sendEmail } from "../../utils/email.js";
// import { createInvoice } from "../../utils/invoicePDF.js";

/*
  _____________   get all order 
*/


export const getAllOrders = catchError(async (req, res, next) => {

    const order = await orderModel.find({})
    if (!order) return next(new AppError("in-valid order", 409))
    //  cheack status and paymenttupe
    // if( 
    //     (order.status !="placed" && order.paymentType=="cash") ||
    //     (order.status !="waitForPayment" && order.paymentType=="card")
    // ){
    //     return next(new AppError("cannot found  orders ", 409));
    // }

    return res.status(200).json({ message: "all orders", order })

})



export const creatOrder = catchError(async (req, res, next) => {

    // get Data
    const { phone, adresses, couponName, paymentType } = req.body

    /*
    cheack if user select items from cart or send  cart without select 
    */

    if (!req.body.products) {

        let cart = await cartModel.findOne({ userId: req.user._id })
        // !(cart.products.length) mean empty cart
        if (!cart || !(cart.products.length)) return next(new AppError('empty cart', 409));
        req.body.products = cart.products;

        // this a indicator to help me convert Bason To Object 
        req.body.isCart = true

    }
    // 1---------- cheack coupone 
    if (couponName) {
        // useedBy is araay in coupon collection (nin itis maen not found)
        const coupon = await couponModel.findOne({
            name: couponName,
            usedBy: { $nin: req.user._id }
        })
        // cheack on expire
        if (!coupon || (coupon?.expire.getTime() < Date.now())) return next(new AppError("NOT valid coupon ", 409))


        // keep this coipone in body 
        req.body.coupon = coupon

    }
    // 2---------- cheack product time of order

    let subToatal = 0
    let productList = []
    // to store the productIds ofproducts to help me when remove them from cart
    let productIds = []
    for (const product of req.body.products) {

        const checkProduct = await productModel.findById(product.productId)
        if (!checkProduct || product.isDelated) return next(new AppError("product not found", 409));
        // cheack on qutitiy and stock
        if (checkProduct.stock < product.quntitiy) return next(new AppError("not found on stock", 409));

        // to convet [Bason] to [object ]
        if (req.body.isCart) {
            product = product.toObject()
        }

        product.name = checkProduct.name;

        // finalPrice (collection of product) is == priceAfterDiscount without any coupone
        product.unitePrice = checkProduct.finalPrice

        /* finalPrice (in products[] ) (collection of order)
        we make tofixed(2)as 1200.00000000="1200.00" and convert to number to become 1200.00
        */
        product.finalPrice = Number((product.unitePrice * product.quntitiy).toFixed(2));
        /* 
        subToatal is price all products that 
        exist in order 
        */
        subToatal += product.finalPrice
        /* 
        collect any product in (in products[] ) (collection of order) in list[] to 
        calculate lattatr(فيما بعد) the finalPrce of products[] after coupone 
        */
        productList.push(product)
        productIds.push(product.productId)
    };

    const order = await orderModel.create({
        userId: req.user._id,
        phone,
        adresses,
        subToatal,
        copounId: req.body.coupon?._id,
        products: productList,
        /* totalPillAmount is (price of pill after discount of coupon)..
         (req.body.coupon.amount || 0) this mean (لو فيه خصم والزيرؤ معناه لو مفيش خصم)..

        */
        totalPillAmount: Number((subToatal - (subToatal * (req.body.coupon?.discount || 0) / 100)).toFixed(2)),
        paymentType,
        status: paymentType == "card" ? "waitForPayment" : "placed"
    })


    // invoice ______________
    // var invoice = {
    //     shipping: {
    //         name: req.user.name,
    //         address: order.adresses,
    //         email: req.user.email
         
    //     },
    //     items: order.products,
    //     date: order.createdAt,
    //     subtotal: order.subToatal,
    //     paid: order.totalPillAmount,

    // };
    // createInvoice(invoice , "invoice.pdf");

    // sendEmail(req.user.email, "invoice", `<h1>innvooice</h1>`)


    /*
we must update on 3things 
1- update coupone
2-update stock of product 
3- remove products from cart 
    */



    // 1------update coupone
    if (req.body.coupon) {

        await couponModel.updateOne({ _id: req.body.coupon._id }, { $addToSet: { usedBy: req.user._id } })

    }
    // 1------update products stocks
    for (const product of req.body.products) {

        await productModel.updateOne({ _id: product.productId },
            { $inc: { stock: - parseInt(product.quntitiy) } }
        )
    }
    // 1------ clear cart or  remove items from cart (based on isCatr (true or false)) 
    req.body.isCart ?
        await cartModel.findOneAndUpdate({ userId: req.user._id }, { products: [] }, { new: true }) :
        await cartModel.updateOne({ userId: req.user._id }, { $pull: { products: { $in: productIds } } })

    return res.status(200).json({ message: "your order Done", order })

})



/*
  _____________   canceled order 
*/
export const canceledOrder = catchError(async (req, res, next) => {
    const { id } = req.params

    const order = await orderModel.findById(id)
    console.log(order)
    if (!order) return next(new AppError("in-valid orderId", 409))
    //  cheack status and paymenttupe
    if (
        (order.status != "placed" && order.paymentType == "cash") ||
        (order.status != "waitForPayment" && order.paymentType == "card")
    ) {
        return next(new AppError("cannot cancel your order ", 409))
    };

    // 1------return Basic coupone again  
    if (order.copounId) {
        await couponModel.updateOne({ _id: order?.copounId._id }, { $pull: { usedBy: req.user._id } })
    }

    // 2------retarn Basic products stocks again
    for (let product of order.products) {
        product = product.toObject()
        await productModel.updateOne(
            { _id: product.productId },
            { $inc: { stock: parseInt(product?.quntitiy) } }
        )
    }

    // 3------retarn products to cart again 

    const cart = await cartModel.updateOne({ userId: req.user._id }, { products: order?.products }, { new: true })

    const CanceledOrder = await orderModel.updateOne({ _id: req.params.id }, { status: "canceled" }, { new: true })

    return res.status(200).json({ message: "yor order canceled", CanceledOrder, cart })

})

