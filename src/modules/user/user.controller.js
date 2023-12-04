
import bcrypt from "bcrypt";
import { catchError } from "../../utils/catchError.js";
import { userModel } from "../../../DataBase/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { delateOne } from "../handeles/factorDelateOne.js";











// add adduser
 const adduser = catchError(async(req,res,next)=>{

// (in trigger (mongose module)==>)   req.body.password= bcrypt.hashSync(req.body.password, 8);
    
    const user= new userModel(req.body)
    await user.save()
    res.status(200).json({message:"success",user})
    })


// get all user 
const getAllUser= catchError(async(req,res,next)=>{

    const user= await userModel.find({});
      
       res.status(200).json({message:"success",user})
       })


 // Update user  
 const Updateuser= catchError(async(req,res,next)=>{
    const{id}=req.params
    const user= await userModel.findByIdAndUpdate(id,req.body,{new:true})
    // !category && res.status(404).json({message:"category not found"})
    !user && next(new AppError('user not found',404))
    user && res.status(200).json({message:"success",user})
    })

    // changePassword user  
 const changePassword1= catchError(async(req,res,next)=>{
    const{id}=req.params

req.body.changePasswordAt= Date.now()
    const user= await userModel.findByIdAndUpdate(id,req.body,{new:true})

    !user && next(new AppError('user not found',404))
    user && res.status(200).json({message:"success",user})
    })


     // delate user  
 const delateuser= delateOne(userModel,'user')
export{
    adduser,
    getAllUser,
    Updateuser,
    delateuser,
    changePassword1
}




// const changePassword = catchError(async (req, res, next) => {
//   try {
//     // Destructure currentPassword and newPassword from the request body
//     const { currentPassword, newPassword } = req.body;

//     // Find the user by ID
//     const user = await userModel.findById(req.user._id);

//     // If user is not found, send a 404 error using AppError
//     !user && next(new AppError("User not found", 404));

//     // Compare the current password with the hashed password stored in the database
//     const isMatched = await bcrypt.compare(currentPassword, user.password);

//     // If passwords do not match, send a 400 error using AppError
//     !isMatched && next(new AppError("Current password is incorrect", 400));

//     // Hash the new password using bcrypt
//     const hashedNewPassword = bcrypt.hashSync(
//       newPassword,
//       +process.env.Hash_Round
//     );

//     // Update the user's password in the database with the hashed new password
//     user.password = hashedNewPassword;

//     // Save the updated user document
//     await user.save();

//     // Respond with a success message
//     return res.status(200).json({ message: "Password updated successfully" });
//   } catch (error) {
//     // If an error occurs, send a 500 error using AppError
//     return next(new AppError("Internal Server Error", 500));
//   }
// });

// export { changePassword };
