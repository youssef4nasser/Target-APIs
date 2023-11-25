import express from 'express'
import * as controller from './category.controller.js'
import { fileUploud, fileValidation } from '../../utils/multer.cloud.js'
import { validate } from '../../middleware/validate.js'
import { addCategoryValidaion, idValidate, updateCategoryValidation } from './category.validation.js'
import subCategoryRouter from '../subCategory/subCategory.routes.js'

const categoryRouter = express.Router()

categoryRouter.use("/:categoryId/subcategory", subCategoryRouter)

categoryRouter.route('/')
    .post(fileUploud(fileValidation.image).single("image"), validate(addCategoryValidaion), controller.addCategory)
    .get(controller.getAllCategories)

categoryRouter.route('/:id')
    .get(validate(idValidate), controller.getCategory)
    .put(fileUploud(fileValidation.image).single("image"), validate(updateCategoryValidation), controller.updateCategory)
    .delete(validate(idValidate), controller.deleteCategory)

export default categoryRouter
