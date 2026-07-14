"use client";
import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { authService } from "@/services/auth/auth.services";
import { selectCurrentUser } from "@/store/slices/userSlice";

export function DangerZone() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectCurrentUser);
  const isGoogleUser = user?.avatar?.provider === "GOOGLE";

  const handleDelete = async () => {
    if (isGoogleUser && confirmEmail !== user?.email) {
      alert("Email does not match!");
      return;
    }

    setLoading(true);

    const payload = isGoogleUser
      ? { confirmEmail: confirmEmail }
      : { password: password };

    try {
      await apiClient.delete("/users/me", payload);

      authService.logout();
      router.push("/");
    } catch (err: any) {
      alert(err.data?.message || "Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = isGoogleUser
    ? confirmEmail === user?.email
    : password.length > 0;

  return (
    <div className="mt-12 pt-8 border-t border-error/30">
      <div className="flex items-start gap-4 p-4 bg-error/10/10 border border-error/20">
        <div className="p-2 bg-error/10/20 text-error">
          <AlertTriangle size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-xs font-black uppercase tracking-widest text-error">
            Danger Zone / Purge Account
          </h3>
          <p className="text-[10px] text-text-secondary font-mono mt-1 uppercase leading-relaxed">
            Permanently deactivate your operative profile. This action will
            disconnect all tactical data.
          </p>

          {!showConfirm ? (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="mt-4 px-4 py-2 border border-error/50 text-error text-[10px] font-black uppercase tracking-widest hover:bg-error hover:text-white transition-all"
            >
              Initiate_Purge_Sequence()
            </button>
          ) : (
            <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
              <p className="text-[10px] text-error font-bold uppercase">
                Confirm identity to proceed:
              </p>

              {isGoogleUser ? (
                <div className="space-y-2">
                  <p className="text-[10px] text-text-secondary font-mono uppercase">
                    To confirm, please type your email:{" "}
                    <span className="text-white selection:bg-error">
                      {user?.email}
                    </span>
                  </p>
                  <input
                    type="email"
                    placeholder="TYPE_YOUR_EMAIL_HERE"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    className="w-full bg-background border border-error/50 p-2 text-xs font-mono text-error outline-none focus:border-error placeholder:text-error/30"
                  />
                </div>
              ) : (
                <input
                  type="password"
                  placeholder="ENTER_PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-error/50 p-2 text-xs font-mono text-error outline-none focus:border-error"
                />
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading || !isFormValid}
                  className="flex-1 bg-error text-white py-2 text-[10px] font-black uppercase tracking-widest hover:bg-error disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" size={14} />
                  ) : (
                    "CONFIRM_DELETE"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirm(false);
                    setConfirmEmail("");
                    setPassword("");
                  }}
                  className="flex-1 border border-border text-text-secondary py-2 text-[10px] font-black uppercase tracking-widest hover:text-white"
                >
                  ABORT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
