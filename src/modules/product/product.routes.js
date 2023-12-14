import express from 'express'
import * as controller from './product.controller.js'
import { fileUploud, fileValidation } from '../../utils/multer.cloud.js'
import { validate } from '../../middleware/validate.js'
import { addProductValidation, updateProductValidation, idValidate } from './product.vaildation.js'
import { authenticate } from '../../middleware/authenticate.js'
import { allowedTo } from '../../middleware/authorize.js'

const productRouter = express.Router()

productRouter.route('/')
    .post(
        fileUploud(fileValidation.mix).fields([
        { name: 'image', maxCount: 1 },
        { name: 'images', maxCount: 8 },
        { name: 'videos', maxCount: 3 },
    ]),validate(addProductValidation), controller.addProduct)
    .get(controller.getAllProducts)
    
productRouter.route('/:id')
    .get(validate(idValidate), controller.getProduct)
    .put(
    fileUploud(fileValidation.mix).fields([
        { name: 'image', maxCount: 1 },
        { name: 'images', maxCount: 8 },
        { name: 'videos', maxCount: 3 },
    ]), validate(updateProductValidation), controller.updateProduct)
    .delete(authenticate, allowedTo("admin"), validate(idValidate), controller.deleteProduct)

export default productRouter
