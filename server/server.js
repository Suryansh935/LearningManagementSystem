import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'

//initialize express
const app=express()

//MiddleWares
app.use(cors())
app.use(clerkMiddleware())

//Routes
app.get('/',(req,res)=>res.send("Api working"))
app.post('/clerk',express.json(),clerkWebhooks)
app.use('/api/educator',express.json(),educatorRouter)

//connect to database
await connectDB()
//port
const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

