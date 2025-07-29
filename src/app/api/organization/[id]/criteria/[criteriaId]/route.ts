import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import privateRoute from "@/app/api/helpers/privateRoute";
import handleError from "@/app/api/helpers/handleError";
import { CriteriaSchema } from "@/schemas/criteria.schema";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ criteriaId: string }> },
) {
  const { criteriaId } = await params;
  const body = await request.json();

  return privateRoute(
    request,
    {
      permissions: ["ORGANIZATION:CRITERIA:UPDATE", "ORGANIZATION:*:*"],
    },
    async () => {
      try {
        const validatedData = CriteriaSchema.partial().parse(body); // allow partial update

        // Find criteria with orgId and owner info
        const criteria = await prisma.criteria.findUnique({
          where: { id: criteriaId },
          select: {
            orgId: true,
            Organization: {
              select: {
                ownerId: true,
              },
            },
          },
        });

        if (!criteria) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "CRITERIA_NOT_FOUND",
                message: "Criteria not found",
              },
            },
            { status: 404 },
          );
        }

        // Update criteria
        const updatedCriteria = await prisma.criteria.update({
          where: { id: criteriaId },
          data: validatedData,
        });

        return NextResponse.json(
          {
            success: true,
            data: updatedCriteria,
          },
          { status: 200 },
        );
      } catch (error) {
        return handleError(error, "Failed to update criteria");
      }
    },
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ criteriaId: string }> },
) {
  const { criteriaId } = await params;
  return privateRoute(
    request,
    {
      permissions: ["ORGANIZATION:CRITERIA:DELETE", "ORGANIZATION:*:*"],
    },
    async () => {
      try {
        // Delete criteria
        await prisma.criteria.delete({
          where: { id: criteriaId },
        });
        return NextResponse.json(
          {
            success: true,
            message: "Criteria deleted successfully",
          },
          { status: 200 },
        );
      } catch (error) {
        return handleError(error, "Failed to delete criteria");
      }
    },
  );
}
