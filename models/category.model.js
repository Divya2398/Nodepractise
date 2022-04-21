const mongoose= require("mongoose");
const crypto= require("crypto");


const categorySchema= new mongoose.Schema({
    uuid:{type:String, require:false},
    CategoryName:{type:String, require:true, trim:true},
    Agerestriction:{type:String,enum:["2-5yr", "10yr", "above15"] ,require:false},
    useruuid:{type:String, reuired:true}
},
{
    timestamps:true
});

categorySchema.pre('save',function(next){
    this.uuid='CATEGORY--'+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()
    console.log(this.uuid);
    next();
});

module.exports= mongoose.model('category', categorySchema);