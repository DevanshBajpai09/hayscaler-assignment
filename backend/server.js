import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import connectDB from "./config/db.js"
import authRoutes from "./routes/auth.js"
import leaveRoutes from "./routes/leave.js"
import dashboardRoutes from "./routes/dashboard.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.use("/api/auth",authRoutes)
app.use("/api/leave",leaveRoutes)

app.use("/api/dashboard",dashboardRoutes)

app.listen(5000,()=>{
 console.log("Server running on port 5000")
})