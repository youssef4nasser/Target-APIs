import mongoose from "mongoose"

export const connectionBD = ()=>{
    mongoose.connect(process.env.ONLINE_DB).then(()=>{
        console.log("DB connceted");
    }).catch((err)=>{
        console.log("fail to connect Database", err);
    })
}