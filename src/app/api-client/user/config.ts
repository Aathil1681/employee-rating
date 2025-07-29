export enum EUser {
  FETCH_ME = 1,
}

export const userKey: Record<EUser, string> = {
  [EUser.FETCH_ME]: "get-current-user",
};
