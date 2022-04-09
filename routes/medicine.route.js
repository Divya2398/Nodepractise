const router = require('express').Router();
const medicineschema = require("../models/medicine.model");


router.get('/',async(req,res)=>{
    res.send({"status":'received a request'})
})
//adding medicine detail
router.post('/addmedicinedetail', async(req,res)=>{
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
router.get('/allmeddetail',async(req,res)=>{
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
router.put("/medicineupdation", async(req,res)=>{
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
router.get("/findonemedicine", async(req,res)=>{
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

module.exports = router;
//deletion of medicine
router.delete("/deletemeddata/:medicine_uuid", async(req,res)=>{
    try {
        console.log(req.params.medicine_uuid)
        await medicineschema.findOneAndDelete({uuid: req.params.medicine_uuid}).exec();
        return res.status(200).json({'status': 'success', message: " details of this medicine is deleted successfully"});
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
})
