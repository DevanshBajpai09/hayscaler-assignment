import Leave from "../models/Leave.js"

export const getDashboard = async (req,res)=>{

 try{

  const {userId} = req.params

  const leaves = await Leave.find({userId}).sort({createdAt:-1})

  // Stats
  const total = leaves.length

  const approvedLeaves = leaves.filter(l => l.status === "APPROVED")
  const pending = leaves.filter(l => l.status === "PENDING").length
  const rejected = leaves.filter(l => l.status === "REJECTED").length
  const approved = approvedLeaves.length

  // Calculate total approved leave days
  const totalApprovedDays = approvedLeaves.reduce(
   (sum, leave) => sum + leave.days,
   0
  )

  // Recent Leaves
  const recentLeaves = leaves.slice(0,5)

  // Upcoming Leaves
  const today = new Date()

  const upcomingLeaves = leaves.filter(
   l => new Date(l.startDate) > today
  )

  // Leave Balance
  const balance = {
   annualRemaining: 20 - totalApprovedDays,
   sickRemaining: 10 - totalApprovedDays
  }

  res.json({

   stats:{
    total,
    approved,
    pending,
    rejected
   },

   recentLeaves,

   upcomingLeaves,

   balance

  })

 }catch(error){

  res.status(500).json({
   message:"Server error"
  })

 }

}