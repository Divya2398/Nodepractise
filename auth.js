
const { use } = require('bcrypt/promises');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user.model');

function authVerify (req,res,next){
    try {
        let token = req.header("token")
        if(!token){
            return res.status(401).json({"status": "failure", "message": "Unauthorised access or acccess denied"})
        }
        const decode = jwt.verify(token, process.env.secrectKey)
        //console.log(decode)
        next();
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({status: "failure", message: "Invalid token"})
    }    
}

function Admin (req,res,next){
    try{
        console.log("token verification");
        let token = req.header("token")
        if(!token){
            return res.status(401).json({"status": "failure", "message": "Unauthorised access"})
        }
        const decode = jwt.verify(token, process.env.secrectKey)
        console.log(decode.uuid)
        
        if(decode.role === "admin"){
            console.log("yes he is a admin")
            next();
        }else{
            return res.status(401).json({"status": "failure", "message": "Unauthorised access"})
        }       
    }catch(error){
        console.log(error.message)
        return res.status(500).json({status: "failure", message: "Invalid token"})
    }
}
module.exports = {
    authVerify: authVerify,
    Admin: Admin
   
}