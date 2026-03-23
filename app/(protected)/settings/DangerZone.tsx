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
    <div className="mt-12 pt-8 border-t border-red-900/30">
      <div className="flex items-start gap-4 p-4 bg-red-950/10 border border-red-900/20">
        <div className="p-2 bg-red-900/20 text-red-500">
          <AlertTriangle size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-xs font-black uppercase tracking-widest text-red-500">
            Danger Zone / Purge Account
          </h3>
          <p className="text-[10px] text-stone-500 font-mono mt-1 uppercase leading-relaxed">
            Permanently deactivate your operative profile. This action will
            disconnect all tactical data.
          </p>

          {!showConfirm ? (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="mt-4 px-4 py-2 border border-red-900/50 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              Initiate_Purge_Sequence()
            </button>
          ) : (
            <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
              <p className="text-[10px] text-red-400 font-bold uppercase">
                Confirm identity to proceed:
              </p>

              {isGoogleUser ? (
                <div className="space-y-2">
                  <p className="text-[10px] text-stone-400 font-mono uppercase">
                    To confirm, please type your email:{" "}
                    <span className="text-white selection:bg-red-500">
                      {user?.email}
                    </span>
                  </p>
                  <input
                    type="email"
                    placeholder="TYPE_YOUR_EMAIL_HERE"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    className="w-full bg-stone-950 border border-red-900/50 p-2 text-xs font-mono text-red-500 outline-none focus:border-red-500 placeholder:text-red-900/30"
                  />
                </div>
              ) : (
                <input
                  type="password"
                  placeholder="ENTER_PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-950 border border-red-900/50 p-2 text-xs font-mono text-red-500 outline-none focus:border-red-500"
                />
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading || !isFormValid}
                  className="flex-1 bg-red-600 text-white py-2 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                  className="flex-1 border border-stone-800 text-stone-500 py-2 text-[10px] font-black uppercase tracking-widest hover:text-white"
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
