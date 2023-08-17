const JWT=require('jsonwebtoken');
const jwtAuth=(req,res,next)=>{   // next is used to send  the data where it belongs to  
                      // after multiple checks
     // verify,
     // ingect user info in request
     const token=(req.cookies && req.cookies.token)|| null // if we didnt get cookie  
     if(!token){
        return res.status(400).json({
            sucess:false,
            message:"Not authorized"
        })
     }    
     try {
        const payload=JWT.verify(token,process.env.SECRET)   // this token if from the above variable
        req.user={id:payload.id,email:payload.email}         // this email and id is extracted from jwtToken
                                                             // that is present in cookie
         
     } catch (error) {
        return res.status(400).json({
            sucess:false,
            message:error.message
        })
     }
     next();                              
}
module.exports=jwtAuth