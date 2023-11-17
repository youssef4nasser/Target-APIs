import { reviewModel } from "../../../DataBase/models/review.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";

export const addReview = catchError(
    async (req, res, next)=>{
        // create new review and save on DB
        req.body.user = req.user.id
        console.log(req.user.id);
        const review = new reviewModel(req.body)
        await review.save()
        res.status(201).json({message: "Success", review})
    }
)

export const getAllReviews = catchError(
    async (req, res, next)=>{
        const reviews =  await reviewModel.find({})
        return res.status(200).json({message: "Success", reviews})
    }
)

export const getReview = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const review = await reviewModel.findById(id)
        !review && next(new AppError("Not found this Review", 409))
        review && res.status(200).json({message: "Success", review})
    }
)

export const updateReview = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        // get review by id
        let review = await reviewModel.findByIdAndUpdate(id, req.body, {new: true})
        // check this review found or no
        !review && next(new AppError("Not found this Review", 409))
        review && res.status(200).json({message: "Success", review})
    }
)

export const deleteReview = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        let review = await reviewModel.findByIdAndDelete(id)
        !review && next(new AppError("Not found this Review", 409))
        review && res.status(200).json({message: "Success"})
    }
)