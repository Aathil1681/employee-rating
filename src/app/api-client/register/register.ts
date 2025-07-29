import { useApi } from "@/providers/ApiProvider";
import { User } from "@prisma/client";
import { useCreateMutation } from "../apiFactory";
import { RegisterInput } from "@/app/api/auth/types";
export const useRegister = ({
  invalidateQueryKey,
}: {
  invalidateQueryKey?: unknown[];
}) => {
  const { jsonApiClient } = useApi();
  return useCreateMutation<
    Record<string, any>, // optimistic update data (none here)
    RegisterInput, // request body
    { data: { user: User; token: string } }, // server response type (on success)
    { data: { user: User; token: string } } // error response shape (if structured)
  >({
    apiClient: jsonApiClient,
    method: "post",
    url: "/auth/register",
    errorMessage: "Failed to register user.",
    invalidateQueryKey,
    mutationOptions: {},
  });
};
