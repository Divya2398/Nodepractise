
const {totp} = require('otplib');

// function verifyotp(){
//     const otpkey="divya_otp_23";
//     const token = totp.generate(otpkey)
//     console.log("token:"+ token)
// }

function verifyotp(type){
    if( type == 'send'){
        const secretkey="divya_otp_23";
    const token = totp.generate(secretkey)
    console.log("token:"+ token)
    return token
    }else if(type == 'resend'){
        const secretkey= 'divya_otp_23'
        const token = totp.generate(secretkey)
        console.log("resend token:"+ token)
        return token
    }
    
}

function verify(){
    const secretkey="divya_otp_23";
    const token = totp.generate(secretkey)
    console.log("token:"+ token);
    const compare= totp.check(token,secretkey)
    console.log(compare)
}
   
verifyotp('resend')
verify()

  module.exports = {verifyotp , verify}