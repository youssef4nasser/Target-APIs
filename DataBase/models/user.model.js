import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
    userName: {
        type : String,
        required: true,
        unique: true,
        trim: true,
        maxlength: [150, "FullName should be less than 150 characters"],
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
    changePasswordAt: Date,
},{
    timestamps: true
})

export const userModel = model('User', userSchema)
