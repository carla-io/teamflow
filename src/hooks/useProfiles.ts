import { useQuery } from "@tanstack/react-query";
import { getProfiles } from "../services/profileService";

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: getProfiles,
  });
}