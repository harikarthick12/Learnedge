"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        // Check login status
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        router.push("/");
    };

    const isAuthPage = pathname === "/login" || pathname === "/signup";
    if (isAuthPage) return null;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex justify-center ${isScrolled ? 'p-3' : 'p-6'}`}>
            <div className={`w-full max-w-7xl px-6 py-4 rounded-[2rem] flex justify-between items-center transition-all bg-white/90 backdrop-blur-md border border-slate-100 ${isScrolled ? 'shadow-lg py-3 rounded-2xl' : ''}`}>
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white text-xl font-black group-hover:rotate-12 transition-transform shadow-lg">L</div>
                    <span className="text-2xl font-black text-slate-800 tracking-tight">LearnEdge</span>
                </Link>

                <div className="hidden md:flex gap-10 items-center font-bold text-slate-600 uppercase text-sm tracking-widest">
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard" className="hover:text-primary-500 transition-colors">Dashboard</Link>
                            <Link href="/materials" className="hover:text-primary-500 transition-colors">Library</Link>
                            <button onClick={handleLogout} className="hover:text-red-500 transition-colors font-black">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-primary-500 transition-colors">Login</Link>
                            <Link href="/signup" className="hover:text-primary-500 transition-colors">Join Club</Link>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <Link href={isLoggedIn ? "/upload" : "/signup"} className="btn-student-primary !py-2.5 !px-6 text-sm flex items-center gap-2 shadow-md">
                        <span>{isLoggedIn ? "New Project" : "Start Learning"}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
