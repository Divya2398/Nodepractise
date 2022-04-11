const router = require('express').Router();
const bcrypt=require('bcrypt');
const userSchema = require("../models/user.model");

router.get('/',async(req,res)=>{
    res.send({"status":'received a v2 request'})
})

//signup process

router.post('/userfirstsignup', async(req,res)=>{
    try {
        const UserName = req.body.UserName;
        const Mailid= req.body.Mailid;
        const MobileNo = req.body.MobileNo;
       if(UserName){
            let pattern=/[0-9]/g;
        if(pattern.test(UserName)!=true)
        {
            return res.json({status:"failure", message:"username must contion atleast one number"})
        }
        
       }
      if(UserName){
        
            let usernameDetail = await userSchema.findOne({'UserName': UserName}).exec()
            if(usernameDetail){
                return res.json({status: "failure", message: 'username already exist'})
            }
        }else{
            return res.status(400).json({status: "failure", message: 'Must enter the username'})
     }

        if(Mailid){
            let useremailDetail = await userSchema.findOne({'Mailid': Mailid}).exec()
            if(useremailDetail){
                return res.json({status: "failure", message: 'email already exist'})
            }
        }else{
            return res.status(400).json({status: "failure", message: 'Must enter the email id'})
        }

        if(MobileNo){
            let usermobileNumberDetail = await userSchema.findOne({'MobileNo': MobileNo}).exec()
            if(usermobileNumberDetail){
                return res.json({status: "failure", message: 'mobileNumber already exist'})
            }
        }else{
            return res.status(400).json({status: "failure", message: 'Must enter the mobileNumber'})
        }

        let userdetail = new userSchema(req.body)
        //password hashing and salting
        let password=req.body.password;
        console.log("before hashing and salting:"+ userdetail.password);//before hashing
        let salt = await bcrypt.genSalt(10);
        userdetail.password = bcrypt.hashSync(password, salt);
        let result = await userdetail.save();
        console.log("after hashing:"+ userdetail.password);//after hashing

        return res.status(200).json({status: "success", message: "user details are added successfully", data: result})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({status: "failure", message: error.message})
    }
});

module.exports = router;