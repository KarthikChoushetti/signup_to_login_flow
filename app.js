const express=require('express');
const rout = require('./routers/router');
const database_connection = require('./config/databaseConfig');
const cookieParser=require('cookie-parser')
const cors=require('cors')
const app=express();
database_connection()
app.use(cookieParser())
app.use(express.json())
app.use(cors(
    {
        origin:[process.env.CLIENT_URL],
        credentials:allow              // allowing cookies
    }
))
app.use('/api/auth',rout) // if anyone try to access the /api/auth/anything it is directly calling rout 
app.use('/',(req,res)=>{
    res.status(200).json({
        data:"JwthAuth server"
    })
})
module.exports=app;