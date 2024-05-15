let express=require("express")
let router=express.Router()
let {authMiddleware}=require("../middleware/auth")
const { Account } = require("../db")
let zod=require("zod")
const { default: mongoose } = require("mongoose")
router.get("/balance",authMiddleware,async (req,res)=>{

    try {
        let userBalance=await Account.findOne({userId:req.userId}).select({balance:1,_id:0})

    return res.json(userBalance)
    } catch (error) {
        console.log(error.message)
    }

    
})


let trnasfer=zod.object({
    to:zod.string(),
    amount:zod.number()
})

router.post("/transfer",authMiddleware,async (req,res)=>{

    try {
        
    
        let {success}=trnasfer.safeParse(req.body)

        if(!success) return  res.status(411).json({
            message: "Error while updating information"
        })

        let session=await mongoose.startSession()

        session.startTransaction()
        let {to,amount}=req.body

        let findMe=await Account.findOne({
            userId:req.userId
        }).session(session)

        if(!findMe||findMe.balance<amount){
            await session.abortTransaction()
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        let toAcc=await Account.findOne({
            userId:to
        }).session(session)

        if(!toAcc){
            await session.abortTransaction()
            return res.status(400).json({
                message: "Invalid Account"
            });
        }


        await Account.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session)
        await Account.updateOne({userId:to},{$inc:{balance:amount}}).session(session)

        await session.commitTransaction()

        return  res.json({
            message: "Transfer successful"
        });

    } catch (error) {
        return res.json({
            error:error
        })
    }

})

module.exports=router