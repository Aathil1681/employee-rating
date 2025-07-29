import { z } from "zod";

const CreateOrganizationSchema = z.object({
  name: z
    .string({ required_error: "Organization name is required" })
    .min(2, { message: "First name must be at least 2 characters long" })
    .max(50, { message: "First name cannot exceed 50 characters" })
    .trim()
    .regex(/^[a-zA-Z1-9\s-]+$/, {
      message: "First name can only contain letters, spaces, and hyphens",
    }),
});

export { CreateOrganizationSchema };
