import { supabase } from "../lib/supabase";

export type WorkspaceMember = {
  id: string;
  workspace_id: string;
  user_id: string;
  role: string;
  created_at: string;
  profile: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};


/**
 * Get members of a workspace
 */
export async function getWorkspaceMembers(
  workspaceId: string,
) {
  const { data, error } = await supabase
    .from("workspace_members")
    .select(`
      id,
      workspace_id,
      user_id,
      role,
      created_at,
      profile:profiles!user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .eq("workspace_id", workspaceId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data as WorkspaceMember[];
}


/**
 * Add a member to a workspace
 */
export async function addWorkspaceMember({
  workspaceId,
  userId,
  role = "member",
}: {
  workspaceId: string;
  userId: string;
  role?: string;
}) {
  const { data, error } = await supabase
    .from("workspace_members")
    .insert({
      workspace_id: workspaceId,
      user_id: userId,
      role,
    })
    .select(`
      id,
      workspace_id,
      user_id,
      role,
      created_at,
      profile:profiles!user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as WorkspaceMember;
}


/**
 * Update a member's role
 */
export async function updateWorkspaceMemberRole(
  memberId: string,
  role: string,
) {
  const { data, error } = await supabase
    .from("workspace_members")
    .update({ role })
    .eq("id", memberId)
    .select(`
      id,
      workspace_id,
      user_id,
      role,
      created_at,
      profile:profiles!user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as WorkspaceMember;
}


/**
 * Remove a member
 */
export async function removeWorkspaceMember(
  memberId: string,
) {
  const { error } = await supabase
    .from("workspace_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}