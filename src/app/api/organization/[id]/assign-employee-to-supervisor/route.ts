import privateRoute from "@/app/api/helpers/privateRoute";
import { AssignEmployeesSchema } from "@/schemas/user.schema";
import { OrganizationStatus, UserRole, UserStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import handleError from "@/app/api/helpers/handleError";

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
      permissions: ["USER:*:*", "USER:ASSIGN:ASSIGNED"],
    },
    async () => {
      try {
        const { supervisorId, employeeIds } = AssignEmployeesSchema.parse(body);
        //Check if organization is active
        const organization = await prisma.organization.findUnique({
          where: { id: organizationId, status: OrganizationStatus.ACTIVE },
          select: { id: true },
        });

        if (!organization) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "ORG_NOT_FOUND",
                message: "Organization not found or inactive.",
              },
            },
            { status: 404 },
          );
        }
        //Check if supervisor exists and is in the organization
        const supervisor = await prisma.organizationMember.findFirst({
          where: {
            userId: supervisorId,
            organizationId,
            role: UserRole.SUPERVISOR,
            status: UserStatus.ACTIVE,
          },
        });
        if (!supervisor) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "SUPERVISOR_NOT_FOUND",
                message: "Supervisor not found in the organization.",
              },
            },
            { status: 404 },
          );
        }

        //Find valid employee members
        const existingEmployees = await prisma.organizationMember.findMany({
          where: {
            userId: { in: employeeIds },
            organizationId,
            status: UserStatus.ACTIVE,
            role: UserRole.EMPLOYEE,
          },
          select: { userId: true },
        });
        const existingEmployeeIds = existingEmployees.map((emp) => emp.userId);
        const missingEmployeeIds = employeeIds.filter(
          (id) => !existingEmployeeIds.includes(id),
        );
        if (missingEmployeeIds.length > 0) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "EMPLOYEES_NOT_FOUND",
                message: `The following employees are not in the organization: ${missingEmployeeIds.join(", ")}`,
              },
            },
            { status: 400 },
          );
        }

        // Assign employees to supervisor
        await prisma.organizationMember.updateMany({
          where: {
            userId: { in: employeeIds },
            organizationId,
          },
          data: {
            supervisorId,
          },
        });

        return NextResponse.json(
          {
            success: true,
            data: {
              assignedEmployees: employeeIds.length,
              supervisorId,
              organizationId,
            },
          },
          { status: 200 },
        );
      } catch (error) {
        return handleError(error, "Failed to assign employees to supervisor");
      }
    },
  );
}
