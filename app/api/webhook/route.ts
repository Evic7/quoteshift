import { NextRequest } from "next/server";
import { Whop } from "@whop/sdk";
import { createClient } from "@/lib/supabase/server";

// Initialize Whop SDK for Company Webhook
const whop = new Whop({
  apiKey: process.env.WHOP_API_KEY!,
  webhookKey: btoa(process.env.WHOP_WEBHOOK_SECRET || ""), // Add btoa() back
});

export async function POST(request: NextRequest) {
  try {
    const requestBodyText = await request.text();
    const headers = Object.fromEntries(request.headers);

    // Validate webhook using Whop SDK
    const webhookData = whop.webhooks.unwrap(requestBodyText, { headers });

    const result = {
      success: true,
      event: webhookData.type,
      message: "Webhook processed",
      timestamp: new Date().toISOString(),
    };

    const data = webhookData.data as any;
    const email = data?.email || data?.user?.email || data?.customer?.email;
    
    if (!email) {
      return Response.json({
        success: false,
        message: "No email found in webhook data",
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    const supabase = await createClient();

    if (
      (webhookData.type === "payment.succeeded" || 
       webhookData.type === "membership.activated") && 
      data?.status === "active"
    ) {
      const { error } = await supabase
        .from("profiles")
        .update({
          plan: "pro",
          quotes_remaining: -1,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email);

      if (error) {
        result.success = false;
        result.message = `Failed to upgrade ${email}`;
      } else {
        result.message = `User ${email} upgraded to Pro`;
      }
    }

    if (webhookData.type === "membership.deactivated") {
      const { error } = await supabase
        .from("profiles")
        .update({
          plan: "free",
          quotes_remaining: 3,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email);

      if (error) {
        result.success = false;
        result.message = `Failed to downgrade ${email}`;
      } else {
        result.message = `User ${email} downgraded to Free`;
      }
    }

    return Response.json(result, { status: 200 });

  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message || "Webhook processing failed",
      timestamp: new Date().toISOString(),
    }, { status: 400 });
  }
}
