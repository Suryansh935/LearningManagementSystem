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

// 1. ASYNC INITIALIZATION (Don't block the process start)
connectDB();
connectCloudinary();

// 2. CORS CONFIGURATION (Explicitly allow your new frontend)
const allowedOrigins = [
    'https://lms-f-ivory.vercel.app',
    'http://localhost:5173'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// 3. WEBHOOK ROUTES (Must stay BEFORE express.json)
// Using express.raw() is correct for Svix (Clerk) and Stripe signature verification.
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// 4. GLOBAL MIDDLEWARE
app.use(express.json());
app.use(clerkMiddleware());

// 5. API ENDPOINTS
app.get('/', (req, res) => res.send("LMS API Working"));

app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);

// 6. SERVER START / EXPORT
const PORT = process.env.PORT || 5000;

// Only listen locally; Vercel handles the listener in production.
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;