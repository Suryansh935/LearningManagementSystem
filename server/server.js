import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoutes.js'

const app = express()






// 2. CONNECT SERVICES
await connectDB()
app.use(cors())
app.use(clerkMiddleware())
await connectCloudinary()

// 3. ROUTES
// Remove express.json() from this specific route if you want to be safe, 
// or ensure you handle the raw body.
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);
app.use('/api/educator', educatorRouter)
app.use('/api/course',courseRouter)



const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})