import { supabase } from "../lib/supabase";

export type Workspace = {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
};

export async function getWorkspaces() {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Workspace[];
}

export async function createWorkspace(name: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to create a workspace.");
  }

  const { data, error } = await supabase
    .from("workspaces")
    .insert({
      name,
      owner_id: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Workspace;
}


export async function updateWorkspace(id: string, name: string) {
  const { data, error } = await supabase
    .from("workspaces")
    .update({ name })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Workspace;
}

export async function deleteWorkspace(id: string) {
  const { error } = await supabase.from("workspaces").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}