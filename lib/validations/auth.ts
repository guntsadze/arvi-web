import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("არასწორი ელ. ფოსტის ფორმატი"),
  password: z.string().min(6, "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო"),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "სახელი უნდა იყოს მინიმუმ 2 სიმბოლო"),
    lastName: z.string().min(2, "გვარი უნდა იყოს მინიმუმ 2 სიმბოლო"),
    email: z.string().email("არასწორი ელ. ფოსტის ფორმატი"),
    phone: z.string().optional(),
    password: z.string().min(6, "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "პაროლები არ ემთხვევა",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
