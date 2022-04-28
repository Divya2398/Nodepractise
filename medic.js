const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
//const sgMail= require('@sendgrid/mail')


require('dotenv').config()
const medicineRouter = require('./routes/medicine.route');
const userRouter = require('./routes/user.route');
const orderRouter= require('./routes/order.route');
//const API_KEY=''


// sgMail.setApiKey(API_KEY)

// const message={
//    // to:'sdivyalakshmi98@gmail.com',
//     to:['sdivyalakshmi98@gmail.com', 'divya.platosys@gmail.com','anitha.platosys@gmail.com'],
//     from:{
//         name: 'DIVYA',
//         email:'divya.platosys@gmail.com'
//     },
//     subject:'test mail',
//     text:'hello all',
//     html:'<h1>hello all</h1>'
// }
// sgMail.send(message)
// .then(response=> console.log('Email sent successfully...'))
// .catch(error=> console.log(error.message))


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
medic.use('/v2/user', userRouter);
medic.use('/v3/order', orderRouter);

 medic.listen(port, ()=>{
 console.log("http://localhost:4000")
         
 })