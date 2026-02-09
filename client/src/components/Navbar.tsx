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
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center ${isScrolled ? 'p-4' : 'p-8'}`}>
            <div className={`w-full max-w-7xl px-8 py-4 rounded-[2.5rem] flex justify-between items-center transition-all glass-morphism border-emerald-500/10 ${isScrolled ? 'shadow-2xl py-3 rounded-[2rem] border-emerald-500/20 bg-white/80' : 'bg-white/40'}`}>
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                        <img src="/logo.png" alt="LearnEdge Logo" className="relative w-10 h-10 rounded-xl group-hover:rotate-12 transition-transform shadow-lg bg-white p-1" />
                    </div>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter italic">Learn<span className="grad-text">Edge</span></span>
                </Link>

                <div className="hidden md:flex gap-10 items-center font-bold text-slate-500 uppercase text-[10px] tracking-[0.2em]">
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard" className="hover:text-emerald-700 transition-colors">Dashboard</Link>
                            <Link href="/materials" className="hover:text-emerald-700 transition-colors">Library</Link>
                            <button onClick={handleLogout} className="text-accent hover:opacity-80 transition-opacity font-black">Sign Out</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-emerald-700 transition-colors">Login</Link>
                            <Link href="/signup" className="hover:text-emerald-700 transition-colors">Sign Up</Link>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <Link href={isLoggedIn ? "/upload" : "/signup"} className="btn-premium !py-2.5 !px-6 !rounded-2xl text-xs flex items-center gap-2 shadow-emerald-500/20">
                        <span>{isLoggedIn ? "Upload" : "Get Started"}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </Link>
                </div>
            </div>
        </nav>
    );
}


