"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

import { authService } from "@/services/auth/auth.services";
import { phoneSchema } from "@/lib/validations/auth";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { GoogleButton } from "./GoogleButton";
import { PhoneNumberField, COUNTRY_PREFIX } from "./PhoneNumberField";
import { OtpCodeField } from "./OtpCodeField";

type Step = "method" | "phone" | "otp";

/** Mirrors the backend's per-number resend cooldown (otp.service.ts RESEND_COOLDOWN_SECONDS). */
const RESEND_COOLDOWN_SECONDS = 60;

interface AuthCardProps {
  initialError?: string;
}

export function AuthCard({ initialError }: AuthCardProps) {
  const router = useRouter();

  const [step, setStep] = useState<Step>("method");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [otpError, setOtpError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>(
    initialError,
  );

  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const fullPhone = `${COUNTRY_PREFIX}${phoneDigits}`;

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setTimeout(
      () => setCooldownSeconds((seconds) => seconds - 1),
      1000,
    );
    return () => clearTimeout(timer);
  }, [cooldownSeconds]);

  const handleGoogleClick = () => {
    setIsRedirecting(true);
    authService.redirectToGoogle();
  };

  const handlePhoneStepOpen = () => {
    setFormError(undefined);
    setStep("phone");
  };

  const requestOtp = async (): Promise<boolean> => {
    const result = phoneSchema.safeParse({ phone: fullPhone });
    if (!result.success) {
      setPhoneError(
        result.error.issues[0]?.message ?? "ტელეფონის ნომერი არასწორია",
      );
      return false;
    }

    setPhoneError(undefined);
    setFormError(undefined);
    setIsSendingCode(true);
    try {
      await authService.requestOtp(fullPhone);
      setCooldownSeconds(RESEND_COOLDOWN_SECONDS);
      return true;
    } catch (error) {
      setFormError(getApiErrorMessage(error, "კოდის გაგზავნა ვერ მოხერხდა"));
      return false;
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSendCode = async () => {
    const sent = await requestOtp();
    if (sent) {
      setOtpCode("");
      setOtpError(undefined);
      setStep("otp");
    }
  };

  const handleResend = async () => {
    if (cooldownSeconds > 0 || isSendingCode) return;
    setOtpError(undefined);
    const sent = await requestOtp();
    if (sent) setOtpCode("");
  };

  const handleBackToPhone = () => {
    setOtpError(undefined);
    setFormError(undefined);
    setStep("phone");
  };

  const handleVerify = async () => {
    if (otpCode.length !== 6) {
      setOtpError("შეიყვანეთ 6-ნიშნა კოდი");
      return;
    }
    setOtpError(undefined);
    setIsVerifying(true);
    try {
      const result = await authService.verifyOtp(fullPhone, otpCode);
      if (result.isNewUser) {
        router.push("/onboarding/garage");
      } else if (result.wasRestored) {
        router.push("/feed?restored=true");
      } else {
        router.push("/feed");
      }
    } catch (error) {
      setOtpError(getApiErrorMessage(error, "კოდი არასწორია ან ვადაგასულია"));
    } finally {
      setIsVerifying(false);
    }
  };

  const stepCopy: Record<Step, { title: string; subtitle: string }> = {
    method: {
      title: "შესვლა Arvi-ზე",
      subtitle: "გააგრძელე Google-ით ან ტელეფონის ნომრით",
    },
    phone: {
      title: "ტელეფონის ნომერი",
      subtitle: "გამოგიგზავნით ერთჯერად კოდს SMS-ით",
    },
    otp: {
      title: "დაადასტურე კოდი",
      subtitle: `გამოგზავნილია ${fullPhone}-ზე`,
    },
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-surface-1 p-8 shadow-2xl shadow-black/30">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-text-primary">
          {stepCopy[step].title}
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          {stepCopy[step].subtitle}
        </p>
      </div>

      {formError && (
        <div className="mb-4 rounded-md border border-error/40 bg-error/10 px-3 py-2.5 text-sm text-error">
          {formError}
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {step === "method" && (
          <motion.div
            key="method"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <GoogleButton
              onClick={handleGoogleClick}
              disabled={isRedirecting}
            />
            <button
              type="button"
              onClick={handlePhoneStepOpen}
              className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              ტელეფონით გაგრძელება
            </button>
          </motion.div>
        )}

        {step === "phone" && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendCode();
              }}
              className="space-y-4"
            >
              <PhoneNumberField
                value={phoneDigits}
                onChange={setPhoneDigits}
                error={phoneError}
                disabled={isSendingCode}
                autoFocus
              />
              <button
                type="submit"
                disabled={isSendingCode}
                className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSendingCode ? "იგზავნება..." : "კოდის გაგზავნა"}
              </button>
              <button
                type="button"
                onClick={() => setStep("method")}
                className="flex w-full items-center justify-center gap-1 py-1 text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                <ChevronLeft size={16} />
                უკან
              </button>
            </form>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <OtpCodeField
              value={otpCode}
              onChange={(value) => {
                setOtpCode(value);
                if (otpError) setOtpError(undefined);
              }}
              disabled={isVerifying}
              autoFocus
            />
            {otpError && <p className="text-xs text-error">{otpError}</p>}

            <button
              type="button"
              onClick={handleVerify}
              disabled={isVerifying || otpCode.length !== 6}
              className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isVerifying ? "მოწმდება..." : "დადასტურება"}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={handleBackToPhone}
                className="flex items-center gap-1 text-text-secondary transition-colors hover:text-text-primary"
              >
                <ChevronLeft size={16} />
                ნომრის შეცვლა
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={cooldownSeconds > 0 || isSendingCode}
                className="text-accent transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:text-text-muted disabled:opacity-100"
              >
                {cooldownSeconds > 0
                  ? `ხელახლა გაგზავნა (${cooldownSeconds}წმ)`
                  : "კოდის ხელახლა გაგზავნა"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
