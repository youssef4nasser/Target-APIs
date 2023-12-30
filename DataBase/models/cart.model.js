
import { Schema, Types, model } from "mongoose";

const cartSchema = new Schema({


    userId: { type: Schema.ObjectId, ref: "User", required: true, unique: true },
    products: [
        {
            productId: { type: Schema.ObjectId, ref: "Product", required: true },
            quntitiy: { type: Number, required: true }
        }

    ],
    



}, { timestamps: true })

export const cartModel = model('Cart', cartSchema)