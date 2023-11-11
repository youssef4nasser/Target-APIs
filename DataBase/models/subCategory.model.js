import { Schema, model } from "mongoose"

const subCategorySchema = new Schema({
    name: {
        type : String,
        required:[true,'subCategory Name is Required'],
        unique: true,
        trim: true,
        maxlength: [100,"Name should be less than 100 characters"],
    },
    slug: {
        type :String,
        lowercase: true,
    },
    imgCover:{
        type: String,
    },
    category:{
        type: Schema.ObjectId,
        ref :"Category",
        required: true,
    },
},{
    timestamps: true
})

export const subCategoryModel = model('SubCategory', subCategorySchema)