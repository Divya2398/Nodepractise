const mongoose=require('mongoose')
const crypto=require('crypto')


//usermangement schema
const userSchema= new mongoose.Schema({
    uuid:{type:String , required:false},
    Firstname:{type:String ,required:true },
    Middlename:{type:String , required:false},
    lastname:{type:String , required:true},
    UserName:{type:String , required:true ,trim:true , unique:true},
    Mailid:{type:String, required:true ,trim:true,unique:true},
    MobileNo:{ type:String, required:true, trim:true, unique:true},
    password:{type:String, required:true, trim:true, unique:true},
    Address:{type:Array, required:true},
    Gender:{type: String,enum : ['male','female', 'transgender'], required:true},
    DOB:{type:String, required:true},
    VerifiedUser:{type:Boolean, required:false, default:false},
    Activestatus:{type:Boolean, required:false},
    lastedVisited: {type: String, required: false},
    loginStatus:{type: Boolean, required: false, default: false},
    firstLoginStatus:{type: Boolean, required: false, default: false}
}, 
{
timeStamps:true
});

function time(){
    let date = new Date();
    let month=  date.getMonth()+1;
    let d=(date.getFullYear().toString())+(month.toString())+(date.getDate().toString())+(date.getHours().toString())+(date.getMinutes().toString());
    return d ;


}

userSchema.pre('save',function(next){
    this.uuid = 'USER-'+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()+time();
    console.log(this.uuid);
    next();
});

module.exports=mongoose.model('user',userSchema);
