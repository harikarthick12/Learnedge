"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        const checkUser = () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) setUser(JSON.parse(storedUser));
        };

        checkUser();
        window.addEventListener('storage', checkUser);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener('storage', checkUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
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
                    <Link href="/dashboard" className="hover:text-primary-500 transition-colors">Dashboard</Link>
                    <Link href="/materials" className="hover:text-primary-500 transition-colors">Library</Link>
                    <Link href="/upload" className="hover:text-primary-500 transition-colors">Upload</Link>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-700 hidden sm:block truncate max-w-[120px]">{user.name || user.email.split('@')[0]}</span>
                            <button
                                onClick={handleLogout}
                                className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <Link href="/login" className="hidden sm:block px-6 py-2.5 font-bold text-slate-600 hover:text-primary-500 transition-colors">Log In</Link>
                            <Link href="/signup" className="btn-student-primary !py-2.5 !px-6 text-sm">Join Now</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
