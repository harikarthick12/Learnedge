"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await authApi.login({ email, password });
            localStorage.setItem("token", res.data.access_token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Authentication signature rejected. Please verify your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
            <div className="mesh-bg" />

            {/* Background Glows */}
            <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

            <Link href="/" className="fixed top-12 left-12 flex items-center gap-4 group z-20">
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
                    <img src="/logo.png" alt="LearnEdge Logo" className="relative w-10 h-10 rounded-xl group-hover:rotate-12 transition-transform shadow-lg bg-white p-1" />
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-widest uppercase text-xs italic">Learn<span className="grad-text">Edge</span></span>
            </Link>

            <div className="glass-morphism w-full max-w-md space-y-12 p-12 md:p-16 rounded-[3.5rem] border-emerald-500/10 shadow-2xl relative z-10 bg-white/40">
                <div className="text-center space-y-4">
                    <div className="inline-block px-4 py-1 rounded-full glass-dark border-emerald-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
                        Login Portal
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight italic">Welcome <span className="grad-text">Back.</span></h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Access your learning interface.</p>
                </div>

                {error && (
                    <div className="glass-dark border-accent/20 text-accent p-5 rounded-2xl text-[10px] font-black tracking-widest uppercase text-center animate-shake">
                        System Alert: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Neural Identifier</label>
                        <input
                            type="email"
                            required
                            className="w-full glass-dark border border-emerald-500/10 rounded-[1.5rem] px-8 py-5 text-slate-900 placeholder-slate-400 focus:border-emerald-500/50 outline-none transition-all font-semibold italic"
                            placeholder=""
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Access Code</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full glass-dark border border-emerald-500/10 rounded-[1.5rem] px-8 py-5 text-slate-900 placeholder-slate-400 focus:border-emerald-500/50 outline-none transition-all font-semibold italic pr-12"
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium w-full !py-6 !rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] mt-8 group relative overflow-hidden"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
                        ) : (
                            <span className="flex items-center justify-center gap-4">
                                Initialize Uplink
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </span>
                        )}
                    </button>
                </form>

                <p className="text-center font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">
                    New Influx?{" "}
                    <Link href="/signup" className="text-emerald-800 hover:grad-text transition-all underline decoration-emerald-500/20 underline-offset-8">
                        Register Space
                    </Link>
                </p>
            </div>
        </main>
    );
}



