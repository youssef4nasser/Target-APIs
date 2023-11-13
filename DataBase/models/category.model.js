import { Schema,model } from "mongoose";
import slugify from "slugify";

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
    image:{
        secure_url: String,
        public_id: String
    }
},{
    timestamps: true
})

// slug name when create
categorySchema.pre('save', function(){
    this.slug = slugify(this.name)
})

// slug name when updating
categorySchema.pre('findOneAndUpdate', function() {
    this._update.slug = slugify(this._update.name)
});

export const categoryModel = model('Category', categorySchema)