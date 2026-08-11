import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from "../services/projectService";

export function useProjects(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => getProjects(workspaceId!),
    enabled: !!workspaceId,
  });
}

export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId!),
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      name,
      description,
    }: {
      workspaceId: string;
      name: string;
      description?: string;
    }) => createProject({ workspaceId, name, description }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.workspaceId],
      });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      name,
      description,
    }: {
      projectId: string;
      name: string;
      description?: string;
    }) => updateProject(projectId, name, description),

    onSuccess: (project) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", project.workspace_id],
      });

      queryClient.invalidateQueries({
        queryKey: ["project", project.id],
      });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}