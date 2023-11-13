import nodemailer from "nodemailer";

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
 }

