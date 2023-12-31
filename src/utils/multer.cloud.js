import multer from "multer";
import { AppError } from "./AppError.js";

export const fileValidation={
    image:['image/jpeg','image/png','image/gif'],
    file:['application/pdf','application/msword',],
    video:['video/map4'],
    mix:['video/map4', 'image/jpeg','image/png', 'video/3gpp']
}

export function fileUploud(coustomValidation=[]){
    const storage = multer.diskStorage({});
    
    function fileFilter (req, file, cb) {
        console.log(file);
        if(coustomValidation.includes(file.mimetype)){
            cb(null, true)
        }else{
            cb(new AppError('invalid_file_formate',401), false)
        }
    }
    const upload = multer({ storage ,fileFilter});
    return upload
}

