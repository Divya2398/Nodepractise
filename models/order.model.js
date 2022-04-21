const mongoose= require("mongoose");
const crypto= require("crypto");


const Orderschema= new mongoose.Schema({
     uuid:{type:String, required:false},
     order_no:{type:String, required:true,trim:true},
     productname:{type:String, required:true, trim:true},
     quantity:{type:String,required:true, trim:true,default:1},
     totalamount:{type:String, required:true, trim:true},
     Delivery_address:{type:Array, required:true},
     mobilenumber:{type:String,required:true,trim:true},
     medicineuuid:{type:String,required:true} 
},
{
    timestamps:true
}
)

Orderschema.pre('save',function(next){
    this.uuid="order-"+crypto.pseudoRandomBytes(6).toString('hex').toLowerCase()
    console.log('this.uuid');
    next()
});



module.exports=mongoose.model('order',Orderschema)