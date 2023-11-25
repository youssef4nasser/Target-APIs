import express from 'express'
import * as controller from './coupon.controller.js'
import { validate } from '../../middleware/validate.js'
import { addCouponValidaion, idValidate, updateCouponValidation } from './coupon.validation.js'

const couponRouter = express.Router()

couponRouter.route('/')
    .post(validate(addCouponValidaion), controller.addCoupon)
    .get(controller.getAllCoupons)

couponRouter.route('/:id')
    .get(validate(idValidate), controller.getCoupon)
    .put(validate(updateCouponValidation), controller.updateCoupon)
    .delete(validate(idValidate), controller.deleteCoupon)

export default couponRouter
