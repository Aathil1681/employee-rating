import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import privateRoute from "@/app/api/helpers/privateRoute";
import handleError from "@/app/api/helpers/handleError";
import { CriteriaSchema } from "@/schemas/criteria.schema";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: organizationId } = await params;
  const body = await request.json();

  return privateRoute(
    request,
    {
      organizationId,
      permissions: ["ORGANIZATION:CRITERIA:CREATE", "ORGANIZATION:*:*"],
    },
    async () => {
      try {
        //validation
        const { name, maxScore } = CriteriaSchema.parse(body);

        //create new criteria
        const newCriteria = await prisma.criteria.create({
          data: {
            name,
            maxScore,
            Organization: {
              connect: {
                id: organizationId,
              },
            },
          },
        });

        return NextResponse.json(
          {
            success: true,
            data: newCriteria,
          },
          { status: 201 },
        );
      } catch (error) {
        return handleError(error, "Failed to create criteria");
      }
    },
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: organizationId } = await params;
  return privateRoute(
    request,
    {
      organizationId,
      permissions: ["ORGANIZATION:CRITERIA:READ", "ORGANIZATION:*:*"],
    },
    async () => {
      try {
        const criteriaList = await prisma.criteria.findMany({
          where: {
            orgId: organizationId,
          },
        });
        return NextResponse.json(
          {
            success: true,
            data: criteriaList,
          },
          { status: 200 },
        );
      } catch (error) {
        return handleError(error, "Failed to fetch criteria");
      }
    },
  );
}
