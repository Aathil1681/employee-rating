import { z } from "zod";
export const createRatingSchema = z.object({
  employeeId: z.string().min(1, { message: "Employee ID is required" }),
  periodStart: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  periodEnd: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date",
  }),
  feedback: z.string().optional(),
  criteriaScores: z
    .array(
      z.object({
        criteriaId: z.string().min(1, { message: "Criteria ID is required" }),
        score: z
          .number()
          .int()
          .min(0, { message: "Score must be a non-negative integer" }),
      }),
    )
    .min(1, { message: "At least one criteria score is required" }),
});
