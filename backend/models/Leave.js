import mongoose from "mongoose"

const leaveSchema = new mongoose.Schema({

 userId:{
  type: mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
 },

 type:{
  type:String,
  required:true
 },

 reason:{
  type:String,
  required:true
 },

 startDate:{
  type:Date,
  required:true
 },

 endDate:{
  type:Date,
  required:true
 },

 days:{
  type:Number,
  required:true
 },

 status:{
  type:String,
  enum:["PENDING","APPROVED","REJECTED"],
  default:"PENDING"
 },

 createdAt:{
  type:Date,
  default:Date.now
 }

})

export default mongoose.model("Leave",leaveSchema)