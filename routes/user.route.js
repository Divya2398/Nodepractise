const router = require('express').Router();
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const joi = require('joi');

const userSchema = require("../models/user.model");
const {authdataSchema}= require("../validation/joischema");
const mailSending= require("../middleware/email");

//signup process

router.post('/userfirstsignup', async(req,res)=>{
    try {
        const UserName = req.body.UserName;
        const Mailid= req.body.Mailid;
        const MobileNo = req.body.MobileNo;
     /*  if(UserName){
            let pattern=/[0-9]/g;
        if(pattern.test(UserName)!=true)
        {
            return res.json({status:"failure", message:"username must contion atleast one number"})
        }
        
       }else{
        return res.status(400).json({status: "failure", message: 'Must enter the username'})
      }*/
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

        const newresult =  await  authdataSchema.validateAsync(req.body)
        let userdetail = new userSchema(req.body)

        //console.log(userdetail)
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
        let finddetails = await userSchema.findOne({UserName: UserName}).select('-password -_id').exec()
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
            let payload = {uuid: userdetails.uuid, role: userdetails.role}
           
            if(isMatch){
                var Data = finddetails.toObject()//to append jwt token
                let jwttoken = jwt.sign(payload, process.env.secrectKey)
                Data.jwttoken = jwttoken 
                await userSchema.findOneAndUpdate({uuid: userdetails.uuid}, {loginStatus: true}, {new:true}).exec() //for changing login status=true    
              return res.status(200).json({status: "success", message: "Login successfully", data: {Data}})
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

//reset / forget password
router.post('/userresetpasssword', async(req,res)=>{
    try {
        let UserName= req.body.UserName;
        let newpassword=req.body.newpassword;
        let choice={new:true};
        let userdetail2;
        if(UserName){
        userdetail2 = await userSchema.findOne({UserName: UserName}).exec()
           if(!userdetail2){
            return res.status(400).json({Status: "failure", message:"signup first"})
        }
         }else{
            return res.status(400).json({status:"failure", message:"you must enter the username"})
    }
          if(userdetail2){ 
           console.log(userdetail2);
           console.log(newpassword);
           //let choice={new:true};
          // let password=newpassword.password;
           console.log("password before hashing:"+newpassword);
           let Salt= await bcrypt.genSalt(10);
           newpassword=bcrypt.hashSync(newpassword,Salt);
           console.log("after hashing:"+newpassword);
           const change =await userSchema.findOneAndUpdate({uuid: userdetail2.uuid},{password:newpassword}, choice).exec();
           return res.status(200).json({status:"success",message:"password changed successfully", result:change})
         }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({status:"failure", message:error.message})    
    }
          
})

//logout process
router.post('/userlogout', async(req,res)=>{
      try {
          let time=moment().toDate();
          await userSchema.findOneAndUpdate({uuid: req.query.uuid}, {lastedVisited: time, loginStatus: false}, {new:true}).exec()
        return res.status(200).json({status: "success", message: "Logout successfully"})
      } catch (error) {
        console.log(error.message)
        return res.status(500).json({status: "failure", message: error.message})
    }
      }
)
router.post("/mailApi", async(req, res)=>{
    try {
        const toMail = req.body.toMail;
        const subject = req.body.subject;
        const text = req.body.text;
        const mailData = {
            from: "dazzlingshinne@gmail.com",
            to: toMail,
            subject: subject,
            text: text,
            html:  "<h1>HTML version of the message</h1><b>Hello world!</b>"
        }
        let data = await mailSending.mailSending(mailData)
        return res.status(200).json({status: "success", message: "Mail sent successfully"})
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({status: "failure", message: error.message})
    }
})

module.exports = router;


 