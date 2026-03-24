import express from "express"

import {
 requestLeave,
 getPendingLeaves,
 getAllLeaves,
 updateLeaveStatus,
 getCalendarLeaves,
 deleteLeave,
 
 getUserLeaves
} from "../controllers/leaveController.js"

const router = express.Router()

router.post("/request",requestLeave)
router.delete("/:leaveId", deleteLeave)

router.get("/user/:userId", getUserLeaves)



router.get("/all", getAllLeaves)

router.patch("/:leaveId", updateLeaveStatus)

router.get("/calendar", getCalendarLeaves)



export default router
