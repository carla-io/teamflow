import { supabase } from "../lib/supabase";

export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

/**
 * Get all profiles (for user pickers, search, etc.)
 */
export async function getProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url")
    .order("full_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Profile[];
}