const router = require('express').Router();
const medicineschema = require("../models/medicine.model");
const {authVerify,Admin}=require("../middleware/auth");
const userSchema= require("../models/user.model");
const categorySchema= require("../models/category.model");
const auth = require('../middleware/auth');


router.get('/',async(req,res)=>{
    res.send({"status":'received a request'})
})
//adding medicine detail
router.post('/addmedicinedetail',authVerify, async(req,res)=>{
    try{
        let detail = req.body
        const data = new medicineschema(detail);
        const result = await data.save();
        return res.status(200).json({'status': 'it is a success', "result": result})
    }catch(error){
        console.log(error.message);
        return res.status(400).json({"status": 'it is a failure' ,'message': error.message })

    }
});

//getting all medicine detail
router.get('/allmeddetail',authVerify,async(req,res)=>{
    try{
        const Alldetail= await medicineschema.find().exec();
        if(Alldetail.length > 0){
            return res.status(200).json({'status': 'success', message: "medicine details fetched successfully", 'result': Alldetail});
        }else{
            return res.status(404).json({'status': 'failure', message: " no such medicine detail is available"})
        }
    }catch(error){
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});
//updating details 
router.put("/medicineupdation",authVerify, async(req,res)=>{
    try {
        let Access= {"uuid": req.body.uuid}
        let changedetail = req.body.changedetail;
        let update = {new: true}
        const newdata = await medicineschema.findOneAndUpdate(Access, changedetail,update).exec();
        return res.status(200).json({'status': 'success', message: "medicine updated successfully", 'result': newdata});
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});

// get single medicine details
router.get("/findonemedicine",authVerify, async(req,res)=>{
    try {
        const medicinedetail = await medicineschema.findOne({"uuid" : req.query.medicine_uuid}).exec();
        if(medicinedetail){
            return res.status(200).json({'status': 'success', message: " detail fetched ", 'result': medicinedetail});
        }else{
            return res.status(404).json({'status': 'failure', message: "No such medicine"})
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});

//deletion of medicine
router.delete("/deletemeddata/:medicine_uuid",authVerify, async(req,res)=>{
    try {
        console.log(req.params.medicine_uuid)
        await medicineschema.findOneAndDelete({uuid: req.params.medicine_uuid}).exec();
        return res.status(200).json({'status': 'success', message: " details of this medicine is deleted successfully"});
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
})

//getting all products/medicine based on user who added it
router.get("/userbasedgettingMedicine",authVerify,async(req,res)=>{
    
    try {
        const userBasedmedicine= await medicineschema.find({useruuid: req.query.useruuid}).exec();
        if(userBasedmedicine.length !== null){
          // console.log(userBasedmedicine);
            return res.status(200).json({"status":"Success", "message":"medicine detail are fetched successfully based on user", "result":userBasedmedicine});
         }else{
            return res.status(404).json({"status":"success", "message":"no product under this user"});
         } 
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status":"failure","message":error.message});
    }
});

//aggregate=to merge/join two or more collection to fetch synced data
//based on aggregation

router.get("/userBasedMedicinebyAggregate", async(req,res)=>{
    try {
        const medicinebyuser= await medicineschema.aggregate([
            {
                "$lookup":{   //getting user details from product collection
                    from:"categories",
                    localField:"categoryuuid",
                    foreignField:"uuid",
                    as:"medicine_category"
                
                }
            }, 
            {
                $unwind:{    //to convert array into object
                    path:"$medicine_category",
                    preserveNullAndEmptyArrays:true
                }
            },
                {
                "$lookup":{
                    from:"users",
                    localField:"useruuid",
                    foreignField:"uuid",
                    as:"medicine_userdetail"
                }
            },
            {
                $unwind:{
                    path:"$medicine_userdetail",
                    preserveNullAndEmptyArrays:true
                }
            },
            //mongodb operators 
            {
                $match:{   //to get particular category /user collection 
                    $and:[    
                    {"categoryuuid":req.query.categoryuuid},
                    {"useruuid":req.query.useruuid},
                    {"CategoryName":{$nin:[req.query.CategoryName]}} 
                    ]
                 }
            },
            {
                $project:{
                    "_id":0,
                    "medicineName":1,
                    "MRP":1,
                    "expiredate":1,
                    "directionforuse":1,
                    "medicine_userdetail.Mailid":1,
                    " medicine_userdetail.Address":1,
                    "medicine_userdetail.UserName":1,
                    "medicine_category.CategoryName":1
                   /* "medicine_userdetail.":0,
                    "medicine_userdetail.loginStatus":0,
                    "medicine_userdetail.DOB":0,
                    "medicine_userdetail.MobileNo":0,
                    "medicine_userdetail.password":0,
                    "medicine_userdetail.createdA":0,
                    "medicine_userdetail.updatedAt":0,
                    "useruuid":0,*/

                }
            }  
        ])
        if(medicinebyuser.length >0){
            return res.status(200).json({"status":"success", "message":" detailes of medicine , it's category and  user who added the product are fetched", "result":medicinebyuser});
        }else{
            return res.status(404).json({"status":"failure","message":"no medicine by this user found"});
        }  
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({"status":"failure","message":error.message});
    }
})

//creation of category

router.post('/addingcategory',Admin, async(req,res)=>{
    try {
        const newdata= new categorySchema(req.body);
        const create= await newdata.save()
        return res.status(200).json({"status":"success", "message":"categories added successfully","result":create})
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status":"failure","message":error.message})     
    }  
})

module.exports = router;
