"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { materialsApi } from "@/lib/api";
import Link from "next/link";
import { Suspense } from "react";

function LearnContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [material, setMaterial] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTopic, setActiveTopic] = useState<number | null>(null);

    useEffect(() => {
        if (!id) return;
        async function fetchMaterial() {
            try {
                const res = await materialsApi.getOne(id as string);
                setMaterial(res.data);
            } catch (err) {
                console.error("Failed to fetch material", err);
            } finally {
                setLoading(false);
            }
        }
        fetchMaterial();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
    );

    const rawAnalysis = material?.topicAnalysis ? (typeof material.topicAnalysis === 'string' ? JSON.parse(material.topicAnalysis) : material.topicAnalysis) : null;
    const topics = Array.isArray(rawAnalysis) ? rawAnalysis : (rawAnalysis?.topics || []);

    return (
        <main className="relative min-h-screen pt-32 pb-20 px-4 md:px-8 overflow-hidden">
            <div className="mesh-bg" />

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 relative z-10">
                {/* Sidebar */}
                <aside className="lg:w-[350px] space-y-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-emerald-600 transition-all group mb-4">
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                        Main Command
                    </Link>

                    <div className="glass-morphism p-8 rounded-[2.5rem] border-emerald-500/10 shadow-2xl space-y-8">
                        <div>
                            <div className="inline-block px-3 py-1 rounded-full glass-dark border-emerald-500/10 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-4">
                                Module Index
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">Knowledge Nodes</h3>
                        </div>

                        <nav className="space-y-3">
                            {topics.map((t: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTopic(i)}
                                    className={`w-full text-left px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${activeTopic === i
                                        ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/40 text-emerald-800 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                                        : 'bg-emerald-500/5 border-transparent text-slate-500 hover:bg-emerald-500/10 hover:text-emerald-700'
                                        }`}
                                >
                                    <span className="flex items-center justify-between">
                                        {t.topic}
                                        {activeTopic === i && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]"></div>}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <Link
                        href={`/quiz?id=${id}`}
                        className="btn-premium w-full !py-5 flex justify-center items-center gap-4 text-xs tracking-[0.3em] uppercase"
                    >
                        Initialize Simulation
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </Link>
                </aside>

                {/* Content Area */}
                <section className="flex-1 space-y-12">
                    <header className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-1.5 bg-emerald-500 rounded-full"></div>
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight italic tracking-tight">{material?.title}</h1>
                        </div>
                        <div className="flex flex-wrap gap-4 px-6">
                            <span className="px-4 py-1.5 glass-dark border-emerald-500/10 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                {topics.length} Data Points
                            </span>
                            <span className="px-4 py-1.5 glass-dark border-emerald-500/10 rounded-full text-[10px] font-black text-teal-600 uppercase tracking-widest">
                                Neural-Ready
                            </span>
                            <span className="px-4 py-1.5 glass-dark border-emerald-500/10 rounded-full text-[10px] font-black text-lime-600 uppercase tracking-widest">
                                Version 1.0.4-α
                            </span>
                        </div>
                    </header>

                    {activeTopic !== null ? (
                        <div className="glass-morphism min-h-[600px] p-12 md:p-16 rounded-[3.5rem] border-emerald-500/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full group-hover:bg-emerald-500/10 transition-colors" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Subject Matter Node</p>
                                        <h2 className="text-4xl md:text-5xl font-black text-emerald-900 tracking-widest uppercase italic">{topics[activeTopic].topic}</h2>
                                    </div>
                                    <div className={`px-5 py-2 glass-dark rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-colors ${topics[activeTopic].difficulty === 'HARD' ? 'border-accent/30 text-accent' : 'border-emerald-500/30 text-emerald-600'}`}>
                                        Intensity: {topics[activeTopic].difficulty}
                                    </div>
                                </div>
                                <div className="prose prose-2xl max-w-none">
                                    <p className="leading-relaxed text-slate-700 font-medium whitespace-pre-wrap text-xl md:text-2xl selection:bg-emerald-500/20">
                                        {topics[activeTopic].description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            <div className="glass-morphism p-16 rounded-[3.5rem] border-emerald-500/10 shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
                                <div className="relative z-10 space-y-6">
                                    <h2 className="text-4xl font-black text-emerald-900 italic tracking-tight">System Initialized.</h2>
                                    <p className="text-xl text-slate-600 font-bold leading-relaxed max-w-2xl">
                                        Select a knowledge node from the module index to begin neural synchronization.
                                        Our AI has refactored your source data into optimized learning primitives.
                                    </p>
                                </div>
                            </div>

                            <div className="glass-morphism p-12 md:p-16 rounded-[3.5rem] border-emerald-500/10 shadow-2xl">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="h-6 w-1.5 bg-slate-300 rounded-full"></div>
                                    <h2 className="text-2xl font-black text-slate-400 uppercase tracking-[0.3em] italic">Source Feed Transcript</h2>
                                </div>
                                <div className="glass-dark p-10 rounded-[2.5rem] max-h-[500px] overflow-y-auto font-medium text-slate-500 leading-loose whitespace-pre-wrap border border-emerald-500/10 shadow-inner text-sm md:text-base">
                                    {material?.content}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* Background Decorative Accents */}
            <div className="fixed top-[10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />
        </main>
    );
}

export default function LearnPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-[80vh]">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
        }>
            <LearnContent />
        </Suspense>
    );
}


