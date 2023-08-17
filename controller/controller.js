const userModel=require('../models/userSchema.js')
const emailValidator=require('email-validator')
const bcrypt=require('bcrypt')
const signup= async (req,res)=>{
    const {name,email,password,confirmPassword}=req.body; // we get this data using client side and it is of cerealised data and we are getting this name email password should be same as schema
    // console.log(name,email,password,confirmPassword)
    try{
        if(!name||!email||!password||!confirmPassword){
            return res.status(400).json({
                sucess:false,
                message:"Every field is required"
               })
    }
    let vlaidemail=emailValidator.validate(email)
    if(!vlaidemail){
        return res.status(400).json({
            sucess:false,
            message:"Please enter valid mail id"
           })
    }
    if (password!==confirmPassword){
        return res.status(400).json({
            sucess:false,
            message:"Password and confirmPassword doesn't match"
           })
    }
        const userInfo=userModel(req.body);
        const result=await userInfo.save()
        return res.status(200).json({
            sucess:true,
            message:"Account Created sucessfully",
            userInfo
        })
    }catch(e){
        if(e.code===11000){                  // for duplicate entry for a unique key
                return res.status(400).json({
                sucess:false,
                message:"Account with this mail id already exists"
            })
        }           

    }

}
const signin=async (req,res)=>{
    const {email,password}=req.body
    if(!password||!email){
        return res.status(400).json({
            sucess:false,
            message:"Every field is required"
           })
    }
    try {
        const user = await userModel.findOne({email})
        .select('+password')
        if(!user|| ! await bcrypt.compare(password,user.password)){
            return res.status(400).json({
                sucess:false,
                message:"Invalid password or email"
               })
        }
        const token=  user.jwtToken();
        user.password=undefined
        const cookieOptions={
            maxAge:48*60*60*1000,              // in how many days jwt token should be expire
            httpOnly:true
        }
        res.cookie("token",token,cookieOptions);
        return res.status(200).json({
            sucess:true,
            message:"Sign in sucessfully",
            user
           })
    } catch (error) {
        res.status(400).json({
            sucess:false,
            message:error.message
        })
    }
}
const getUser= async(req,res)=>{
    const userId=req.user.id;
    try {
        const user=await userModel.findById(userId)
        return res.status(200).json({
            sucess:true,
            message:"This is the user info",
            user
        })
        
    } catch (error) {
       return res.status(400).json({
            sucess:false,
            message:error.message
        })
    }
}
const logout= async (req,res)=>{
    try {
        const cookieOptions={
            expires:new Date(),
            httpOnly:true
        }
        res.status(200).json({
            sucess:true,
            message:"Logged out sucessfully"
        })
        
    } catch (error) {
       return res.status(400).json({
            sucess:false,
            message:error.message
        })
    }
}
module.exports={
    signup,
    signin,
    getUser,
    logout
}