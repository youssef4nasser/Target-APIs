import Joi from "joi";

const idVaildation = Joi.string().hex().length(24).required()

export const validationAddReview = Joi.object({
    review: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    product: idVaildation
})

export const validationUpdateReview = Joi.object({
    review: Joi.string().max(100),
    rating: Joi.number().min(1).max(5),
    id: idVaildation
})

export const idValidate = Joi.object({
    id: idVaildation
})