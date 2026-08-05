import { supabase } from "../lib/supabase";

export type ProjectColumn = {
  id: string;
  project_id: string;
  title: string;
  position: number;
};

/**
 * Get all columns for a project
 */
export async function getColumns(projectId: string) {
  const { data, error } = await supabase
    .from("columns")
    .select("*")
    .eq("project_id", projectId)
    .order("position", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as ProjectColumn[];
}

/**
 * Get a single column
 */
export async function getColumn(columnId: string) {
  const { data, error } = await supabase
    .from("columns")
    .select("*")
    .eq("id", columnId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ProjectColumn;
}

/**
 * Create a column
 */
export async function createColumn(
  projectId: string,
  title: string,
  position: number,
) {
  const { data, error } = await supabase
    .from("columns")
    .insert({
      project_id: projectId,
      title,
      position,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ProjectColumn;
}

/**
 * Update a column
 */
export async function updateColumn(
  columnId: string,
  updates: {
    title?: string;
    position?: number;
  },
) {
  const { data, error } = await supabase
    .from("columns")
    .update(updates)
    .eq("id", columnId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ProjectColumn;
}

/**
 * Delete a column
 */
export async function deleteColumn(columnId: string) {
  const { error } = await supabase
    .from("columns")
    .delete()
    .eq("id", columnId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}