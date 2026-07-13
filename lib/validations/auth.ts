import { z } from "zod";

/** E.164 phone format, matches the backend's RequestOtpDto/VerifyOtpDto validator. */
export const E164_REGEX = /^\+[1-9]\d{1,14}$/;

export const phoneSchema = z.object({
  phone: z
    .string()
    .regex(E164_REGEX, "ტელეფონის ნომერი არასწორი ფორმატშია"),
});

export const otpSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "კოდი უნდა შედგებოდეს 6 ციფრისგან"),
});

export type PhoneFormData = z.infer<typeof phoneSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
