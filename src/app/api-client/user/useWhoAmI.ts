import { useApi } from "@/providers/ApiProvider";
import { useCreateQuery } from "../apiFactory";
import { User } from "@prisma/client";
import { EUser, userKey } from "./config";

export const useWhoAmI = () => {
  const { jsonApiClient } = useApi();

  return useCreateQuery<User>({
    queryKey: userKey[EUser.FETCH_ME],
    apiClient: jsonApiClient,
    url: "/auth/whoami",
    errorMessage: "Failed to fetch current user.",
  });
};