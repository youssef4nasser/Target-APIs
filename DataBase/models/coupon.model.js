import { Schema, model } from "mongoose";

const couponSchema = new Schema({
    name:{
        type : String,
        required:[true,'coupon name is Required'],
        unique: true,
        trim: true,
    },
    // name==code
    // code: {
    //     type : String,
    //     required:[true,'coupon code is Required'],
    //     unique: true,
    //     trim: true,
    // },
    expire: {
        type: Date
  
    },
    discount:{
        type: Number,
        required: true,
        default: 1,
    },
    usedBy: [{
        type: Schema.ObjectId,
        ref: 'User'
    }]
},{
    timestamps: true
})

export const couponModel = model('Coupon', couponSchema)