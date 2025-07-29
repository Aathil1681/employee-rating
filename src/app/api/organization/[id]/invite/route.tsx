import privateRoute from "@/app/api/helpers/privateRoute";
import { InviteUserSchema } from "@/schemas/user.schema";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OrganizationStatus, UserRole, UserStatus } from "@prisma/client";
import {
  EMPLOYEE_PERMISSIONS,
  SUPERVISOR_PERMISSIONS,
} from "@/app/api/auth/permissions";
import { hash } from "argon2";
import generateInviteToken from "./generateInviteToken";
import InviteUser from "@/email-templates/InviteUser";
import handleError from "@/app/api/helpers/handleError";
import { render } from "@react-email/components";
import { sendEmail } from "@/lib/nodemailer";

const generateRandomPassword = (): string => {
  const array = new Uint32Array(2);
  crypto.getRandomValues(array);
  return `${array[0]}${array[1]}`.slice(0, 12);
};

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
      permissions: ["ORGANIZATION:*:*", "ORGANIZATION:INVITE:*"],
    },
    async (inviter) => {
      try {
        const { email, role } = InviteUserSchema.parse(body);

        const organization = await prisma.organization.findUnique({
          where: {
            id: organizationId,
            status: OrganizationStatus.ACTIVE,
          },
          select: { id: true, name: true, ownerId: true },
        });

        if (!organization) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "ORGANIZATION_NOT_FOUND",
                message: "organization is not found or inactive",
              },
            },
            { status: 404 },
          );
        }

        const existingMember = await prisma.organizationMember.findFirst({
          where: {
            User: { email },
            organizationId,
          },
          include: {
            User: true,
          },
        });

        if (existingMember) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "USER_ALREADY_MEMBER",
                message: "User is already part of this organization",
              },
            },
            { status: 409 },
          );
        }

        //prepare user data
        const permissions =
          role === UserRole.SUPERVISOR
            ? SUPERVISOR_PERMISSIONS
            : EMPLOYEE_PERMISSIONS;

        const password = generateRandomPassword();
        const hashedPassword = await hash(password);

        //check if user exists in system
        const existingUser = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        const user = existingUser
          ? await prisma.user.update({
              where: {
                id: existingUser.id,
              },
              data: {
                OrganizationMembers: {
                  create: {
                    organizationId,
                    role,
                    permissions,
                    status: UserStatus.INVITED,
                  },
                },
              },
            })
          : await prisma.user.create({
              data: {
                email,
                password: hashedPassword,
                OrganizationMembers: {
                  create: {
                    organizationId,
                    role,
                    permissions,
                    status: UserStatus.INVITED,
                  },
                },
              },
            });

        //generate Invite token and link
        const token = generateInviteToken({
          id: user.id,
          organizationId,
        });

        const inviteLink = `${process.env.NEXT_PUBLIC_HOST_URL}/accept-invite?token=${token}`; //need to add the code here

        //send invitation email
        const emailHtml = await render(
          <InviteUser
            invitedByUsername={inviter.firstName || inviter.emil}
            teamName={organization.name}
            username={user.firstName || user.email}
            invitedByEmail={inviter.emai}
            inviteLink={inviteLink}
          />,
        );

        await sendEmail({
          to: user.email,
          subject: `invite to join ${organization.name}`,
          html: emailHtml,
        });

        //ideal success response
        return NextResponse.json(
          {
            success: true,
            data: {
              userId: user.id,
              email: user.email,
              role,
              status: UserStatus.INVITED,
              organization: {
                id: organization.id,
                name: organization.name,
              },
              inviteSent: true,
            },
          },
          { status: 200 },
        );
      } catch (error) {
        return handleError(error, "Failed to send invitation");
      }
    },
  );
}
