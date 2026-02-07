"use client";
import { useEffect, useState } from "react";
import { materialsApi } from "@/lib/api";
import Link from "next/link";

export default function MaterialsPage() {
    const [materials, setMaterials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMaterials() {
            try {
                const res = await materialsApi.getAll();
                setMaterials(res.data);
            } catch (err) {
                console.error("Failed to fetch materials", err);
            } finally {
                setLoading(false);
            }
        }
        fetchMaterials();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <main className="relative min-h-screen pt-32 pb-20 px-4 md:px-8 overflow-hidden">
            <div className="mesh-bg" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-16">
                <header className="space-y-4">
                    <div className="inline-block px-4 py-1 rounded-full glass-dark border-emerald-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
                        Neural Repository
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="space-y-2">
                            <h1 className="text-5xl font-black text-slate-900 tracking-tight italic">Your <span className="grad-text">Vault.</span></h1>
                            <p className="text-slate-500 font-bold text-lg max-w-lg leading-relaxed uppercase tracking-tighter text-sm">
                                Management interface for all active knowledge units and analyzed data.
                            </p>
                        </div>
                        <Link href="/upload" className="btn-premium !py-3 !px-10 text-xs shadow-emerald-500/20">
                            Expand Library
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {materials.length === 0 ? (
                        <div className="col-span-full border-2 border-dashed border-emerald-500/10 rounded-[3rem] py-32 text-center glass-morphism bg-white/20">
                            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Repository empty. No active data streams detected.</p>
                        </div>
                    ) : (
                        materials.map((m) => {
                            const raw = m.topicAnalysis ? (typeof m.topicAnalysis === 'string' ? JSON.parse(m.topicAnalysis) : m.topicAnalysis) : null;
                            const topics = Array.isArray(raw) ? raw : (raw?.topics || []);

                            return (
                                <div key={m.id} className="glass-morphism flex flex-col h-full group p-8 rounded-[2.5rem] border-emerald-500/5 hover:border-emerald-500/20 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl bg-white/40">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className="text-2xl font-black text-slate-800 italic leading-[1.2] group-hover:text-emerald-700 transition-colors uppercase tracking-tighter">{m.title}</h3>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-emerald-500/5 px-3 py-1 rounded-lg shrink-0">
                                                {new Date(m.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {topics.length > 0 ? (
                                                topics.slice(0, 3).map((t: any, i: number) => (
                                                    <span key={i} className="px-3 py-1.5 glass-dark border-emerald-500/5 text-slate-600 text-[10px] font-black rounded-xl uppercase tracking-widest bg-emerald-500/5">
                                                        {t.topic}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Analysis...</span>
                                            )}
                                            {topics.length > 3 && (
                                                <span className="px-3 py-1.5 glass-dark border-emerald-500/5 text-slate-500 text-[10px] font-black rounded-xl italic">+{topics.length - 3}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-emerald-500/10 flex gap-4">
                                        <Link href={`/learn?id=${m.id}`} className="flex-1 glass-dark hover:bg-emerald-500/10 py-3 rounded-2xl text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em] text-center transition-all bg-emerald-500/5 border border-emerald-500/10">Explore</Link>
                                        <Link href={`/quiz?id=${m.id}`} className="flex-1 btn-premium !py-3 !rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center transition-all">Simulate</Link>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Background Accents */}
            <div className="fixed top-[20%] left-[-10%] w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />
        </main>
    );
}



