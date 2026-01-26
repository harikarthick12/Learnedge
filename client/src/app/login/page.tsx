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
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-mesh-light flex items-center justify-center p-6">
            <Link href="/" className="fixed top-8 left-8 flex items-center gap-2 group">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white text-sm font-black group-hover:rotate-12 transition-transform shadow-lg">L</div>
                <span className="text-xl font-black text-slate-800 tracking-tight">LearnEdge</span>
            </Link>

            <div className="card-premium w-full max-w-md space-y-10 !p-12">
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome Back!</h2>
                    <p className="text-slate-500 font-bold">Log in to keep crushing your goals.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border-2 border-red-100 animate-bounce-soft">
                        🚫 {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-black text-slate-700 uppercase tracking-wider px-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="input-student"
                            placeholder="you@school.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-black text-slate-700 uppercase tracking-wider px-1">Password</label>
                        <input
                            type="password"
                            required
                            className="input-student"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-student-primary w-full py-4 text-xl mt-4 flex justify-center items-center gap-3 transition-all"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : "Let's Go! 🚀"}
                    </button>
                </form>

                <p className="text-center font-bold text-slate-500">
                    New here?{" "}
                    <Link href="/signup" className="text-primary-600 font-black hover:underline underline-offset-4">
                        Create an Account
                    </Link>
                </p>
            </div>
        </div>
    );
}
