import { Schema, model } from "mongoose";

const brandSchema = new Schema({
    name: {
        type : String,
        required:[true,'brand Name is Required'],
        unique: true,
        trim: true,
        maxlength: [100,"Name should be less than 100 characters"],
    },
    slug: {
        type :String,
        lowercase: true,
    },
    image:{
        secure_url: String,
        public_id: String
    }
},{
    timestamps: true
})

export const brandModel = model('Brand', brandSchema)