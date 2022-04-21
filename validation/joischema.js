
const joi = require('joi');


const authdataSchema= joi.object({
    Firstname:joi.string().pattern(new RegExp(/^[A-Za-z]+$/)).min(4).max(30).required(),
    lastname:joi.string().pattern(new RegExp(/^[A-Za-z]+$/)).min(1).max(20).required(),
    UserName:joi.string().pattern(new RegExp(/^[A-Za-z]+[0-9]+$/)).min(4).max(20).required(),
    MobileNo:joi.string().length(10).pattern(new RegExp(/^[0-9]+$/)).required(),
    Mailid: joi.string().email().lowercase().required(),
    password: joi.string().min(8).pattern(new RegExp(/^[A-Za-z]+[0-9]+$/)).required(),
    Address: joi.object().keys({
        doorno: joi.number().required(),
        street: joi.string().required(),
        state: joi.string().required(),
        country: joi.string().required(),
        pincode:joi.string().required()
      }).required(),
    Gender:joi.string().valid("female", "male","others").required(),
    role:joi.string().valid('admin','user').required(),
    DOB:joi.string().required()
    

})

const productdataSchema=joi.object({
    medicineName:joi.string().required(),
    manufacturer:joi.string().required(),
    MRP:joi.string().required(),
    dosage:joi.string().required(),
    composition:joi.string().optional(),
    expiredate:joi.string().required(),
    usage: joi.string().optional(),
    directionforuse:joi.string().min(10).max(100).required(),
    useruuid:joi.string().required(),
    categoryuuid:joi.string().required(),

})

const Orderdataschema= joi.object({
    order_no:joi.string().pattern(new RegExp(/^[A-Za-z0-9]+$/)).required(),
    productname:joi.string().required(),
    quantity:joi.string().required(),
    totalamount:joi.string().required(),
    Delivery_address:joi.object().keys({
        doorno: joi.number().required(),
        street: joi.string().required(),
        state: joi.string().required(),
        country: joi.string().required(),
        pincode:joi.string().required()
      }).required(),
    mobilenumber:joi.string().length(10).pattern(new RegExp(/^[0-9]+$/)).required(),
    medicineuuid:joi.string().required()
    
})

module.exports= {
    authdataSchema: authdataSchema,
    productdataSchema: productdataSchema,
    Orderdataschema: Orderdataschema

}