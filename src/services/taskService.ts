import { supabase } from "../lib/supabase";

export type TaskAssigneeProfile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

export type Task = {
  id: string;
  column_id: string;
  title: string;
  description: string | null;
  priority: string | null;
  status: string | null;
  due_date: string | null;
  created_at: string;
  assignee: string | null;
  profile: TaskAssigneeProfile | null;
};

const TASK_SELECT = `
  *,
  profile:profiles!assignee (
    id,
    username,
    full_name,
    avatar_url
  )
`;

/**
 * Get all tasks for a column
 */
export async function getTasksByColumn(columnId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select(TASK_SELECT)
    .eq("column_id", columnId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Task[];
}

/**
 * Get all tasks for a project
 *
 * We use the columns table to find the tasks
 * belonging to the project.
 */
export async function getTasksByProject(projectId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select(`
      ${TASK_SELECT},
      columns!inner(project_id)
    `)
    .eq("columns.project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Task[];
}

/**
 * Create a task
 */
export async function createTask(task: {
  column_id: string;
  title: string;
  description?: string | null;
  priority?: string | null;
  status?: string | null;
  due_date?: string | null;
  assignee?: string | null;
}) {
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select(TASK_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Task;
}

/**
 * Update a task
 */
export async function updateTask(
  taskId: string,
  updates: {
    title?: string;
    description?: string | null;
    priority?: string | null;
    status?: string | null;
    due_date?: string | null;
    assignee?: string | null;
    column_id?: string;
  },
) {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .select(TASK_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Task;
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string) {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}