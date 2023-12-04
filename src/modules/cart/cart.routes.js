import express from "express"
import * as Cart from "./cart.controler.js";
import { authenticate } from "../../middleware/authenticate.js";
import { allowedTo } from "../../middleware/authorize.js";

const cartRouter= express.Router();

cartRouter.route('/').
post( authenticate, allowedTo("user"),  Cart.creatCart).
patch( authenticate, allowedTo("user"), Cart.removeSelectedItems).
delete( authenticate, allowedTo("user"), Cart.clearCart) 
.get(authenticate, allowedTo("user"),Cart.getCart)


export default cartRouter

