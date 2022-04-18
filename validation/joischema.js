const joi = require('joi');


const authdataSchema= joi.object({
    Firstname:joi.string().pattern(new RegExp(/^[A-Za-z]+$/)).min(4).max(30).required(),
    lastname:joi.string().pattern(new RegExp(/^[A-Za-z]+$/)).min(1).max(20).required(),
    UserName:joi.string().pattern(new RegExp(/^[A-Za-z]+[0-9]+$/)).min(4).max(20).required(),
    MobileNo:joi.string().length(10).pattern(new RegExp(/^[0-9]+$/)).required(),
    Mailid: joi.string().email().lowercase().required(),
    password: joi.string().min(8).required(),
    Address: joi.object().keys({
        doorno: joi.number().required(),
        street: joi.string().required(),
        state: joi.string().required(),
        country: joi.string().required(),
        pincode:joi.string().required()
      }).required(),
    Gender:joi.string().valid("female", "male","others").required(),
    role:joi.string().required(),
    DOB:joi.string().required()

})

module.exports= {
    authdataSchema
}