import { UserRole } from "@prisma/client";
import jwt from "jsonwebtoken";

export interface IJWTPayload extends Record<string, any> {
  id: string;
  organizations: {
    organizationId: string;
    role: UserRole;
    permissions: string[];
  }[];
}

export default function generateToken<T extends Record<string, string>>(
  payload: T,
  options: jwt.SignOptions = {
    expiresIn: "1w",
  },
) {
  try {
    const token = jwt.sign(payload, process?.env?.JWT_SECRET || "", options);
    return token;
  } catch {
    throw {
      code: "error-generating-jwt",
      message: "failed to generate jwt token",
    };
  }
}
