import { z } from "zod";
const CriteriaSchema = z.object({
  name: z
    .string({ required_error: "Criteria name is required" })
    .min(2, { message: "should be atleast two characters long" }),
  maxScore: z
    .number()
    .int()
    .positive({ message: "maxScore must be a positive integer" }),
});
export { CriteriaSchema };
