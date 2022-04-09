const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
require('dotenv').config()
const medicineRouter = require('./routes/medicine.route');

const medic = express();
medic.use(cors());
const port = process.env.PORT || 4000;

medic.get("/healthcheck", async(req,res)=>{
    console.log("it is successful and it is working");
    res.send({status: 'got a request'})
})

//db connection
mongoose.connect(process.env.Url,{
useNewUrlParser: true,
useUnifiedTopology: true
}).then(data=>{
    console.log("Database connected")
}).catch(err=>{
    console.log(err.message)
    process.exit(1)
})

medic.use(express.json());
medic.use('/v1/medicine', medicineRouter);

 medic.listen(port, ()=>{
        console.log("http://localhost:4000")
         
 })