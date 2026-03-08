import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

// 1. DATABASE & SERVICES CONNECTION
await connectDB();
await connectCloudinary();

// 2. GLOBAL MIDDLEWARE
app.use(cors());
app.use(clerkMiddleware());

// 3. ROUTES

/** * CRITICAL: The Clerk Webhook must come BEFORE express.json() 
 * and must use express.raw() to preserve the signature for Svix.
 */
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);
app.post('/stripe',express.raw({ type: 'application/json' }),stripeWebhooks)

/** * Standard JSON parsing for all other routes 
 */
app.use(express.json());

app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);



// 4. SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});