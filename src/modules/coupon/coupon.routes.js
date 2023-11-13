import express from 'express'
import * as controller from './brand.controller.js'
import { validate } from '../../middleware/validate.js'
import { addCouponValidaion, idValidate, updateCouponValidation } from './coupon.validation.js'

const couponRouter = express.Router()

couponRouter.route('/')
    .post(validate(addCouponValidaion), controller.addBrand)
    .get(controller.getAllBrands)

couponRouter.route('/:id')
    .get(validate(idValidate), controller.getBrand)
    .put(validate(updateCouponValidation), controller.updateBrand)
    .delete(validate(idValidate), controller.deleteBrand)

export default couponRouter
