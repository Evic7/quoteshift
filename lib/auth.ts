// lib/auth.ts
import { createClient } from './supabase/client';   // ← Changed to client

export const validUser = async () => {
  try {
    const supabase = createClient();   // ← Browser client, no async needed

    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    // Verify user is still valid
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return user;   // return user object if valid
  } catch (err) {
    console.error("validUser check failed:", err);
    return null;
  }
};