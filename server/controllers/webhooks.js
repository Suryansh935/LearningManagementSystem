import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

//controller function to manage clerk user with database
export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_HOOK_SECRET);

    // 1. Get the raw body string from the request buffer
    const payload = req.body.toString();
    
    // 2. Verify the headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // This will throw an error if the signature is invalid
    whook.verify(payload, headers);

    // 3. Parse the data once verified
    const { data, type } = JSON.parse(payload);

    console.log(`Webhook verified: ${type}`);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };

        await User.create(userData);
        console.log("User Created in DB");
        return res.status(201).json({ success: true });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, userData);
        console.log("User Updated in DB");
        return res.status(200).json({ success: true });
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        console.log("User Deleted from DB");
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(200).json({ success: true, message: "Unhandled event type" });
    }
  } catch (error) {
    // This will help you see EXACTLY why it's failing in your terminal
    console.error("Webhook Verification Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};


//


const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      // Use checkout.session.completed for primary fulfillment
      case "checkout.session.completed": {
        const session = event.data.object;
        const { purchaseId } = session.metadata;

        if (!purchaseId) break;

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData || purchaseData.status === "completed") {
          console.log("Purchase already processed or not found.");
          return res.json({ received: true });
        }

        // 1. Mark purchase as completed first (Status Guard)
        purchaseData.status = "completed";
        await purchaseData.save();

        // 2. Enroll student using $addToSet (Atomic update, prevents duplicates)
        await Course.findByIdAndUpdate(purchaseData.courseId, {
          $addToSet: { enrolledStudents: purchaseData.userId }
        });

        await User.findByIdAndUpdate(purchaseData.userId, {
          $addToSet: { enrolledCourses: purchaseData.courseId }
        });

        console.log(`Enrollment successful for Purchase: ${purchaseId}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        if (sessions.data.length > 0) {
          const { purchaseId } = sessions.data[0].metadata;
          await Purchase.findByIdAndUpdate(purchaseId, { status: "failed" });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (dbErr) {
    console.error("Database Error:", dbErr);
    res.status(500).json({ error: "Internal Server Error" });
  }
};