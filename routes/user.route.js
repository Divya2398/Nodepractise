const router = require('express').Router();
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const userSchema = require("../models/user.model");

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
        
       }else{
        return res.status(400).json({status: "failure", message: 'Must enter the username'})
      }
      if(UserName){
        
            let usernameDetail = await userSchema.findOne({'UserName': UserName}).exec()
            if(usernameDetail){
                return res.json({status: "failure", message: 'username already exist'})
            }

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
        console.log("before hashing and salting:"+ userdetail.password);//before hashing//password:abcd12345
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

//login process

router.post('/userlogin' , async(req,res)=>{
   try {
        let  UserName = req.body.UserName;
        let password = req.body.password;
        let userdetails;        //using select we can either get particular element or avoid particular element.
        let userdetails1 = await userSchema.findOne({UserName: UserName}).select('-password -_id').exec()
        //  console.log(userdetails1);
        if(UserName){
            userdetails = await userSchema.findOne({UserName: UserName }).exec()
            if(!userdetails){
                return res.status(400).json({status: "failure", message: "please signup first"});
            }
        }else{
            return res.status(400).json({status: "failure", message: "Please enter the username"})
        }
        if(userdetails){ 
            //console.log(userDetails);
            //console.log(userdetails.password);
            let isMatch = await bcrypt.compare(password, userdetails.password)
            if(userdetails.firstLoginStatus !== true){
                await userSchema.findOneAndUpdate({uuid: userdetails.uuid}, {firstLoginStatus: true}, {new:true}).exec();
            }
            let payload = {uuid: userdetails.uuid, role:"admin"}
           
            if(isMatch){
                var userData = userdetails1.toObject()//to append jwt token
                let jwttoken = jwt.sign(payload, process.env.secrectKey)
                userData.jwttoken = jwttoken
              return res.status(200).json({status: "success", message: "Login successfully", data: {userData, jwttoken}})
            }else{
                return res.status(200).json({status: "failure", message: "your Login failed"})
            }
        }
       return res.status(200).json({status : "success", messsage: "login successful", data: "result"})
       
   } catch (error) {
       console.log(error.message);
       return res.status(500).json({status:"failure", message:error.message})    
   }
})

//logout process
router.post('/userlogout', async(req,res)=>{
      try {
          let time=moment().toDate();
          await userSchema.findOneAndUpdate({uuid: req.params.uuid}, {lastedVisited: time,loginStatus: false}, {new:true}).exec()
        return res.status(200).json({status: "success", message: "Logout successfully"})
      } catch (error) {
        console.log(error.message)
        return res.status(500).json({status: "failure", message: error.message})
    }
      }
)


module.exports = router;