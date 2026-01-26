"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { quizApi, materialsApi } from "@/lib/api";

export default function QuizPage() {
    const { id } = useParams();
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [evaluation, setEvaluation] = useState<any>(null);
    const [material, setMaterial] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
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

    const handleSubmit = async () => {
        if (!answer) return;
        setSubmitting(true);
        try {
            const res = await quizApi.submit(questions[currentIndex].id, answer);
            setEvaluation(res.data);
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
                            {submitting ? "Analyzing..." : "Check Answer 🚀"}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className="flex items-center gap-8 bg-slate-50 p-8 rounded-[2rem]">
                            <div className={`w-28 h-28 rounded-3xl flex items-center justify-center text-4xl font-black text-white ${evaluation.score >= 80 ? 'bg-emerald-500' : evaluation.score >= 50 ? 'bg-warm-500' : 'bg-red-500'}`}>
                                {evaluation.score}
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-800">Score: {evaluation.score}%</h3>
                                <p className="text-xl text-slate-500 font-bold mt-2">"{evaluation.feedback}"</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="badge bg-primary-100 text-primary-600">Explanation</h4>
                                <p className="text-lg leading-relaxed text-slate-700 font-medium">{evaluation.explanation}</p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="badge bg-purple-100 text-purple-600">Analogy</h4>
                                <div className="p-6 bg-purple-50 rounded-3xl italic text-slate-600">
                                    "{evaluation.analogy}"
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={nextQuestion}
                            className="btn-student-primary w-full py-5 text-2xl shadow-xl"
                        >
                            {currentIndex < questions.length - 1 ? "Next Question ➡️" : "Return Winner 🏆"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
