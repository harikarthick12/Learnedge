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
        <div className="flex justify-center items-center h-[60vh]">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <main className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-black italic">Your Vault 🏛️</h1>
                    <p className="text-slate-500 font-medium">Manage and review all your uploaded study materials.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {materials.map((m) => {
                    const raw = m.topicAnalysis ? JSON.parse(m.topicAnalysis) : null;
                    const topics = Array.isArray(raw) ? raw : (raw?.topics || []);
                    return (
                        <div key={m.id} className="card-premium flex flex-col h-full group">
                            <div className="flex-1 space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-black leading-tight group-hover:text-primary-500 transition-colors">{m.title}</h3>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(m.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {topics.slice(0, 3).map((t: any, i: number) => (
                                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg uppercase">
                                            {t.topic}
                                        </span>
                                    ))}
                                    {topics.length > 3 && <span className="text-[10px] text-slate-400 font-bold">+{topics.length - 3}</span>}
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-50 flex gap-3">
                                <Link href={`/learn?id=${m.id}`} className="flex-1 btn-student-secondary !py-2.5 text-center text-xs">Explore</Link>
                                <Link href={`/quiz?id=${m.id}`} className="flex-1 btn-student-primary !py-2.5 text-center text-xs">Quiz</Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
