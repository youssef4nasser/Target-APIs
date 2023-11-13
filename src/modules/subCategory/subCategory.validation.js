import Joi from "joi";

export const addSubCategoryValidaion = Joi.object({
    name: Joi.string().min(2).required(),
    file: Joi.required().label('image'),
    category: Joi.string().hex().length(24).required(),
})

export const updateSubCategoryValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
    name: Joi.string().min(2),
    file: Joi.optional(),
    category: Joi.string().hex().length(24),
})

export const idValidate = Joi.object({
    id: Joi.string().hex().length(24).required(),
})