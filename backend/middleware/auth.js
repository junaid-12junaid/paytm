let jwt=require('jsonwebtoken')

let JWT_SECRET=require("../config")

async function authMiddleware(req,res,next){
    try {
            let token=req.headers.authorization

            if (!token || !token.startsWith('Bearer ')) {
                return res.status(403).json({});
            }

            let token1=token.split(" ")[1]

            let decode=jwt.verify(token1,JWT_SECRET)

            req.userId=decode.userId
        next()
    } catch (error) {
        
        console.log(error)
            return res.status(500).send({ status: false, message: "Something went wrong" });
          
    }
} 

module.exports={authMiddleware}