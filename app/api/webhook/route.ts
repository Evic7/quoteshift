import { NextRequest } from "next/server";
import { Whop } from "@whop/sdk";
import { createClient } from "@/lib/supabase/server";

const whop = new Whop({
  apiKey: process.env.WHOP_API_KEY!,
  webhookKey: btoa(process.env.WHOP_WEBHOOK_SECRET || ""),
});

export async function POST(request: NextRequest) {
  try {
    const requestBodyText = await request.text();
    const headers = Object.fromEntries(request.headers);

    const webhookData = whop.webhooks.unwrap(requestBodyText, { headers });

    const result = {
      success: true,
      event: webhookData.type,
      message: "Webhook processed",
      timestamp: new Date().toISOString(),
      data: {} as any,
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

    // Find user ID by email from auth.users
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    const user = users?.find(u => u.email === email);

    if (!user) {
      return Response.json({
        success: false,
        message: `User with email ${email} not found`,
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    const userId = user.id;

    if (
      (webhookData.type === "payment.succeeded" || 
       webhookData.type === "membership.activated") && 
      data?.status === "active"
    ) {
      const { data: updateData, error } = await supabase
        .from("profiles")
        .update({
          plan: "pro",
          quotes_remaining: -1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select();

      if (error) {
        result.success = false;
        result.message = `Failed to upgrade ${email}`;
        result.data = { email, userId, error: error.message };
      } else {
        result.message = `User ${email} upgraded to Pro`;
        result.data = { email, userId, updated: !!updateData?.length };
      }
    }

    if (webhookData.type === "membership.deactivated") {
      const { data: updateData, error } = await supabase
        .from("profiles")
        .update({
          plan: "free",
          quotes_remaining: 3,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select();

      if (error) {
        result.success = false;
        result.message = `Failed to downgrade ${email}`;
        result.data = { email, userId, error: error.message };
      } else {
        result.message = `User ${email} downgraded to Free`;
        result.data = { email, userId, updated: !!updateData?.length };
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
