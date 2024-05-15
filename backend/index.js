const express = require("express");
let cors=require("cors")
let mongoose=require("mongoose")
let router=require('./routes/route')
let app=express()

app.use(express.json())

app.use(cors())

app.use("/api/v1",router)



mongoose.connect("mongodb+srv://Junaid:OmiBBhzoWGFH0BY0@cluster0.axj9x.mongodb.net/paytm").then(()=>console.log("the db is connected successfully"))

app.listen(3001,()=>{
    console.log(`the app is running on 3001`)
})