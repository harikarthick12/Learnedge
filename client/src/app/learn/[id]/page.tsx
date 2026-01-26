"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { materialsApi } from "@/lib/api";
import Link from "next/link";

export default function LearnPage() {
    const { id } = useParams();
    const [material, setMaterial] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTopic, setActiveTopic] = useState<number | null>(null);

    useEffect(() => {
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
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
    );

    const topics = material?.topicAnalysis ? JSON.parse(material.topicAnalysis) : [];

    return (
        <main className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar */}
                <aside className="lg:w-96 space-y-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 font-black text-primary-500 hover:gap-3 transition-all mb-4">
                        ← Dashboard
                    </Link>
                    <div className="card-premium !p-6 border-t-8 border-primary-500">
                        <h3 className="text-xl font-black mb-6 px-2 text-slate-800 uppercase tracking-tighter">Concepts Brain 🧠</h3>
                        <nav className="space-y-2">
                            {topics.map((t: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTopic(i)}
                                    className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all border-2 ${activeTopic === i
                                        ? 'bg-primary-500 text-white border-primary-500 shadow-lg'
                                        : 'bg-white border-slate-50 text-slate-500 hover:border-slate-100 hover:text-slate-800'
                                        }`}
                                >
                                    {t.topic}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <Link
                        href={`/quiz/${id}`}
                        className="btn-student-primary w-full py-5 flex justify-center items-center gap-3 shadow-2xl text-xl"
                    >
                        🔥 Start Quiz
                    </Link>
                </aside>

                {/* Content Area */}
                <section className="flex-1 space-y-12">
                    <header className="space-y-4">
                        <h1 className="text-5xl font-black text-slate-900 leading-tight italic">{material?.title}</h1>
                        <div className="flex gap-4">
                            <span className="badge bg-primary-100 text-primary-600">
                                {topics.length} Concepts
                            </span>
                            <span className="badge bg-emerald-100 text-emerald-600">
                                AI Ready ✨
                            </span>
                        </div>
                    </header>

                    {activeTopic !== null ? (
                        <div className="card-premium min-h-[500px] !p-12 border-t-8 border-primary-500">
                            <div className="flex justify-between items-start mb-8">
                                <h2 className="text-4xl font-black text-slate-900 leading-tight">{topics[activeTopic].topic}</h2>
                                <span className={`badge ${topics[activeTopic].difficulty === 'HARD' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {topics[activeTopic].difficulty}
                                </span>
                            </div>
                            <div className="prose prose-xl prose-slate max-w-none">
                                <p className="leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">
                                    {topics[activeTopic].description}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            <div className="bg-primary-500 p-12 rounded-[3.5rem] text-white shadow-2xl">
                                <h2 className="text-3xl font-black mb-4">Start your Journey!</h2>
                                <p className="text-xl text-primary-50 font-medium leading-relaxed opacity-90">
                                    Select a concept from the sidebar to start learning. We've broken down your material into key topics for better retention.
                                </p>
                            </div>

                            <div className="card-premium !p-12">
                                <h2 className="text-2xl font-black mb-8 text-slate-800 uppercase tracking-tighter underline">Transcript</h2>
                                <div className="bg-slate-50/50 p-8 rounded-[2rem] max-h-[600px] overflow-y-auto font-medium text-slate-500 leading-loose whitespace-pre-wrap border border-slate-50 shadow-inner">
                                    {material?.content}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
