import { z } from "zod";

export const loginSchema = z.object({
  password: z.string().min(6, "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო"),
  identifier: z
    .string()
    .min(1, "შეიყვანეთ ელ. ფოსტა, მომხმარებლის სახელი ან ტელეფონი"),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, "სახელი უნდა იყოს მინიმუმ 2 სიმბოლო"),
  lastName: z.string().min(2, "გვარი უნდა იყოს მინიმუმ 2 სიმბოლო"),
  username: z.string().min(3, "UserName უნდა იყოს მინიმუმ 3 სიმბოლო"),
  email: z.string().email("არასწორი ელ. ფოსტის ფორმატი"),
  phone: z.string().optional(),
  password: z.string().min(6, "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
