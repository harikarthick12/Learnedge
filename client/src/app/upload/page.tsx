"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api, { materialsApi } from "@/lib/api";

export default function UploadPage() {
    const [mode, setMode] = useState<"file" | "text">("file");
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [rawText, setRawText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        const hasContent = mode === 'file' ? !!file : rawText.length > 20;
        if (!hasContent) return;

        setLoading(true);
        setError("");
        try {
            let res;
            if (mode === "file") {
                const formData = new FormData();
                formData.append("file", file!);
                formData.append("title", title);
                res = await materialsApi.upload(formData);
            } else {
                res = await api.post("/materials/raw", { title: title || "Pasted Notes", content: rawText });
            }
            router.push(`/learn?id=${res.data.id}`);
        } catch (err: any) {
            console.error("Upload debugging:", err);
            const serverMsg = err.response?.data?.message;
            const detailedMsg = Array.isArray(serverMsg) ? serverMsg.join(", ") : serverMsg;
            setError(detailedMsg || "Something went wrong. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen pt-32 pb-20 px-4 md:px-8 overflow-hidden">
            <div className="mesh-bg" />

            {/* Background Accents */}
            <div className="fixed top-20 right-[-10%] w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pulse-soft" />
            <div className="fixed bottom-0 left-[-10%] w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full pulse-soft" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="glass-morphism space-y-12 p-10 md:p-16 rounded-[3.5rem] border-emerald-500/10 shadow-2xl bg-white/40">
                    <div className="text-center space-y-4">
                        <div className="inline-block px-4 py-1.5 rounded-full glass-dark border-emerald-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">
                            Initialize Knowledge Base
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight italic">
                            Import <span className="grad-text">Intelligence.</span>
                        </h1>
                        <p className="text-slate-600 font-medium text-lg max-w-lg mx-auto leading-relaxed">
                            Upload your study materials or paste raw data to begin neuro-adaptive analysis.
                        </p>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex glass-dark p-2 rounded-2xl w-fit mx-auto gap-2 border border-emerald-500/5 bg-emerald-500/5">
                        <button
                            onClick={() => setMode("file")}
                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'file' ? 'bg-white text-emerald-900 shadow-lg' : 'text-slate-500 hover:text-emerald-700'}`}
                        >
                            File Ingest
                        </button>
                        <button
                            onClick={() => setMode("text")}
                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'text' ? 'bg-white text-emerald-900 shadow-lg' : 'text-slate-500 hover:text-emerald-700'}`}
                        >
                            Direct Link
                        </button>
                    </div>

                    {error && (
                        <div className="glass-dark border-accent/20 text-accent p-6 rounded-3xl text-xs font-black tracking-widest uppercase text-center animate-shake">
                            System Alert: {error}
                        </div>
                    )}

                    <form onSubmit={handleUpload} className="space-y-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4">Workspace Title</label>
                            <input
                                type="text"
                                className="w-full glass-dark border border-emerald-500/10 rounded-[1.5rem] px-8 py-5 text-slate-900 placeholder-slate-400 focus:border-emerald-500/50 outline-none transition-all font-semibold italic"
                                placeholder="e.g. Bio-Dynamic Simulation IV"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {mode === 'file' ? (
                            <div
                                className={`relative group border-2 border-dashed rounded-[3rem] p-4 text-center transition-all cursor-pointer ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-emerald-500/10 hover:border-emerald-500/30 hover:bg-emerald-500/5'
                                    }`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const dropped = e.dataTransfer.files[0];
                                    if (dropped) setFile(dropped);
                                }}
                                onClick={() => document.getElementById('fileInput')?.click()}
                            >
                                <input id="fileInput" type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} />

                                <div className="border border-emerald-500/5 rounded-[2.5rem] p-16 space-y-6">
                                    {file ? (
                                        <div className="space-y-6">
                                            <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-transform group-hover:scale-110">
                                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-black text-slate-900 italic">{file.name}</p>
                                                <p className="text-[10px] font-black text-slate-500 mt-2 uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB • SECURE LINK ESTABLISHED</p>
                                            </div>
                                            <button
                                                type="button"
                                                className="text-accent text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-80 transition-opacity"
                                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                            >
                                                TERMINATE CONNECTION
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            <div className="w-24 h-24 bg-emerald-500/5 rounded-[2.5rem] flex items-center justify-center mx-auto border border-emerald-500/10 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                                                <svg className="w-12 h-12 text-emerald-600 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-black text-slate-800 italic">Drop Knowledge Unit</p>
                                                <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Neural-compatible formats: PDF, DOCX, TXT</p>
                                            </div>
                                            <div className="inline-block glass-dark px-10 py-3 rounded-full border border-emerald-500/10 text-[10px] font-black text-emerald-700 uppercase tracking-[0.3em] group-hover:bg-emerald-500/10 transition-colors bg-emerald-500/5">
                                                Browse Data
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4">Manual Ingest Port</label>
                                <textarea
                                    className="w-full glass-dark border border-emerald-500/10 rounded-[2rem] px-8 py-8 text-slate-900 placeholder-slate-400 focus:border-emerald-500/50 outline-none transition-all font-medium leading-relaxed min-h-[400px] italic"
                                    placeholder="Paste raw data stream here..."
                                    value={rawText}
                                    onChange={(e) => setRawText(e.target.value)}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={((mode === 'file' ? !file : rawText.length < 20)) || loading}
                            className="btn-premium w-full !py-6 !rounded-[2rem] text-sm uppercase tracking-[0.4em] mt-8 disabled:opacity-20 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-4">
                                    <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span className="animate-pulse">Analyzing Neural Path...</span>
                                </div>
                            ) : (
                                <span className="flex items-center justify-center gap-4">
                                    Finalize Synthesis
                                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </span>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-emerald-500/10 rounded-full" />
        </main>
    );
}

