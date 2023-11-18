import { Schema, mongoose } from "mongoose";

const reviewSchema = new Schema({
    review: {
        type : String,
        required:[true,'Review is Require'],
        trim: true,
    },
    rating:{
        type: Number,
        enum: [1,2,3,4,5],
    },
    product: {
        type: Schema.ObjectId,
        ref:'Product',
        required: true,
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    order: {
        type: Schema.ObjectId,
        ref: 'Order'
    }
},{
    timestamps: true
})

reviewSchema.pre(['findOne', 'find'], function(){
    this.populate("user", "firstName lastName")
})

export const reviewModel = mongoose.model('Review', reviewSchema)