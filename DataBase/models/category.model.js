import { Schema,model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type : String,
        required:[true, 'Category Name is Required'],
        unique: true,
        trim: true,
        maxlength: [200,"Name should be less than 200 characters"],
    },
    slug: {
        type :String,
        lowercase: true,
    },
    image: {
        type: String,
    }
},{
    timestamps: true
})

export const categoryModel = model('Category', categorySchema)