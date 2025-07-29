import { LoginUserSchema, RegisterUserSchema } from "@/schemas/user.schema";
import { Prisma, User } from "@prisma/client";
import { z } from "zod";

export type UserWithToken = User & { token: string };

export type LoginInput = z.infer<typeof LoginUserSchema>;

export type UserWithOrgMembers = Prisma.UserGetPayload<{
  include: { OrganizationMembers: true };
}>;

export type RegisterInput = z.infer<typeof RegisterUserSchema>;

export type UserWithRelations = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    firstName: true;
    lastName: true;
    createdAt: true;
    updatedAt: true;
    OrganizationMembers: true;
    OwnedOrganizations: true;
    RatingsAsEmployee: true;
    RatingsAsSupervisor: true;
  };
}>;
