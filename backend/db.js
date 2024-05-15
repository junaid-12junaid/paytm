let mongoose=require("mongoose")


let userSchema=new mongoose.Schema({
    username:String,
    firstname:String,
    lastname:String,
    password:String
})


let accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})


let User=mongoose.model("User",userSchema)

let Account=mongoose.model("Account",accountSchema)

module.exports={User,Account}