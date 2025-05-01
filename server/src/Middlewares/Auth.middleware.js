import jwt from 'jsonwebtoken'
import { AsyncHandler } from '../Utils/Asynchandler.js'
import { ApiError } from '../Utils/ApiError.js'
import User from '../Models/User.model.js'

export  const Tokenverification = AsyncHandler(async(req,res,next)=>{
    const token = req.cookies?.accessToken ||  req.header("Authorization")?.replace("Bearer ", "")
    //console.log(token);
    
    if(!token){
        throw new ApiError(400,'Invalid access token')
    }

   try {
   
     const decodeToken=  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

     const user= await User.findById(decodeToken._id).select('-password -refreshToken')
     if(!user){
        throw new ApiError(400,'Invalid access token')
     }
     //console.log(user._id);
     
     req.user=user
     next()

   } catch (error) {
    throw new ApiError(400,error.message)
}
    
   

})