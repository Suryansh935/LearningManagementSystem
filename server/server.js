import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

//initialize express
const app=express()

//MiddleWares
app.use(cors())

//Routes
app.get('/',(req,res)=>res.send("Api working"))
app.post('/clerk',express.json(),clerkWebhooks)

//connect to database
await connectDB()
//port
const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

