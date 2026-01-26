"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { materialsApi, quizApi } from "@/lib/api";

export default function Dashboard() {
    const [materials, setMaterials] = useState<any[]>([]);
    const [performance, setPerformance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        async function fetchData() {
            try {
                const [mRes, pRes] = await Promise.all([
                    materialsApi.getAll(),
                    quizApi.getPerformance(),
                ]);
                setMaterials(mRes.data);
                setPerformance(pRes.data);
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
        { label: "Total Quizzes", val: performance?.progress?.length || 0, color: "text-emerald-600" },
    ];

    return (
        <main className="max-w-7xl mx-auto px-8 py-12 space-y-12">
            <header className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Welcome back, {user?.name || 'Student'}! ✨</h1>
                    <p className="text-slate-500 font-medium">Ready to crush your goals today?</p>
                </div>
                <Link href="/upload" className="btn-student-primary !py-3 !px-8 text-sm">
                    Upload New
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="card-premium flex flex-col items-center justify-center text-center !p-10">
                        <span className={`text-4xl font-black ${stat.color} mb-2`}>{stat.val}</span>
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
                <section className="lg:col-span-2 space-y-8">
                    <div className="flex justify-between items-center">
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
                                <div key={m.id} className="card-premium flex justify-between items-center group">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary-500 transition-colors">{m.title}</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase">{new Date(m.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <Link href={`/learn/${m.id}`} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold transition-all">Explore</Link>
                                        <Link href={`/quiz/${m.id}`} className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all">Quiz</Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <aside className="space-y-8">
                    <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">Skill Tree 📈</h2>
                    <div className="card-premium space-y-8 !p-8">
                        {performance?.progress?.length > 0 ? (
                            performance.progress.map((p: any) => (
                                <div key={p.id} className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-slate-700 truncate max-w-[200px]">{p.topic}</span>
                                        <span className="text-primary-500">{p.masteryLevel}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${p.masteryLevel}%` }}></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 font-bold text-center">No progress data yet. Take your first quiz!</p>
                        )}

                        <div className="pt-6 border-t border-slate-100 italic font-medium text-slate-400 text-sm">
                            "The more you sweat in practice, the less you bleed in exams."
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
