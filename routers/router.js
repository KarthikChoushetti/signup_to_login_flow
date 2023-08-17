const express=require('express')
const { signup,signin, getUser,logout } = require('../controller/controller')
const jwtAuth=require('../middleware/jwtAuth')
const rout=express.Router()
rout.post('/signup',signup)      // this flow is written that how a data passes from  multiple checkpoints
rout.post('/signin',signin)
rout.get('/user',jwtAuth,getUser)   // where i want to get into middleware before going to get user
rout.get('/logout',jwtAuth,logout)
module.exports=rout 