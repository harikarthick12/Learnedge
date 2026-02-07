"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { materialsApi, quizApi } from "@/lib/api";

export default function Dashboard() {
    const [materials, setMaterials] = useState<any[]>([]);
    const [performance, setPerformance] = useState<any>(null);
    const [mistakes, setMistakes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        async function fetchData() {
            try {
                const [mRes, pRes, mistRes] = await Promise.all([
                    materialsApi.getAll(),
                    quizApi.getPerformance(),
                    quizApi.getMistakes(),
                ]);
                setMaterials(mRes.data);
                setPerformance(pRes.data);
                setMistakes(mistRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
    );

    const avgMastery = performance?.progress?.length
        ? Math.round(performance.progress.reduce((acc: any, curr: any) => acc + curr.masteryLevel, 0) / performance.progress.length)
        : 0;

    const stats = [
        { label: "Overall Mastery", val: `${avgMastery}%`, color: "grad-text" },
        { label: "Total Knowledge", val: materials.length, color: "text-slate-900" },
        { label: "Focus Areas", val: mistakes.length, color: "text-accent" },
    ];

    return (
        <main className="relative min-h-screen pt-28 pb-20 px-4 md:px-8">
            <div className="mesh-bg" />

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight italic">
                            Welcome, <span className="grad-text">{user?.name || 'Scholar'}</span>.
                        </h1>
                        <p className="text-slate-500 font-bold text-lg uppercase tracking-widest text-sm">
                            System analysis: You have <span className="text-emerald-700">{mistakes.length} insights</span> to review today.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/upload" className="btn-premium !py-3 !px-10 text-sm shadow-emerald-500/30 group">
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                                Add Intelligence
                            </span>
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="glass-morphism flex flex-col items-center justify-center text-center p-10 hover:scale-[1.02] transition-all cursor-default border-emerald-500/10 group hover:border-emerald-500/20 bg-white/40">
                            <span className={`text-6xl font-black ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>{stat.val}</span>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{stat.label}</span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
                    <section className="lg:col-span-2 space-y-12">
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-8 w-1.5 bg-accent rounded-full"></div>
                                <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">Active Corrections</h2>
                            </div>

                            <div className="space-y-6">
                                {mistakes.length === 0 ? (
                                    <div className="p-16 glass-morphism border-emerald-500/20 text-center rounded-[3rem] relative overflow-hidden group bg-white/40">
                                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative z-10">
                                            <p className="text-emerald-600 font-black text-3xl mb-2 italic">Neural Synchronization Complete</p>
                                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No errors detected in current memory pool.</p>
                                        </div>
                                    </div>
                                ) : (
                                    mistakes.slice(0, 3).map((m) => (
                                        <div key={m.id} className="glass-morphism border-l-4 border-accent p-8 rounded-[2rem] hover:bg-white/40 transition-colors relative overflow-hidden bg-white/20">
                                            <div className="flex justify-between items-start mb-6">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.question.material.title}</span>
                                                <span className="px-3 py-1 glass-dark rounded-full text-[10px] font-black text-accent uppercase border border-accent/20 tracking-tighter">Critical Insight</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-6 leading-tight">Q: {m.question.questionText}</h3>
                                            <div className="bg-emerald-500/5 p-6 rounded-2xl space-y-4 border border-emerald-500/10 shadow-inner">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Previous Entry</p>
                                                    <p className="text-slate-600 font-medium italic">"{m.studentAnswer}"</p>
                                                </div>
                                                <div className="pt-6 border-t border-emerald-500/10">
                                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">Tutor Refinement</p>
                                                    <p className="text-slate-800 font-bold leading-relaxed">{m.explanation}</p>
                                                    {m.analogy && <p className="mt-4 text-emerald-700/60 italic text-sm border-l-2 border-emerald-200 pl-4">{m.analogy}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="h-8 w-1.5 bg-emerald-500 rounded-full"></div>
                                    <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">Data Repository</h2>
                                </div>
                                <Link href="/materials" className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors">Access All Core</Link>
                            </div>

                            <div className="grid gap-6">
                                {materials.length === 0 ? (
                                    <div className="glass-morphism text-center py-24 rounded-[3rem] border-dashed border-2 border-emerald-500/10 bg-white/20">
                                        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Repository Empty. Upload materials to initialize system.</p>
                                    </div>
                                ) : (
                                    materials.slice(0, 4).map((m) => (
                                        <div key={m.id} className="glass-morphism flex justify-between items-center px-10 py-8 rounded-3xl group transition-all hover:bg-white/40 border-emerald-500/5 bg-white/20">
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-black text-slate-700 group-hover:text-slate-900 transition-colors italic">{m.title}</h3>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Date: {new Date(m.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <Link href={`/learn?id=${m.id}`} className="px-6 py-3 glass-dark hover:bg-white/60 rounded-2xl text-[10px] font-black text-emerald-800 uppercase tracking-widest transition-all">Review</Link>
                                                <Link href={`/quiz?id=${m.id}`} className="btn-premium !py-3 !px-8 !rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Simulate</Link>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-12">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-8 w-1.5 bg-teal-500 rounded-full"></div>
                            <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">Skill Matrix</h2>
                        </div>

                        <div className="glass-morphism p-10 rounded-[3rem] space-y-10 border-emerald-500/10 sticky top-32 bg-white/40">
                            {performance?.progress?.length > 0 ? (
                                performance.progress.map((p: any) => (
                                    <div key={p.id} className="space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-slate-500 truncate max-w-[150px]">{p.topic}</span>
                                            <span className="text-emerald-800 bg-emerald-500/5 px-3 py-1 rounded-lg">{p.masteryLevel}%</span>
                                        </div>
                                        <div className="w-full bg-emerald-100 h-2.5 rounded-full overflow-hidden border border-emerald-500/5">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 relative ${p.masteryLevel >= 70 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : p.masteryLevel >= 40 ? 'bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]' : 'bg-accent shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`}
                                                style={{ width: `${p.masteryLevel}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 font-bold text-center py-12 text-sm italic">Synchronizing neural data... Start a simulation to begin mapping.</p>
                            )}

                            <div className="pt-10 border-t border-emerald-500/10 text-center">
                                <p className="text-slate-400 font-bold italic text-sm leading-relaxed px-4">"The limit of your edge is the limit of your learning."</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}



