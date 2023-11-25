import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName: {
        type : String,
        required: true,
        trim: true,
        maxlength: [25, "Name should be less than 25 characters"],
    },
    lastName: {
        type : String,
        required: true,
        trim: true,
        maxlength: [25, "Name should be less than 25 characters"],
    },
    email: {
        type:String,
        unique: true,
        required: true,
        trim: true,
    },
    password:{
        type:String,
        minlength:[6, 'Password must have atleast 6 character'],
        required: true,
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default:'user'
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isVerified:{
        type: Boolean,
        default:false
    },
    codeConfirmEmail:{
        type: String,
        length:[4, 'length must be 4'],
    },
    codeForgetPassword:{
        type: String,
    },
    blocked: {
        type: Boolean,
        default: false
    },
    wishlist: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product'
    }],
    address: [{
        city: String,
        street: String,
        phone: String
    }],
    passwordChangeAt: Date,
    image: {
        type: String,
    },
    provider: {
        type: String,
        enum: ['Systeme', 'Google', 'Facebook'],
    }
},{
    timestamps: true
})

export const userModel = model('User', userSchema)
