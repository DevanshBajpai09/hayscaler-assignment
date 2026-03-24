import Leave from "../models/Leave.js"



export const requestLeave = async (req,res)=>{

 try{

  const {userId,type,reason,startDate,endDate,days} = req.body

  const leave = new Leave({
   userId,
   type,
   reason,
   startDate,
   endDate,
   days
  })

  await leave.save()

  res.status(200).json({
   message:"Leave request submitted",
   leave
  })

 }catch(error){

  res.status(500).json({
   message:"Server error"
  })

 }

}

// employee leaves


export const deleteLeave = async (req,res) => {

 try{

  const { leaveId } = req.params

  const leave = await Leave.findByIdAndDelete(leaveId)

  if(!leave){
   return res.status(404).json({
    message:"Leave not found"
   })
  }

  res.json({
   message:"Leave request deleted successfully"
  })

 }catch(error){

  res.status(500).json({
   message:"Failed to delete leave"
  })

 }

}


export const getUserLeaves = async (req,res) => {

 try{

  const { userId } = req.params

  const leaves = await Leave.find({ userId })
  .sort({ createdAt: -1 })

  res.json(leaves)

 }
 catch(error){

  res.status(500).json({
   message:"Failed to fetch leaves"
  })

 }

}




// 1️⃣ Get Pending Leave Requests
export const getPendingLeaves = async (req,res) => {

 try{

  const leaves = await Leave.find({ status:"PENDING" })
  .populate("userId","name email")

  res.json(leaves)

 }catch(error){

  res.status(500).json({
   message:"Failed to fetch pending leaves"
  })

 }

}


// 2️⃣ Get All Leaves (Manager)
export const getAllLeaves = async (req,res)=>{

 try{

  const leaves = await Leave.find()
  .populate("userId","name email")
  .sort({ createdAt:-1 })

  res.json(leaves)

 }catch(error){

  res.status(500).json({
   message:"Failed to fetch all leaves"
  })

 }

}


// 3️⃣ Approve or Reject Leave
export const updateLeaveStatus = async (req,res)=>{

 try{

  const { leaveId } = req.params
  const { status } = req.body

  const leave = await Leave.findByIdAndUpdate(
   leaveId,
   { status },
   { new:true }
  )

  res.json({
   message:"Leave updated successfully",
   leave
  })

 }catch(error){

  res.status(500).json({
   message:"Failed to update leave"
  })

 }

}


// 4️⃣ Calendar Data for Team
export const getCalendarLeaves = async (req,res)=>{

 try{

  const leaves = await Leave.find()
  .populate("userId","name")

  const calendarData = leaves.map(leave => ({

   employee: leave.userId.name,
   type: leave.type,
   startDate: leave.startDate,
   endDate: leave.endDate,
   days: leave.days,
   status: leave.status

  }))

  res.json(calendarData)

 }catch(error){

  res.status(500).json({
   message:"Failed to fetch calendar data"
  })

 }

}
