const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth:{
        user: "dazzlingshinne@gmail.com",
        pass: "shineedazzling"
    },
});

async function mailSending(mailData){
    try {
        
        transporter.sendMail(mailData, (err,data)=>{
            if(err){
                console.log("err in sending message", err.message)
                
            }
        })
        
    } catch (error) {
        console.log(error.message)
        process.exit(1);
    }
}

module.exports = {
    mailSending
}