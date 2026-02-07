"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden pt-20">
      {/* Background Layer */}
      <div className="mesh-bg" />

      {/* Decorative Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full pulse-soft" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full pulse-soft" />

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-8 py-20 flex flex-col items-center text-center">
        <div className="space-y-8 max-w-4xl">
          <div className="flex justify-center mb-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[2.5rem] blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <img
                src="/logo.png"
                alt="LearnEdge Logo"
                className="relative w-36 h-36 rounded-[2.5rem] shadow-2xl animate-float bg-white p-2"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-morphism text-emerald-800 font-semibold text-sm border-emerald-500/20 tracking-wide">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            AI-POWERED ADAPTIVE LEARNING
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight">
            Learn with <br />
            <span className="grad-text italic">Infinite Edge.</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            The intelligent tutor for students. <br className="hidden md:block" />
            Turn complex materials into interactive, adaptive experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/signup" className="btn-premium text-lg px-12 py-5 ring-1 ring-emerald-500/20">
              Get Started Free
            </Link>
            <Link href="/login" className="btn-glass text-lg px-12 py-5 bg-emerald-500/5 text-emerald-900 hover:bg-emerald-500/10 border-emerald-500/10">
              Student Login
            </Link>
          </div>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mt-32">
          {[
            { title: "Smart Analysis", desc: "Instant AI extraction from PDFs, Docs, and handwritten notes.", icon: "🧠" },
            { title: "Adaptive Quizzes", desc: "Quizzes that evolve based on your individual performance.", icon: "🎯" },
            { title: "Study Planner", desc: "AI-generated schedules tailored to your exam dates.", icon: "📅" }
          ].map((feature, i) => (
            <div key={i} className="glass-morphism p-8 rounded-3xl text-left border-emerald-500/10 group hover:border-emerald-500/40 transition-all duration-500 bg-white/40">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Floating Abstract Element */}
        <div className="mt-32 w-full max-w-5xl aspect-[21/9] glass-morphism rounded-[3rem] p-4 border-emerald-500/10 relative overflow-hidden group bg-white/30">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="w-full h-full rounded-[2.2rem] bg-emerald-50/50 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>
            </div>
            <div className="text-center z-10 px-6">
              <h4 className="text-3xl font-black text-slate-900 mb-4 italic tracking-tight">The future of education is here.</h4>
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm">Empowering 10,000+ Students Worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Garnish */}
      <footer className="relative py-20 text-center border-t border-emerald-500/10">
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">© 2026 LearnEdge AI • All Rights Reserved</p>
      </footer>
    </main>
  );
}


