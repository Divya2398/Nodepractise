const router= require ('express').Router();
const jwt= require('jsonwebtoken');
const joi= require('joi');

const Orderschema=require("../models/order.model");
const {Orderdataschema}=require("../validation/joischema");
const  Router  = require('express');
//ordering API
router.post("/orderapi",async(req,res)=>{
    try {
        const test = await Orderdataschema.validate(req.body);
        let order= new Orderschema(req.body);
        const result= await order.save();
        return res.status(200).json({"status":"success","message":"successfully ordered","result":result})
        
    } catch (error) {
        console.log(error.message)
        return res.status(404).json({"status":"failure","message":error.message})
    }

})

module.exports= router;