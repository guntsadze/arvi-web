"use client";
import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { authService } from "@/services/auth/auth.services";

export function DangerZone() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await apiClient.delete("/users/me", { password });
      authService.logout();
      router.push("/");
    } catch (err) {
      alert("Failed to delete account. Check your password.");
    } finally {
      setLoading(false);
    }
  };

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
              <input
                type="password"
                placeholder="ENTER_PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-950 border border-red-900/50 p-2 text-xs font-mono text-red-500 outline-none focus:border-red-500"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-2 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" size={14} />
                  ) : (
                    "CONFIRM_DELETE"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
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
