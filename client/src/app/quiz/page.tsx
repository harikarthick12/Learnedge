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
            // If mistakes were made, maybe show a summary? 
            // For now, redirect to dashboard which now has the mistakes section
            router.push("/dashboard");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
    );

    const currentQ = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="max-w-5xl mx-auto px-8 py-12">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">{material?.title}</h1>
                    <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-xs">Question {currentIndex + 1} of {questions.length}</p>
                </div>
                <div className="w-full md:w-64 bg-slate-100 h-4 rounded-full overflow-hidden border-2 border-white shadow-inner">
                    <div
                        className="h-full bg-primary-500 transition-all duration-700 rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="card-premium min-h-[500px] flex flex-col !p-12 border-t-8 border-primary-500">
                {!evaluation ? (
                    <div className="space-y-10 flex-1">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className={`badge ${currentQ.difficulty === 'HARD' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {currentQ.difficulty}
                                </span>
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 leading-snug">{currentQ.questionText}</h2>
                        </div>

                        <div className="space-y-4">
                            {currentQ.type === 'MCQ' ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {JSON.parse(currentQ.options).map((opt: string, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => setAnswer(opt)}
                                            className={`text-left p-6 rounded-[1.5rem] border-2 transition-all font-bold text-lg flex items-center gap-4 ${answer === opt
                                                ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-lg'
                                                : 'border-slate-50 bg-slate-50/50 hover:bg-white text-slate-600'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${answer === opt ? 'bg-primary-500 text-white' : 'bg-white text-slate-300'}`}>
                                                {String.fromCharCode(65 + i)}
                                            </div>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <textarea
                                    className="input-student min-h-[250px] !p-8 text-xl font-medium leading-relaxed"
                                    placeholder="Explain your thoughts here..."
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                />
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!answer || submitting}
                            className="btn-student-primary w-full py-5 text-2xl mt-4 shadow-2xl"
                        >
                            {submitting ? "Checking..." : "Check my answer!"}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50 p-10 rounded-[3.5rem] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-8xl uppercase tracking-tighter pointer-events-none select-none">
                                {evaluation.isCorrect ? "Mastered" : "Learning"}
                            </div>

                            <div className="relative group">
                                <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-white shadow-2xl transition-transform group-hover:scale-110 ${evaluation.score >= 80 ? 'bg-emerald-500' : evaluation.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}>
                                    {evaluation.score}%
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg text-2xl">
                                    {evaluation.isCorrect ? "Correct" : "Try again"}
                                </div>
                            </div>

                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <h3 className="text-3xl font-black text-slate-800">
                                    {evaluation.score >= 80 ? "Great job!" : evaluation.score >= 50 ? "Not bad!" : "Keep trying!"}
                                </h3>
                                <p className="text-xl text-slate-500 font-bold italic leading-relaxed">
                                    "{evaluation.feedback}"
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="card-premium !bg-white space-y-4 !p-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">Info</div>
                                    <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Deep Explanation</h4>
                                </div>
                                <p className="text-lg leading-relaxed text-slate-600 font-medium">{evaluation.explanation}</p>
                            </div>

                            <div className="card-premium !bg-purple-50/50 border-purple-100 space-y-4 !p-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">Idea</div>
                                    <h4 className="font-black text-purple-800 uppercase tracking-widest text-xs">A Simple Story</h4>
                                </div>
                                <p className="text-lg leading-relaxed text-purple-900/70 font-bold italic">"{evaluation.analogy}"</p>
                            </div>

                            {evaluation.memoryTrick && (
                                <div className="card-premium !bg-amber-50/50 border-amber-100 space-y-4 !p-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">Tip</div>
                                        <h4 className="font-black text-amber-800 uppercase tracking-widest text-xs">Memory Trick</h4>
                                    </div>
                                    <p className="text-lg leading-relaxed text-amber-900/70 font-medium">{evaluation.memoryTrick}</p>
                                </div>
                            )}

                            {evaluation.realWorldExample && (
                                <div className="card-premium !bg-blue-50/50 border-blue-100 space-y-4 !p-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">Note</div>
                                        <h4 className="font-black text-blue-800 uppercase tracking-widest text-xs">Real World Case</h4>
                                    </div>
                                    <p className="text-lg leading-relaxed text-blue-900/70 font-medium">{evaluation.realWorldExample}</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={nextQuestion}
                            className="btn-student-primary w-full py-6 text-2xl shadow-2xl hover:translate-y-[-4px] active:translate-y-[2px] transition-all"
                        >
                            {currentIndex < questions.length - 1 ? "Carry On!" : "See Final Score"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function QuizPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-[80vh]">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
        }>
            <QuizContent />
        </Suspense>
    );
}
