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
            setError(detailedMsg || "Something went wrong. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-8 py-20">
            <div className="card-premium space-y-10 !p-12 border-t-8 border-primary-500">
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Add your Notes!</h1>
                    <p className="text-slate-500 font-bold text-lg">Upload a file or paste text to turn them into simple lessons.</p>
                </div>

                {/* Mode Toggle */}
                <div className="flex bg-slate-100 p-2 rounded-2xl w-fit mx-auto gap-2">
                    <button
                        onClick={() => setMode("file")}
                        className={`px-6 py-2 rounded-xl font-bold transition-all ${mode === 'file' ? 'bg-white shadow-sm text-primary-500' : 'text-slate-400'}`}
                    >
                        File Upload
                    </button>
                    <button
                        onClick={() => setMode("text")}
                        className={`px-6 py-2 rounded-xl font-bold transition-all ${mode === 'text' ? 'bg-white shadow-sm text-primary-500' : 'text-slate-400'}`}
                    >
                        Paste Text
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-5 rounded-3xl text-sm font-bold border-2 border-red-100 animate-bounce-soft text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleUpload} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-sm font-black text-slate-700 uppercase tracking-wider px-2">Knowledge Title</label>
                        <input
                            type="text"
                            className="input-student"
                            placeholder="e.g. Bio Exam Chapter 4"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {mode === 'file' ? (
                        <div
                            className={`relative group border-4 border-dashed rounded-[3rem] p-16 text-center transition-all cursor-pointer ${file ? 'border-primary-400 bg-primary-50/30' : 'border-slate-100 hover:border-primary-300 hover:bg-slate-50'
                                }`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const dropped = e.dataTransfer.files[0];
                                if (dropped) setFile(dropped);
                            }}
                            onClick={() => document.getElementById('fileInput')?.click()}
                        >
                            <input
                                id="fileInput"
                                type="file"
                                className="hidden"
                                accept=".pdf,.docx,.txt"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            {file ? (
                                <div className="space-y-4">
                                    <div className="text-6xl animate-bounce-soft">File</div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-800">{file.name}</p>
                                        <p className="text-sm font-bold text-slate-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-red-500 font-bold hover:underline text-sm uppercase tracking-widest mt-4"
                                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                    >
                                        Change File
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="text-7xl group-hover:scale-110 transition-transform">File</div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-800">Drop your material</p>
                                        <p className="text-slate-400 font-bold mt-2">PDF, DOCX, or TXT (Max 10MB)</p>
                                    </div>
                                    <div className="inline-block bg-white px-6 py-2 rounded-full shadow-sm border-2 border-slate-100 font-bold text-slate-500">
                                        Browse Files
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-wider px-2">Paste Content</label>
                            <textarea
                                className="input-student min-h-[300px] !p-8 font-medium leading-relaxed"
                                placeholder="Paste your study material here..."
                                value={rawText}
                                onChange={(e) => setRawText(e.target.value)}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={((mode === 'file' ? !file : rawText.length < 20)) || loading}
                        className="btn-student-primary w-full py-5 text-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-2xl"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : "Transform into Knowledge"}
                    </button>
                </form>
            </div>
        </div>
    );
}
