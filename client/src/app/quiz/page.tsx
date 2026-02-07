"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { quizApi, materialsApi } from "@/lib/api";
import { Suspense } from "react";

function QuizContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [evaluation, setEvaluation] = useState<any>(null);
    const [material, setMaterial] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        async function initQuiz() {
            try {
                const matRes = await materialsApi.getOne(id as string);
                setMaterial(matRes.data);

                if (matRes.data.questions && matRes.data.questions.length > 0) {
                    setQuestions(matRes.data.questions);
                } else {
                    const genRes = await quizApi.generate(id as string);
                    setQuestions(genRes.data);
                }
            } catch (err) {
                console.error("Quiz init failed", err);
            } finally {
                setLoading(false);
            }
        }
        initQuiz();
    }, [id]);

    const [mistakesInSession, setMistakesInSession] = useState<any[]>([]);

    const handleSubmit = async () => {
        if (!answer) return;
        setSubmitting(true);
        try {
            const res = await quizApi.submit(questions[currentIndex].id, answer);
            const evalData = res.data;
            setEvaluation(evalData);
            if (!evalData.isCorrect) {
                setMistakesInSession(prev => [...prev, { ...evalData, question: questions[currentIndex] }]);
            }
        } catch (err) {
            console.error("Submit failed", err);
        } finally {
            setSubmitting(false);
        }
    };

    const nextQuestion = () => {
        setEvaluation(null);
        setAnswer("");
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            router.push("/dashboard");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
    );

    const currentQ = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <main className="relative min-h-screen pt-32 pb-20 px-4 md:px-8 overflow-hidden">
            <div className="mesh-bg" />

            <div className="max-w-5xl mx-auto relative z-10">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Active Simulation</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 italic tracking-tight">{material?.title}</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sequence {currentIndex + 1} // {questions.length}</p>
                    </div>
                    <div className="w-full md:w-80 space-y-3">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                            <span>Synchronization Progress</span>
                            <span className="text-emerald-600">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden border border-emerald-500/10 p-0.5">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </header>

                <div className="glass-morphism min-h-[600px] flex flex-col p-10 md:p-16 rounded-[3.5rem] border-emerald-500/10 shadow-2xl relative overflow-hidden">
                    {!evaluation ? (
                        <div className="space-y-12 flex-1 relative z-10">
                            <div className="space-y-6">
                                <span className={`px-4 py-1 glass-dark rounded-full text-[9px] font-black uppercase tracking-widest border ${currentQ.difficulty === 'HARD' ? 'border-accent/30 text-accent' : 'border-emerald-500/30 text-emerald-600'}`}>
                                    Threat Level: {currentQ.difficulty}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight italic tracking-tight">{currentQ.questionText}</h2>
                            </div>

                            <div className="space-y-5">
                                {currentQ.type === 'MCQ' ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {JSON.parse(currentQ.options).map((opt: string, i: number) => (
                                            <button
                                                key={i}
                                                onClick={() => setAnswer(opt)}
                                                className={`text-left p-6 rounded-[2rem] border transition-all duration-500 flex items-center gap-6 group relative overflow-hidden ${answer === opt
                                                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-900 shadow-[0_0_30px_rgba(16,185,129,0.1)]'
                                                    : 'border-emerald-500/5 bg-white/5 text-slate-600 hover:bg-emerald-500/10 hover:border-emerald-500/20'
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500 ${answer === opt ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50' : 'bg-emerald-500/5 text-slate-400 group-hover:text-emerald-600'}`}>
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                                <span className="text-lg font-bold group-hover:translate-x-1 transition-transform">{opt}</span>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <textarea
                                        className="w-full glass-dark border border-emerald-500/10 rounded-[2.5rem] px-10 py-10 text-xl text-slate-800 placeholder-slate-300 focus:border-emerald-500/50 outline-none transition-all font-medium leading-relaxed min-h-[300px]"
                                        placeholder="Formulate your response..."
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                    />
                                )}
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!answer || submitting}
                                className="btn-premium w-full !py-6 !rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] mt-8 group relative overflow-hidden disabled:opacity-20"
                            >
                                {submitting ? (
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        <span>Analyzing response...</span>
                                    </div>
                                ) : (
                                    <span className="flex items-center justify-center gap-4">
                                        Transmit Data
                                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </span>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-12 relative z-10">
                            <div className="flex flex-col md:flex-row items-center gap-12 glass-dark p-12 rounded-[4rem] border-emerald-500/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-5 font-black text-9xl uppercase tracking-tighter pointer-events-none select-none italic text-emerald-900">
                                    {evaluation.isCorrect ? "Sync" : "Fail"}
                                </div>

                                <div className="relative shrink-0 group">
                                    <div className={`w-40 h-40 rounded-[3rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl transition-all duration-700 group-hover:scale-110 ${evaluation.score >= 80 ? 'bg-emerald-500 shadow-emerald-500/20' : evaluation.score >= 50 ? 'bg-teal-500 shadow-teal-500/20' : 'bg-accent shadow-accent/20'}`}>
                                        {evaluation.score}%
                                    </div>
                                    <div className={`absolute -bottom-3 -right-3 w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl border-4 border-white text-2xl ${evaluation.isCorrect ? 'bg-emerald-400' : 'bg-accent'}`}>
                                        {evaluation.isCorrect ? '✓' : '×'}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4 text-center md:text-left">
                                    <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/5 border-emerald-500/5 text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600">
                                        Analysis Result
                                    </div>
                                    <h3 className="text-4xl font-black text-slate-900 italic tracking-tight">
                                        {evaluation.score >= 80 ? "Mastery Achieved" : evaluation.score >= 50 ? "Data Acquired" : "Signal Loss Detected"}
                                    </h3>
                                    <p className="text-xl text-slate-600 font-bold leading-relaxed max-w-xl italic">
                                        "{evaluation.feedback}"
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="glass-dark border border-emerald-500/10 p-10 rounded-[3rem] space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Neural Insight</h4>
                                    </div>
                                    <p className="text-lg leading-relaxed text-slate-700 font-medium selection:bg-emerald-500/20">{evaluation.explanation}</p>
                                </div>

                                <div className="glass-dark border border-teal-500/20 p-10 rounded-[3rem] space-y-6 bg-teal-500/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-8 bg-teal-500 rounded-full"></div>
                                        <h4 className="text-[10px] font-black text-teal-600/70 uppercase tracking-[0.3em]">Logical Analogy</h4>
                                    </div>
                                    <p className="text-xl leading-relaxed text-teal-900/70 font-bold italic selection:bg-teal-500/20">"{evaluation.analogy}"</p>
                                </div>

                                {evaluation.memoryTrick && (
                                    <div className="glass-dark border border-lime-500/20 p-10 rounded-[3rem] space-y-6 bg-lime-500/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-8 bg-lime-500 rounded-full"></div>
                                            <h4 className="text-[10px] font-black text-lime-600/70 uppercase tracking-[0.3em]">Pattern Lock</h4>
                                        </div>
                                        <p className="text-lg leading-relaxed text-lime-800/70 font-medium">{evaluation.memoryTrick}</p>
                                    </div>
                                )}

                                {evaluation.realWorldExample && (
                                    <div className="glass-dark border border-emerald-500/20 p-10 rounded-[3rem] space-y-6 bg-emerald-500/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                                            <h4 className="text-[10px] font-black text-emerald-600/70 uppercase tracking-[0.3em]">Real-Time Case</h4>
                                        </div>
                                        <p className="text-lg leading-relaxed text-emerald-800/70 font-medium">{evaluation.realWorldExample}</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={nextQuestion}
                                className="btn-premium w-full !py-6 !rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl hover:translate-y-[-4px] active:translate-y-[2px] transition-all"
                            >
                                <span className="flex items-center justify-center gap-4">
                                    {currentIndex < questions.length - 1 ? "Next Sequence" : "Finalize Simulation"}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Background Decorative Accents */}
            <div className="fixed top-[15%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[15%] right-[-5%] w-[600px] h-[600px] bg-teal-500/5 blur-[150px] rounded-full pointer-events-none" />
        </main>
    );
}

export default function QuizPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-[80vh]">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
        }>
            <QuizContent />
        </Suspense>
    );
}


