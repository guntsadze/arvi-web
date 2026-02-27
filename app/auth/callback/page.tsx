"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookie from "js-cookie";
import { apiClient } from "@/lib/api";
import { Wrench, Activity, Shield } from "lucide-react";

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.push("/login?error=no_token");
      return;
    }

    Cookie.set("token", token, { expires: 7 });

    const fetchUser = async () => {
      try {
        const user = await apiClient.get("/users/profile");
        localStorage.setItem("user", JSON.stringify(user));
        router.push("/feed");
      } catch {
        router.push("/feed");
      }
    };

    fetchUser();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0e0d] p-6 font-mono overflow-hidden relative">
      {/* ── BACKGROUND LAYER (ProfilePage-ის იდენტური) ── */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#44403c_0%,transparent_70%)] opacity-20 pointer-events-none" />

      {/* ── DIAGNOSTIC BOX ── */}
      <div className="w-full max-w-sm bg-stone-900 border-4 border-stone-800 shadow-[12px_12px_0_0_#000] relative overflow-hidden">
        {/* Scanline Effect Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-10 bg-[length:100%_4px,3px_100%] pointer-events-none" />

        {/* Top Header Bar */}
        <div className="bg-stone-800 px-4 py-2 border-b-2 border-stone-700 flex justify-between items-center">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 bg-amber-500 animate-pulse" />
            <div className="w-2 h-2 bg-stone-600" />
            <div className="w-2 h-2 bg-stone-600" />
          </div>
          <span className="text-[10px] text-stone-500 font-black tracking-widest uppercase">
            System_Sync_v2.6
          </span>
        </div>

        <div className="p-8 flex flex-col items-center gap-8 relative z-20">
          {/* Main Visualizer */}
          <div className="relative">
            {/* Square frame like Profile Avatar */}
            <div className="w-24 h-24 bg-black border-2 border-stone-700 flex items-center justify-center shadow-[4px_4px_0_0_#44403c]">
              <Wrench
                size={32}
                className="text-amber-500 animate-spin [animation-duration:3s]"
              />
            </div>
            {/* Amber Corner Accents */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-amber-500" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-amber-500" />
          </div>

          {/* Text Diagnostics */}
          <div className="space-y-3 w-full text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20">
              <Shield size={12} className="text-amber-500" />
              <h2 className="text-amber-500 text-[11px] font-black uppercase tracking-[0.3em] animate-pulse">
                Identity_Link_Active
              </h2>
            </div>

            <div className="space-y-1">
              <p className="text-stone-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                Synchronizing_User_Node...
              </p>
              <div className="flex items-center justify-center gap-2 text-stone-600 text-[9px] italic">
                <Activity size={10} />
                <span>Encrypted_Stream_Established</span>
              </div>
            </div>
          </div>

          {/* Progress Bar (Tailwind standard) */}
          <div className="w-full h-1.5 bg-black border border-stone-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-amber-500/20 animate-pulse" />
            <div className="h-full bg-amber-500 shadow-[0_0_8px_#f59e0b] w-1/3 animate-[loading_2s_infinite_linear]" />
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="px-4 py-2 bg-stone-900/50 border-t border-stone-800 flex justify-between items-center text-[8px] text-stone-700 font-bold uppercase tracking-tighter">
          <span>Auth_Protocol::OAUTH2</span>
          <span>Buffer::OK</span>
        </div>
      </div>

      {/* Tailwind Custom Keyframe Placeholder (in globals.css it should be, or use inline if needed) */}
      <style jsx global>{`
        @keyframes loading {
          0% {
            transform: translateX(-150%);
          }
          100% {
            transform: translateX(350%);
          }
        }
      `}</style>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="bg-[#0f0e0d] min-h-screen">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-[#0f0e0d]">
            <div className="text-amber-500 font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse">
              System_Booting...
            </div>
          </div>
        }
      >
        <AuthCallbackHandler />
      </Suspense>
    </div>
  );
}
