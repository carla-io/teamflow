import { supabase } from "../lib/supabase";

export type Project = {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export async function getProjects(workspaceId: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Project[];
}

export async function getProject(projectId: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Project;
}

export async function createProject(
  workspaceId: string,
  name: string,
  description?: string,
) {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      workspace_id: workspaceId,
      name,
      description: description || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Project;
}

export async function updateProject(
  projectId: string,
  name: string,
  description?: string,
) {
  const { data, error } = await supabase
    .from("projects")
    .update({
      name,
      description: description || null,
    })
    .eq("id", projectId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Project;
}

export async function deleteProject(projectId: string) {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    throw new Error(error.message);
  }
}