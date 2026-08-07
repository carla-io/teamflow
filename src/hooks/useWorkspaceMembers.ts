import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addWorkspaceMember,
  getWorkspaceMembers,
  removeWorkspaceMember,
  updateWorkspaceMemberRole,
} from "../services/workspaceMemberService";


/**
 * Get workspace members
 */
export function useWorkspaceMembers(
  workspaceId: string | undefined,
) {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],

    queryFn: () =>
      getWorkspaceMembers(workspaceId!),

    enabled: !!workspaceId,
  });
}


/**
 * Add member
 */
export function useAddWorkspaceMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addWorkspaceMember,

    onSuccess: (member) => {
      queryClient.invalidateQueries({
        queryKey: [
          "workspace-members",
          member.workspace_id,
        ],
      });
    },
  });
}


/**
 * Update member role
 */
export function useUpdateWorkspaceMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: string;
      role: string;
    }) =>
      updateWorkspaceMemberRole(memberId, role),

    onSuccess: (member) => {
      queryClient.invalidateQueries({
        queryKey: [
          "workspace-members",
          member.workspace_id,
        ],
      });
    },
  });
}


/**
 * Remove member
 */
export function useRemoveWorkspaceMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
    }: {
      memberId: string;
      workspaceId: string;
    }) =>
      removeWorkspaceMember(memberId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "workspace-members",
          variables.workspaceId,
        ],
      });
    },
  });
}