import express from 'express'
import * as controller from './brand.controller.js'
import { fileUploud, fileValidation } from '../../utils/multer.cloud.js'
import { validate } from '../../middleware/validate.js'
import { addBrandValidaion, idValidate, updateBrandValidation } from './brand.validation.js'

const brandRouter = express.Router()

brandRouter.route('/')
    .post(fileUploud(fileValidation.image).single("image"), validate(addBrandValidaion), controller.addBrand)
    .get(controller.getAllBrands)

brandRouter.route('/:id')
    .get(validate(idValidate), controller.getBrand)
    .put(fileUploud(fileValidation.image).single("image"), validate(updateBrandValidation), controller.updateBrand)
    .delete(validate(idValidate), controller.deleteBrand)

export default brandRouter
