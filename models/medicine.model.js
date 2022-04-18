const mongoose=require('mongoose')
const crypto=require('crypto')

//schema creation
const medicineschema = new mongoose.Schema({
    uuid: {type:String, required:false},
    medicineName:{type: String, required: true, trim: true},
    manufacturer:{type: String, required:true, trim:true},
    MRP:{type:String, required: true},
    dosage:{type: String, required: true , trim:true },
    composition:{type:String,required:false },
    expiredate:{type:String, required:true, trim:true},
    usage:{ type: String, required:false },
    directionforuse:{type:String, required:true, },
    active:{ type: Boolean, required:false, default:true},
    useruuid:{ type:String, required:true},
    categoryuuid:{ type:String, required:true}
},

{ 
    timestamps:true

});

// generation of UUID
medicineschema.pre('save', function(next){
    this.uuid = 'MEDIC-'+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()
    console.log(this.uuid);
    next();
});

module.exports=mongoose.model('medicine',medicineschema); 