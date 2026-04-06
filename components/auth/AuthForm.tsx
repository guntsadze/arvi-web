"use client";

import Link from "next/link";
import { ShieldCheck, Cpu } from "lucide-react";

interface AuthFormProps {
  title?: string;
  subtitle?: string;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  children: React.ReactNode;
  globalError?: string;
  submitLabel: string;
  linkText: string;
  linkHref: string;
}

export const AuthForm = ({
  title,
  subtitle,
  onSubmit,
  isLoading,
  children,
  globalError,
  submitLabel,
  linkText,
  linkHref,
}: AuthFormProps) => (
  <div className="min-h-screen flex items-center justify-center bg-[#1c1917] relative overflow-hidden">
    {/* Background Grid & Effects */}
    <div
      className="absolute inset-0 opacity-20 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, #44403c 1px, transparent 1px),
          linear-gradient(to bottom, #44403c 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    />

    {/* Animated Scanline - კლასი "animate-scan" უნდა დაამატო globals.css-ში, 
       თუ არ დაამატებ, უბრალოდ ხაზი იქნება ანიმაციის გარეშე, შეცდომას არ გამოიწვევს */}
    <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-scan opacity-20 pointer-events-none" />

    {/* Decorative Big Text */}
    <div className="absolute -bottom-20 -right-20 text-[200px] font-black text-stone-400/20 leading-none select-none pointer-events-none z-0">
      SYSTEM
    </div>

    <div className="relative z-10 w-full max-w-md mx-4">
      {/* Main Card Container */}
      <div className="relative group bg-[#201d1b] border border-stone-800 p-8 md:p-10 shadow-2xl">
        {/* Tech Corners */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-600" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-600" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-600" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-600" />

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-900 border border-stone-700 mb-6 group-hover:border-amber-600/50 transition-colors duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <ShieldCheck className="w-8 h-8 text-amber-600" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-8 bg-stone-700" />
            <span className="text-[10px] font-mono text-stone-300 uppercase tracking-[0.3em]">
              Secure Access
            </span>
            <div className="h-px w-8 bg-stone-700" />
          </div>

          <h2 className="text-3xl font-black text-[#EBE9E1] uppercase tracking-tighter">
            {title}
          </h2>
          <p className="text-stone-300 font-mono text-xs mt-2 uppercase">
            {subtitle}
          </p>
        </div>

        {globalError && (
          <div className="mb-6 p-4 bg-red-900/10 border border-red-900/50 flex items-start gap-3">
            <div className="text-red-500 mt-0.5">
              <Cpu size={16} className="animate-pulse" />
            </div>
            <div>
              <span className="text-red-500 text-[10px] font-mono uppercase tracking-widest block mb-1">
                System Error
              </span>
              <span className="text-red-400 text-xs font-mono block">
                {globalError}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {children}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              clipPath:
                "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
            }}
            className="w-full py-4 mt-6 bg-amber-700 text-stone-900 font-black uppercase tracking-[0.2em] text-sm hover:bg-amber-600 transition-all duration-200 shadow-[0_0_20px_rgba(180,83,9,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              submitLabel
            )}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-stone-800">
          <span className="text-[#EBE9E1] text-xs font-mono uppercase mr-2">
            {linkText}
          </span>
          <Link
            href={linkHref}
            className="text-amber-600 hover:text-amber-500 text-xs font-bold font-mono uppercase tracking-wider hover:underline underline-offset-4 decoration-amber-600/50 transition-all"
          >
            {linkHref.includes("login") ? "Open Log" : "Initialize"} →
          </Link>
        </div>
      </div>
    </div>
  </div>
);

// "use client";

// import Link from "next/link";
// import { Chrome, Apple, Power, Key, ArrowRightLeft } from "lucide-react";

// interface AuthFormProps {
//   title: string;
//   subtitle: string;
//   onSubmit: (data: any) => void;
//   isLoading: boolean;
//   children: React.ReactNode;
//   globalError?: string;
//   submitLabel: string;
//   linkText: string;
//   linkHref: string;
// }

// export const AuthForm = ({
//   title,
//   subtitle,
//   onSubmit,
//   isLoading,
//   children,
//   submitLabel,
//   linkText,
//   linkHref,
// }: AuthFormProps) => (
//   <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 overflow-hidden font-mono text-stone-300">
//     {/* Ground Reflection */}
//     <div className="absolute bottom-0 w-full h-[20vh] bg-amber-900/10 blur-[120px] pointer-events-none" />

//     <div className="relative z-10 w-full max-w-[700px] transition-all duration-700">
//       {/* 1. საქარე მინა (WINDSHIELD) - აქ არის ინფუთები */}
//       <div
//         className="relative mx-auto w-[85%] h-64 bg-[#222] border-x-[12px] border-stone-800 transition-all duration-500 ease-in-out transform group-focus-within:scale-110 group-focus-within:z-50"
//         style={{
//           clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
//           boxShadow: "inset 0 20px 50px rgba(0,0,0,0.8)",
//         }}
//       >
//         <div className="absolute inset-0 bg-gradient-to-b from-stone-400/5 to-transparent pointer-events-none" />

//         {/* INPUTS CONTAINER */}
//         <div className="flex flex-col items-center justify-center h-full px-12 pt-4">
//           <div className="w-full max-w-[280px] space-y-4">
//             <div className="text-center mb-2">
//               <h2 className="text-xl font-black text-white tracking-widest uppercase">
//                 {title}
//               </h2>
//               <p className="text-[10px] text-stone-300 uppercase tracking-widest italic">
//                 {subtitle}
//               </p>
//             </div>
//             {children}
//           </div>
//         </div>
//       </div>

//       {/* 2. კაპოტი (HOOD) */}
//       <div
//         className="relative w-full h-36 bg-[#0a0a0a] mt-[-2px] shadow-2xl flex justify-center"
//         style={{ clipPath: "polygon(0% 0%, 100% 0%, 96% 100%, 4% 100%)" }}
//       >
//         {/* Hood Lines */}
//         <div className="absolute left-[30%] top-0 w-[1px] h-full bg-stone-900 shadow-[2px_0_10px_black]" />
//         <div className="absolute right-[30%] top-0 w-[1px] h-full bg-stone-900 shadow-[-2px_0_10px_black]" />

//         {/* BMW BADGE -> SUBMIT BUTTON */}
//         <button
//           onClick={onSubmit}
//           disabled={isLoading}
//           className="absolute bottom-6 w-10 h-10 rounded-full bg-stone-900 border-2 border-stone-700 flex items-center justify-center hover:border-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all active:scale-90 overflow-hidden group"
//         >
//           {isLoading ? (
//             <Power className="text-amber-500 animate-spin" size={18} />
//           ) : (
//             <div className="flex flex-col items-center">
//               <span className="text-[8px] font-bold text-blue-500 leading-none">
//                 BMW
//               </span>
//               <Power
//                 className="text-stone-300 group-hover:text-amber-500"
//                 size={14}
//               />
//             </div>
//           )}
//         </button>
//       </div>

//       {/* 3. ფარები და ცხვირი (FASCIA) */}
//       <div className="relative w-[94%] mx-auto bg-[#080808] border-x-4 border-stone-900 h-28 flex items-center justify-between px-10 shadow-2xl">
//         {/* LEFT HEADLIGHTS */}
//         <div className="flex gap-3">
//           {[1, 2].map((i) => (
//             <div
//               key={i}
//               className="w-16 h-16 rounded-full bg-stone-950 border-2 border-stone-800 flex items-center justify-center shadow-inner relative overflow-hidden"
//             >
//               <div className="w-12 h-12 rounded-full border border-stone-800 bg-gradient-to-br from-stone-700/20 to-black" />
//               <div className="absolute inset-0 rounded-full border border-white/5" />
//             </div>
//           ))}
//         </div>

//         {/* KIDNEY GRILLES */}
//         <div className="flex gap-2">
//           {[1, 2].map((i) => (
//             <div
//               key={i}
//               className="w-14 h-20 bg-black border-4 border-stone-800 rounded-2xl flex flex-col justify-between p-2 shadow-inner"
//             >
//               {[...Array(7)].map((_, j) => (
//                 <div key={j} className="w-full h-[2px] bg-stone-900" />
//               ))}
//             </div>
//           ))}
//         </div>

//         {/* RIGHT HEADLIGHTS */}
//         <div className="flex gap-3">
//           {[1, 2].map((i) => (
//             <div
//               key={i}
//               className="w-16 h-16 rounded-full bg-stone-950 border-2 border-stone-800 flex items-center justify-center shadow-inner relative overflow-hidden"
//             >
//               <div className="w-12 h-12 rounded-full border border-stone-800 bg-gradient-to-br from-stone-700/20 to-black" />
//               <div className="absolute inset-0 rounded-full border border-white/5" />
//             </div>
//           ))}
//         </div>

//         {/* INDICATORS */}
//         <div className="absolute left-0 top-6 w-4 h-16 bg-orange-600/30 rounded-r-md border-r border-orange-500/20" />
//         <div className="absolute right-0 top-6 w-4 h-16 bg-orange-600/30 rounded-l-md border-l border-orange-500/20" />
//       </div>

//       {/* 4. ბამპერი (BUMPER) */}
//       <div className="relative w-full h-24 bg-[#0d0d0d] border-t-4 border-stone-900 rounded-b-[50px] flex items-center justify-center px-8">
//         {/* MARTSXENA NISL-SACINAGHMDGO (GOOGLE) */}
//         <button className="w-16 h-8 bg-[#e0e0e0] rounded-sm flex items-center justify-center hover:bg-white transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] group">
//           <Chrome
//             size={18}
//             className="text-black group-hover:scale-110 transition-transform"
//           />
//         </button>

//         {/* SANOMRE NISHANI (REGISTRATION LINK) */}
//         <Link href={linkHref} className="mx-auto">
//           <div className="bg-[#EBE9E1] border-b-4 border-stone-400 px-6 py-1 flex items-center gap-3 shadow-xl hover:scale-105 transition-transform">
//             <div className="flex flex-col items-center leading-none border-r border-stone-400 pr-2">
//               <span className="text-[8px] font-bold text-blue-800">GE</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-black font-black text-sm tracking-tighter uppercase">
//                 {linkText}
//               </span>
//               <ArrowRightLeft size={14} className="text-stone-300" />
//             </div>
//           </div>
//         </Link>

//         {/* MARJVENA NISL-SACINAGHMDGO (APPLE) */}
//         <button className="w-16 h-8 bg-[#e0e0e0] rounded-sm flex items-center justify-center hover:bg-white transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] group">
//           <Apple
//             size={18}
//             className="text-black group-hover:scale-110 transition-transform"
//           />
//         </button>
//       </div>

//       {/* WHEELS */}
//       <div className="absolute -bottom-8 left-4 w-28 h-32 bg-[#050505] border-l-[10px] border-stone-900 rounded-xl -rotate-6 -z-10 shadow-2xl" />
//       <div className="absolute -bottom-8 right-4 w-28 h-32 bg-[#050505] border-r-[10px] border-stone-900 rounded-xl rotate-6 -z-10 shadow-2xl" />
//     </div>
//   </div>
// );

// მოდიფიკაციების პანელი იყოს გარაჟის გვერდზე, უნდა წამოვიღოთ მანქანის სურათი და სახელი ნუ carId ც და შესვლის შემდეგ უნდა მაჩვენოს მანქანის მოდიფიკაციები და მეპატრონე თუ ვარ შემეძლოს რედაქტირება დამატება და წაშლა

// ასევე უნდ იყოს სერვისებზეც ანალოგიურად მოდიფიკაციების გვერდით

// მარცხენა ქვედა პანელი იუზერები და მანქანები როა სქროლვადი უნდა იყოს დესკტოპიდანაც

// საიდბარში მკვდარ ზონაში უნდა გამოჩნდეს კონტენტი რასაც ავირჩევ ზედა ნავიგაციიდან, ჯგუფები ივენთები და მარკეტფეისი/ და კლუჩის მარჯვნივ

// მარჯვენა პანელშიც იგივე უნდა მოხდეს დეფაულტადდ მესიჯები იქნება და შეტყობინებები და იუზერის ინფორმაცია უნდა გახსნას მთლიან გვერდზე

// post ის ფორმა დავაპატარავე და მოსაგვარებელი კომპონენტების განლაგება

// რეგისტრაციის დროს უნდა შემეძლოს პირველი ავტომობილის რეგისტრაცია იუზერთან ერთად   ---
// მანქანის დამატების ფორმა გადმოვაკატაოთ და შემდეგ შევავსოთ იუზერის ინფორმაცია და მერე დავარეგისტრიროთ
// ----
// ვინც შევა google და apple ანგარიშით მაგას არ დასჭირდება ავტომობილის რეგისტრაცია მაგრამ თუ რეგისტრაციას დააჭერს იუზერი მაშინ უნდა მოხდეს ის რაც ზევით წერია

// და ასევე მანქანის სტიკერი უნდა შეიქმნას და ასევე მფლობელის სამომავლოდ
