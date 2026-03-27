import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("whop-signature");

    if (!signature) {
      return Response.json({ error: "Missing signature" }, { status: 401 });
    }

    // Verify signature (Whop uses HMAC SHA256)
    const expectedSignature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse payload
    const payload = JSON.parse(body);
    const { event, data } = payload;

    console.log(`[Whop Webhook] Event: ${event}`);

    const result = {
      success: true,
      event,
      message: "Webhook processed",
    };

    // Handle purchase events
    if (event === "purchase.created" || event === "purchase.updated") {
      const { email, status, user_id } = data || {};

      if (status === "active" && email) {
        const supabase = await createClient();

        const { error } = await supabase
          .from("profiles")
          .update({
            plan: "pro",
            quotes_remaining: -1,        // -1 = unlimited
          })
          .eq("email", email);

        if (error) {
          console.error("Failed to update plan:", error);
          result.success = false;
          result.message = "Failed to update user to Pro";
        } else {
          result.message = `Successfully upgraded ${email} to Pro`;
        }
      }
    }

    // Always return 200 quickly
    return Response.json(result, { status: 200 });

  } catch (error: any) {
    console.error("Webhook error:", error);
    return Response.json({ 
      success: false, 
      error: error.message || "Internal error" 
    }, { status: 500 });
  }
}