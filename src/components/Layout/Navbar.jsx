import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code, Database, User, Briefcase, GraduationCap, Mail } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

const Navbar = () => {
    const { profile } = usePortfolio();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            // Hysteresis to prevent flickering
            if (window.scrollY > 50) {
                setScrolled(true);
            } else if (window.scrollY < 30) {
                setScrolled(false);
            }
        };

        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -70% 0px", // Trigger when section is near top
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sections = document.querySelectorAll("section[id], footer[id]");
        sections.forEach((section) => observer.observe(section));

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    const navLinks = [
        { title: "Skills", href: "#skills", icon: <Database size={18} /> },
        { title: "Experience", href: "#experience", icon: <Briefcase size={18} /> },
        { title: "Education", href: "#education", icon: <GraduationCap size={18} /> },
        { title: "Projects", href: "#projects", icon: <Code size={18} /> },
        { title: "Contact", href: "#contact", icon: <Mail size={18} /> },
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out border-b 
            ${scrolled || isOpen
                    ? "bg-zinc-900/80 backdrop-blur-md border-white/10 py-3 shadow-lg"
                    : "bg-transparent border-transparent py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-white">
                {/* Logo / Name */}
                <a href="#" className="flex items-center gap-3 group">
                    {profile.photo && (
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500 blur-sm opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                            <img
                                src={profile.photo}
                                alt={profile.name}
                                className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:border-emerald-500/50 transition-colors relative z-10"
                            />
                        </div>
                    )}
                    <div className="text-xl font-bold tracking-tight">
                        {(() => {
                            const names = (profile.name || "SharmaJi").split(" ");
                            const firstName = names[0];
                            const lastName = names.slice(1).join(" ");
                            return (
                                <>
                                    <span className="text-white group-hover:text-emerald-50 text-shadow-sm transition-colors">{firstName}</span>{" "}
                                    {lastName && <span className="text-emerald-500 group-hover:text-emerald-400 transition-colors">{lastName}</span>}
                                    {!lastName && <span className="text-emerald-500">.</span>}
                                </>
                            );
                        })()}
                    </div>
                </a>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => {
                        const isActive = activeSection === link.href.substring(1);
                        return (
                            <a
                                key={link.title}
                                href={link.href}
                                className={`flex items-center space-x-2 transition-all duration-300 hover:-translate-y-0.5 transform ${isActive ? "text-emerald-400 font-medium scale-105" : "text-gray-300 hover:text-emerald-400"
                                    }`}
                            >
                                {link.icon}
                                <span>{link.title}</span>
                                {isActive && (
                                    <motion.span
                                        layoutId="activeNav"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </a>
                        );
                    })}

                    {/* Open to Work Indicator */}
                    <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-shadow cursor-default">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">Open to Work</span>
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none p-2 hover:bg-white/5 rounded-lg transition-colors">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden bg-zinc-900/95 backdrop-blur-xl border-t border-white/10 shadow-2xl overflow-hidden"
                    >
                        <div className="flex flex-col space-y-2 p-6">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.href.substring(1);
                                return (
                                    <a
                                        key={link.title}
                                        href={link.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsOpen(false);
                                            // Small delay to allow menu close to start smoothly before scrolling
                                            setTimeout(() => {
                                                const element = document.querySelector(link.href);
                                                if (element) {
                                                    const headerOffset = 80;
                                                    const elementPosition = element.getBoundingClientRect().top;
                                                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                                                    window.scrollTo({
                                                        top: offsetPosition,
                                                        behavior: "smooth"
                                                    });
                                                }
                                            }, 100);
                                        }}
                                        className={`flex items-center space-x-3 text-lg py-3 px-4 rounded-xl transition-all cursor-pointer ${isActive
                                            ? "bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20"
                                            : "text-gray-300 hover:text-emerald-400 hover:bg-white/5"
                                            }`}
                                    >
                                        {link.icon}
                                        <span>{link.title}</span>
                                    </a>
                                );
                            })}
                            <div className="pt-4 flex items-center space-x-3 px-4">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-sm font-semibold text-emerald-400">Open to Work</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
