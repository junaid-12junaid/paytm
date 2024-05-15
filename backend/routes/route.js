let express=require("express")
let router=express.Router()

let userRouter=require('./user')
let balanceRouter=require('./balance')
router.use('/user',userRouter)
router.use('/account',balanceRouter)

module.exports=router