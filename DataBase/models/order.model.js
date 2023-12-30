
import { Schema, Types, model } from "mongoose";

const orderScema = new Schema({

    phone: { type: [String], required: true },
    adresses: { type: [String], required: true },
    userId: { type: Schema.ObjectId, ref: "User", required: true },
    products: [
        {
            name: { type: String, ref: "Product", required: true },
            productId: { type: Schema.ObjectId, ref: "Product", required: true },
            quntitiy: { type: Number, required: true },
            unitePrice: { type: Number, ref: "Product", required: true },
            finalPrice: { type: Number, ref: "Product", required: true }
        }

    ],
    copounId: {
        type: Schema.ObjectId, ref: "Coupon"
    },
    subToatal: { type: Number, required: true },
    // price after coupone
    totalPillAmount: { type: Number, ref: "Product", required: true },
    paymentMethod: {
        type: String,
        default: "cash",
        enum: ['cash', 'order']
    },
    // ==status
    status: {
        type: String,
        default: "placed",
        enum: ['waitForPayment', 'placed', 'rejected', 'onWay', 'canceled', 'delivered']
    },
    // reason for canceld
    reason: {
        type: String
    }
}, { timestamps: true })

export const orderModel = model('Order', orderScema)