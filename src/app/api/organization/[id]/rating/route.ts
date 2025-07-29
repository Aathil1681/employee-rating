import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import privateRoute from "@/app/api/helpers/privateRoute";
import handleError from "@/app/api/helpers/handleError";
import { createRatingSchema } from "@/schemas/rating.schema";

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
      permissions: ["RATING:*:*", "RATING:CREATE:*", "RATING:CREATE:ASSIGNED"],
    },
    async (user) => {
      try {
        //validation
        const parsed = createRatingSchema.parse(body);

        const { employeeId, periodStart, periodEnd, feedback, criteriaScores } =
          parsed;

        // Find supervisor's membership in this organization
        const supervisorMembership = await prisma.organizationMember.findFirst({
          where: {
            userId: employeeId,
            supervisorId: user.id,
          },
          include: {
            Organization: true,
          },
        });

        if (!supervisorMembership) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "NOT_SUPERVISOR",
                message: "You are not the supervisor of this employee",
              },
            },
            { status: 403 },
          );
        }

        //Get all criteria IDs from the payload
        const criteriaIds = criteriaScores.map((cs) => cs.criteriaId);
        // Find all matching criteria in the organization
        const criteria = await prisma.criteria.findMany({
          where: {
            id: { in: criteriaIds },
            orgId: organizationId,
          },
          select: { id: true },
        });

        // Validate all IDs exist
        if (criteria.length !== criteriaScores.length) {
          const validIds = new Set(criteria.map((c) => c.id));
          const missingIds = criteriaScores
            .filter((cs) => !validIds.has(cs.criteriaId))
            .map((cs) => cs.criteriaId);

          return NextResponse.json(
            {
              success: false,
              error: {
                code: "INVALID_CRITERIA",
                message: `The following criteria do not belong to this organization: ${missingIds.join(", ")}`,
              },
            },
            { status: 400 },
          );
        }

        const maxOverallScore = criteriaScores.reduce(
          (sum, cs) => sum + cs.score,
          0,
        );
        // Create rating first
        const newRating = await prisma.rating.create({
          data: {
            periodStart: new Date(periodStart),
            periodEnd: new Date(periodEnd),
            feedback,
            overallScore: maxOverallScore,
            maxOverallScore,
            employeeId,
            supervisorId: user.id,
            criteriaScores: {
              create: criteriaScores.map((cs) => ({
                criteriaId: cs.criteriaId,
                score: cs.score,
              })),
            },
          },
          include: {
            criteriaScores: true,
          },
        });
        return NextResponse.json(
          { success: true, data: newRating },
          { status: 201 },
        );
      } catch (error) {
        return handleError(error, "Failed to create rating");
      }
    },
  );
}
