import generateToken from "@/app/api/helpers/generateToken";

export const INVITE_TOKEN_TYPE = "ACCEPT_INVITE";

export interface IJWTInvitePayload extends Record<string, any> {
  id: string;
  organizationId: string;
  type: typeof INVITE_TOKEN_TYPE;
}

export default function generateInviteToken(payload: {
  id: string;
  organizationId: string;
}) {
  return generateToken<IJWTInvitePayload>(
    {
      ...payload,
      type: INVITE_TOKEN_TYPE,
    },
    {
      expiresIn: "1h",
    }
  );
}