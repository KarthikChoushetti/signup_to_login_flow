const mongoose=require('mongoose');
const {Schema}=mongoose;
const JWT=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const userSchema=new Schema({
name:{
    type:String,
    required:true,
    maxLength:[50,"Atleast it should be 50 characters"],
    minLength:[5,"YOUR name must be less than 5 charactes"],
    trim:true,
},
email:{
    type:String,
    required:[true,"useremail is required"],
    lowercase:true,
    unique:true,
},
password:{
    type:String,
    select:false, // it doesnt show password when email is email and user name is put please do not share the password
},
forgotPasswordToken:{
    type:String,
},
forgotPasswordExpiryDate:{
    type:String,
}
})
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }                // wherever there is password involved this logic of bycrypt will trigerr
    this.password=await bcrypt.hash(this.password,10)
    return next()
})
userSchema.methods={
    jwtToken(){
        return JWT.sign(
            { 
                id:this._id,   // id from database 
                emial:this.email,

            },
            process.env.SECRET, // jwt secerte key
            {expiresIn:'48h'}        // in how many days jwttoken should expire
        )

    }
}
const userModel=mongoose.model('User',userSchema)
module.exports=userModel