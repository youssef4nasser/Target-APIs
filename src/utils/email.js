import nodemailer from "nodemailer";

<<<<<<< HEAD
 export  async function sendEmail({email,html}){
  const transporter = nodemailer.createTransport({
      service:"gmail",
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls:{
            rejectUnauthorized:false
        }
  });
  const info = await transporter.sendMail({
    from: `"For Me 👻" <${process.env.EMAIL}>`, // sender address
    to:email,
    subject:"confirmEmail",
    html,
  });
  return info.rejected.length? false: true
=======
 export  async function sendEmail(email,subject,html){

    const transporter = nodemailer.createTransport({
        service:"gmail",
     
         auth: {
           // TODO: replace `user` and `pass` values from <https://forwardemail.net>
           user: process.env.EMAIL,
           pass: process.env.EMAIL_PASSWORD,
         },
         tls:{
             rejectUnauthorized:false
         }
       });
       const info = await transporter.sendMail({
         from: `"Project_Team 👻" <${process.env.EMAIL}>`, // sender address
         to:email,
         subject,
         html,
       });
       return info.rejected.length? false: true
>>>>>>> 1bc340ae92bf65e3ae3c8ca771209cb44e345432
 }

