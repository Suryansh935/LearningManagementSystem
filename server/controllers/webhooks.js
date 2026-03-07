import { Webhook } from "svix";
import User from "../models/User.js";

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