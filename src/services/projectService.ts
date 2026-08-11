import { supabase } from "../lib/supabase";

export type Project = {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  created_at: string;
};

/**
 * Get all projects in a workspace
 */
export async function getProjects(workspaceId: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Project[];
}

/**
 * Get a single project by id
 */
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

/**
 * Create a project, plus its three default columns, atomically via RPC.
 */
export async function createProject({
  workspaceId,
  name,
  description,
}: {
  workspaceId: string;
  name: string;
  description?: string | null;
}) {
  const { data, error } = await supabase.rpc("create_project_with_columns", {
    p_workspace_id: workspaceId,
    p_name: name,
    p_description: description ?? null,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as Project;
}

/**
 * Update a project's name/description
 */
export async function updateProject(
  projectId: string,
  name: string,
  description?: string | null,
) {
  const { data, error } = await supabase
    .from("projects")
    .update({ name, description: description ?? null })
    .eq("id", projectId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Project;
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string) {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}