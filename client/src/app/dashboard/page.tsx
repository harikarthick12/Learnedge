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
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
    );

    const avgMastery = performance?.progress?.length
        ? Math.round(performance.progress.reduce((acc: any, curr: any) => acc + curr.masteryLevel, 0) / performance.progress.length)
        : 0;

    const stats = [
        { label: "Overall Mastery", val: `${avgMastery}%`, color: "text-primary-600" },
        { label: "Topics Studied", val: materials.length, color: "text-blue-600" },
        { label: "Failed Concepts", val: mistakes.length, color: "text-red-500" },
    ];

    return (
        <main className="max-w-7xl mx-auto px-8 py-12 space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Welcome back, {user?.name || 'Student'}! ✨</h1>
                    <p className="text-slate-500 font-medium text-lg">You have {mistakes.length} concepts that need your attention today.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/upload" className="btn-student-primary !py-3 !px-8 text-sm shadow-lg">
                        Upload New 📄
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="card-premium flex flex-col items-center justify-center text-center !p-10 hover:scale-105 transition-transform cursor-default">
                        <span className={`text-5xl font-black ${stat.color} mb-2`}>{stat.val}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
                <section className="lg:col-span-2 space-y-10">
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">Mistakes to Crush 🛠️</h2>
                        </div>
                        <div className="space-y-6">
                            {mistakes.length === 0 ? (
                                <div className="p-12 bg-emerald-50 rounded-[2.5rem] border-2 border-emerald-100 text-center">
                                    <p className="text-emerald-600 font-black text-xl">Perfect Score! 🏆</p>
                                    <p className="text-emerald-500 font-bold">You don't have any mistakes to review globally. Keep it up!</p>
                                </div>
                            ) : (
                                mistakes.slice(0, 3).map((m) => (
                                    <div key={m.id} className="card-premium border-l-8 border-red-400 !bg-red-50/30">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-xs font-black text-red-500 uppercase tracking-widest">{m.question.material.title}</span>
                                            <span className="badge bg-red-100 text-red-600">Incorrect</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-4">Q: {m.question.questionText}</h3>
                                        <div className="bg-white p-6 rounded-2xl space-y-4 shadow-sm">
                                            <div>
                                                <p className="text-xs font-black text-slate-400 uppercase mb-1">Your Answer</p>
                                                <p className="text-slate-600 font-medium italic">"{m.studentAnswer}"</p>
                                            </div>
                                            <div className="pt-4 border-t border-slate-100">
                                                <p className="text-xs font-black text-primary-500 uppercase mb-2">Coach's Tip ✨</p>
                                                <p className="text-slate-800 font-bold leading-relaxed">{m.explanation}</p>
                                                {m.analogy && <p className="mt-3 text-slate-500 italic text-sm">💡 "{m.analogy}"</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">Your Shelf 📚</h2>
                            <Link href="/materials" className="text-primary-500 font-bold hover:underline">View All Library</Link>
                        </div>
                        <div className="grid gap-6">
                            {materials.length === 0 ? (
                                <div className="card-premium text-center py-20 bg-slate-50/50 border-dashed border-4 border-slate-200">
                                    <p className="text-slate-400 font-bold">Your library is currently empty. Start by uploading a study material!</p>
                                </div>
                            ) : (
                                materials.slice(0, 4).map((m) => (
                                    <div key={m.id} className="card-premium flex justify-between items-center group transition-all hover:bg-slate-50">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary-500 transition-colors">{m.title}</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase">{new Date(m.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <Link href={`/learn/${m.id}`} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold transition-all">Explore</Link>
                                            <Link href={`/quiz/${m.id}`} className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95">Quiz</Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                <aside className="space-y-8">
                    <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">Skill Tree 📈</h2>
                    <div className="card-premium space-y-8 !p-8 sticky top-8">
                        {performance?.progress?.length > 0 ? (
                            performance.progress.map((p: any) => (
                                <div key={p.id} className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-slate-700 truncate max-w-[150px]">{p.topic}</span>
                                        <span className="text-primary-500">{p.masteryLevel}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${p.masteryLevel >= 70 ? 'bg-emerald-500' : p.masteryLevel >= 40 ? 'bg-primary-500' : 'bg-red-400'}`}
                                            style={{ width: `${p.masteryLevel}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 font-bold text-center py-8">No progress data yet. Take your first quiz!</p>
                        )}

                        <div className="pt-6 border-t border-slate-100 italic font-medium text-slate-400 text-sm leading-loose">
                            "The more you sweat in practice, the less you bleed in exams."
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
