"use client";

import {useState, useEffect} from 'react';
import {SynapseLogo} from '@/components/synapse-logo';
import {ArrowRight, Menu, X} from 'lucide-react';

export const HomeNavigationBar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-slate-800' : 'bg-transparent border-transparent'}`}>
            <div className="container mr-auto px-4 md:px-6 flex justify-between items-center">
                <SynapseLogo />

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#nasil-calisir" className="text-sm font-medium hover:text-white transition-colors">Nasıl Çalışır?</a>
                    <a href="#kurumsal" className="text-sm font-medium hover:text-white transition-colors">Kurumsal</a>
                    <button className="px-5 py-2.5 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
                        Giriş Yap
                    </button>
                    <button className="px-5 py-2.5 text-sm font-medium text-white bg-violet-600 rounded-full hover:bg-violet-700 shadow-lg shadow-violet-600/20 transition-all flex items-center gap-2">
                        Aramıza Katıl <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-slate-300 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 p-4 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-5">
                    <a href="#nasil-calisir" className="text-slate-300 hover:text-white py-2">Nasıl Çalışır?</a>
                    <a href="#kurumsal" className="text-slate-300 hover:text-white py-2">Kurumsal</a>
                    <div className="flex flex-col gap-3 mt-2">
                        <button className="w-full py-3 text-center text-sm font-medium text-white bg-slate-800 rounded-lg">Giriş Yap</button>
                        <button className="w-full py-3 text-center text-sm font-medium text-white bg-violet-600 rounded-lg">Aramıza Katıl</button>
                    </div>
                </div>
            )}
        </nav>
    );
};