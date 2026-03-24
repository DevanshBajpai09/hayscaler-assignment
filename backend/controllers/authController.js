import User from "../models/User.js"
import bcrypt from "bcrypt"

export const login = async (req,res)=>{

 try{

  const {email,password} = req.body

  const user = await User.findOne({email})

  if(!user){
   return res.status(400).json({
    message:"User not found"
   })
  }

  const valid = await bcrypt.compare(password,user.password)

  if(!valid){
   return res.status(400).json({
    message:"Invalid password"
   })
  }

  res.json({
   id:user._id,
   name:user.name,
   email:user.email,
   role:user.role
  })

 }
 catch(error){
  res.status(500).json({message:"Server error"})
 }

}