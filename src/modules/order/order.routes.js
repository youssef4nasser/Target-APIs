import express from "express"
import * as Order from "./order.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { allowedTo } from "../../middleware/authorize.js";



const orderRouter= express.Router();

orderRouter.route('/').
post( authenticate, allowedTo("user"),  Order.creatOrder).
get( authenticate, allowedTo("user"),  Order.getAllOrders)
orderRouter.route('/:id').
patch(authenticate, allowedTo("user"),Order.canceledOrder)

export default orderRouter

