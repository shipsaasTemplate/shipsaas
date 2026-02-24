"use server";

import supabase from "./supabase";

// ===========================================
// Waiting List — Server Actions
// ===========================================
// These server actions handle waiting list signups
// using your Supabase "waiting_list" table.
//
// Required Supabase setup:
//   1. Create a "waiting_list" table with an "email" column (unique)
//   2. (Optional) Create an RPC function "get_waiting_list_count"
//      to return the total count of entries.
//
// SQL to create the table:
//   CREATE TABLE waiting_list (
//     id BIGSERIAL PRIMARY KEY,
//     email TEXT UNIQUE NOT NULL,
//     created_at TIMESTAMPTZ DEFAULT NOW()
//   );
//
// SQL to create the count function:
//   CREATE OR REPLACE FUNCTION get_waiting_list_count()
//   RETURNS INTEGER AS $$
//     SELECT COUNT(*)::INTEGER FROM waiting_list;
//   $$ LANGUAGE SQL;
// ===========================================

type WaitingListResult = {
  success: boolean;
  message: string;
};

/**
 * Add an email to the waiting list.
 * Handles validation, duplicate detection, and error messages.
 */
export async function joinWaitingList(
  email: string,
): Promise<WaitingListResult> {
  // 1. Validate email
  if (!email || !email.includes("@")) {
    return { success: false, message: "Please enter a valid email address." };
  }

  // 2. Check Supabase is configured
  if (!supabase) {
    return {
      success: false,
      message: "Database not configured. Please set up Supabase.",
    };
  }

  // 3. Insert into waiting_list table
  const { error } = await supabase.from("waiting_list").insert([{ email }]);

  // 4. Handle response
  if (error) {
    console.error("Supabase waiting list error:", error);

    if (error.code === "23505") {
      // Unique constraint violation — email already exists
      return { success: false, message: "duplicate" };
    }

    return {
      success: false,
      message: "An error occurred. Please try again.",
    };
  }

  return { success: true, message: "success" };
}

/**
 * Get the total count of waiting list signups.
 * Requires the "get_waiting_list_count" RPC function in Supabase.
 */
export async function getWaitingListCount(): Promise<number | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("get_waiting_list_count");

  if (error) {
    console.error("Error fetching waiting list count:", error);
    return null;
  }

  return data as number;
}
