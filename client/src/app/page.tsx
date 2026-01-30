"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-mesh-light overflow-x-hidden pt-20">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-8 py-20 flex flex-col items-center text-center gap-12">
        <div className="space-y-6 max-w-4xl">
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="LearnEdge Logo" className="w-32 h-32 rounded-[2.5rem] shadow-2xl animate-float" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 font-bold text-sm border-2 border-primary-100">
            Study Smarter, Not Harder
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] tracking-tight italic">
            Learning <br />
            <span className="text-gradient">Made Easy.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Turn your notes into fun quizzes and simple lessons. Learn faster with an AI that talks like a friend.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
            <Link href="/signup" className="btn-student-primary text-xl px-12 py-5 hover:scale-105 active:scale-95 transition-all">
              Start Learning Free
            </Link>
            <Link href="/login" className="btn-student-secondary text-xl px-12 py-5 hover:scale-105 active:scale-95 transition-all outline outline-2 outline-slate-200">
              I already have an account
            </Link>
          </div>
        </div>

        {/* Floating Stat Grid */}
        <div className="relative w-full max-w-5xl mt-12 bg-white rounded-[3rem] p-4 shadow-2xl border-8 border-slate-50 overflow-hidden">
          <div className="bg-slate-50 rounded-[2rem] aspect-[16/9] flex items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-100/30 via-transparent to-transparent opacity-50"></div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl relative z-10">
              {[
                { label: "Quizzes", val: "98%", icon: "" },
                { label: "Mastery", val: "High", icon: "" },
                { label: "Focus", val: "2h/day", icon: "" },
                { label: "Help", val: "24/7", icon: "" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center gap-2 hover:scale-110 transition-transform cursor-pointer">
                  {stat.icon && <span className="text-4xl">{stat.icon}</span>}
                  <span className="font-black text-2xl text-slate-800">{stat.val}</span>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
