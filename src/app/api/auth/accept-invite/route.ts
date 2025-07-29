import { AcceptInviteUserSchema } from "@/schemas/user.schema";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  IJWTInvitePayload,
  INVITE_TOKEN_TYPE,
} from "../../organization/[id]/invite/generateInviteToken";
import prisma from "@/lib/prisma";
import { hash } from "argon2";
import { UserStatus } from "@prisma/client";
import generateToken, { IJWTPayload } from "../../helpers/generateToken";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/binary";
import handleError from "../../helpers/handleError";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, firstName, lastName, password } =
      AcceptInviteUserSchema.parse(body);
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as IJWTInvitePayload & JwtPayload;
    if (decodedToken.type !== INVITE_TOKEN_TYPE) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_TOKEN_TYPE",
            message: "invalid token type",
          },
        },
        { status: 401 },
      );
    }
    const hashedPassword = await hash(password);
    const result = await prisma.$transaction(async (tx) => {
      await tx.organizationMember.update({
        where: {
          userId_organizationId: {
            userId: decodedToken.id,
            organizationId: decodedToken.organizationId,
          },
        },
        data: {
          status: UserStatus.ACTIVE,
        },
      });

      const user = await tx.user.update({
        where: {
          id: decodedToken.id,
        },
        data: {
          firstName,
          lastName,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          OrganizationMembers: {
            where: {
              organizationId: decodedToken.organizationId,
            },
            select: {
              organizationId: true,
              role: true,
              permissions: true,
              status: true,
            },
          },
        },
      });

      return user;
    });

    const authToken = generateToken<IJWTPayload>({
      id: result.id,
      organizations: result.OrganizationMembers,
    });

    const responseData = {
      user: {
        id: result.id,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
      },

      organizationMemberships: result.OrganizationMembers,
      token: authToken,
    };

    return NextResponse.json(
      {
        success: true,

        data: responseData,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INVITATION_NOT_FOUND",
              message: "invitation not found or already accepted",
            },
          },
          { status: 404 },
        );
      }
    }
    return handleError(error, "Failed to accept invitation");
  }
}
