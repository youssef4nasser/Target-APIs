import { Schema,model } from "mongoose";
const productSchema = new Schema({
    name: {
        type : String,
        required:[true, 'product Name is Required'],
        unique: true,
        trim: true,
        minlength:[3, "Name should be more than 3 characters"],
    },
    slug: {
        type :String,
        lowercase: true,
    },
    price: {
        type : Number,
        default:0,
        min: 0
    },
    description: {
        type : String,
        maxlength: [250, "description should be less than 250 characters"],
        minlength:[3, "description should be more than 3 characters"],
        required: true,
        trim: true,
    },
    stock: {
        type :Number,
        default:0,
        min: 0
    },
    sold: {
        type :Number,
        default:0,
        min: 0
    },
    category: {
        type: Schema.ObjectId,
        ref :"Category",
        required: true,
    },
    subCategory: {
        type: Schema.ObjectId,
        ref :"SubCategory",
        required: true,
    },
    brand: {
        type: Schema.ObjectId,
        ref :"Brand",
        required: true,
    },
    ratingAvg: {
        type: Number,
        max:5,
        min:1
    },
    ratingCount: {
        type: Number,
        min: 0
    },
    image:{
        type: String,
    },
    images: {
        type: [String],
    },
    colors: {
        type: [String],
    },
    sizes: {
        type: [String],
    },
    priceAfterDiscount: {
        type: Number,
        default:0,
        min: 0
    }
},{
    timestamps: true,
})

export const productModel = model('Product', productSchema)