let express=require("express")
let router=express.Router()
let zod=require('zod')
let bcrypt=require("bcrypt")
let jwt=require("jsonwebtoken")
let {User,Account}=require("../db")
const JWT_SECRET = require("../config")
let {authMiddleware}=require("../middleware/auth")
let signupschema=zod.object({
        username:zod.string().email(),
    firstname:zod.string(),
    lastname:zod.string(),
    password:zod.string()
})

router.post('/signup',async (req,res)=>{
    
    let {success}=signupschema.safeParse(req.body)
console.log(` from sign up`,req.body)
    if(!success) return res.json({
        message: "Email already taken / Incorrect inputs"
    })

    let findUser=await User.findOne({username:req.body.username})

    if(findUser) return res.json({
        message: "Email already taken / Incorrect inputs"
    })

    let hashPassword=await bcrypt.hash(req.body.password,10)

    req.body.password=hashPassword

    let createUser=await User.create(req.body)

    await Account.create({
        userId:createUser._id,
        balance:1+Math.random()*10000
    })

    let token=jwt.sign({userId:createUser._id},JWT_SECRET)

    return res.json({
        message: "User created successfully",
        token: token
    })
})

let signInSchema=zod.object(
    {
        username: zod.string().email(),
        password: zod.string()
    }
)

router.post('/signin',async (req,res)=>{
    let {success}=signInSchema.safeParse(req.body)

    if(!success) return res.status(411).json({
        message: "Email already taken / Incorrect inputs"
    })

    let userFind=await User.findOne({username:req.body.username})

    if(!userFind) res.status(400).json({
        message: "No user with provided username"
    })

    let verifyPassword=await bcrypt.compare(req.body.password,userFind.password)

    if (!verifyPassword) return res.status(400).send({ status: false, msg: "Password is Invalid Please try again !!" })

    if(userFind)  {
        const token = jwt.sign({
            userId: userFind._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })

})


let updateSchema=zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/",authMiddleware,async (req,res)=>{

    try {
    let {success}=updateSchema.safeParse(req.body)

    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    if(req.body.password){
        let hashPassword=await bcrypt.hash(req.body.password,10)

        req.body.password=hashPassword
    }

    await User.updateOne({_id:req.userId},req.body,{new:true})

    res.json({
        message: "Updated successfully"
    })
} catch (error) {
    return res.json({
        error:error
    })
}

})

router.get("/bulk",async(req,res)=>{
    let filter=req.query.filter||""

    console.log(filter)
    let users=await User.find({
        $or:[{
            firstname:{
                '$regex':filter,
                '$options': 'i'
            }
        },{
           lastname:{
            '$regex':filter,
            '$options': 'i'
           } 
        }]
    }).select({password:0,__v:0})

    // let users=await User.find({
    //     $or:[{
    //         firstname:`/${filter}/`
    //     },{
    //        lastname:`/${filter}/` 
    //     }]
    // }).select({password:0,__v:0})

    return res.json({
        user: users
        })
   

})



module.exports=router