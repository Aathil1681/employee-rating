import { NextRequest, NextResponse } from "next/server";
import privateRoute from "../../helpers/privateRoute";
import prisma from "@/lib/prisma";
import handleError from "../../helpers/handleError";

export async function GET(request: NextRequest) {
  return privateRoute(
    request,
    { permissions: [] }, //no specific permissions required beyond authentication
    async (currentUser) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: currentUser.id,
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true,
            updatedAt: true,
            OrganizationMembers: {
              include: {
                Organization: true,
                Supervisor: true,
                Employees: true,
              },
            },
            OwnedOrganizations: true,
          },
        });

        if (!user) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "USER_NOT_FOUND",
                message: "user not found",
              },
            },
            { status: 404 },
          );
        }

        return NextResponse.json(
          {
            success: true,
            data: user,
          },
          { status: 200 },
        );
      } catch (error) {
        return handleError(error, "failed to fetch user details");
      }
    },
  );
}
