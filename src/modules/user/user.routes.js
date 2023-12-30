import express from "express"
import * as  user  from "./user.controller.js";

import { authenticate } from "../../middleware/authenticate.js";
import { allowedTo } from "../../middleware/authorize.js";



const  userRoutes= express.Router();

userRoutes.route('/')
.post(authenticate,allowedTo('admin'),user.adduser)
.get(user.getAllUser) 

userRoutes.route('/:id')
.put(authenticate,allowedTo('admin'),user.Updateuser)
.delete(authenticate,allowedTo('admin'),user.delateuser)
.patch(authenticate,allowedTo('admin','user'),user.changePassword1)


export default userRoutes