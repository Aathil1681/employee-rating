import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from "jsonwebtoken";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import checkPermissions from "./checkPermission";
import { IJWTPayload } from "./generateToken";

interface PrivateRouteCheck {
  organizationId?: string; // Optional if no permissions are required
  permissions: string[];
}

export default async function privateRoute(
  _: NextRequest,
  checkFor: PrivateRouteCheck,
  cb: (user: IJWTPayload, token: string) => Promise<NextResponse>,
) {
  try {
    const authorization = (await headers()).get("Authorization");
    const token = authorization?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "MISSING_AUTH_TOKEN",
            message: "Authorization token is required",
          },
        },
        { status: 401 },
      );
    }

    jwt.verify(token, process.env.JWT_SECRET!);
    const decodedToken = jwt.decode(token) as JwtPayload & IJWTPayload;

    // Developer error handling
    if (checkFor.permissions.length > 0 && !checkFor.organizationId) {
      const devError = new Error(
        "Developer Error: organizationId is required when permissions are specified",
      );
      if (process.env.NODE_ENV === "development") {
        console.error(devError);
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "DEVELOPER_ERROR",
              message: devError.message,
              details: {
                suggestion: "Add organizationId to your privateRoute check",
              },
            },
          },
          { status: 500 },
        );
      }
      console.error("privateRoute misconfiguration:", devError.message);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SERVER_ERROR",
            message: "Internal server configuration error",
          },
        },
        { status: 500 },
      );
    }

    const permissionError = await checkPermissions({
      user: decodedToken,
      organizationId: checkFor.organizationId,
      requiredPermissions: checkFor.permissions,
    });

    if (permissionError) {
      return permissionError;
    }

    return cb(decodedToken, token);
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code:
              error instanceof TokenExpiredError
                ? "TOKEN_EXPIRED"
                : "INVALID_TOKEN",
            message: error.message,
          },
        },
        { status: 401 },
      );
    }

    // Handle unexpected errors
    console.error("Unexpected error in privateRoute:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "An unexpected error occurred",
          ...(process.env.NODE_ENV === "development" && {
            details: error instanceof Error ? error.message : String(error),
          }),
        },
      },
      { status: 500 },
    );
  }
}
