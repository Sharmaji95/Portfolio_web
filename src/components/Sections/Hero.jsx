import { motion } from "framer-motion";
import { ArrowDown, Download, ExternalLink, User } from "lucide-react";
import CVDownloadButton from "../CV/CVDownloadButton";
import { useState, useEffect } from "react";
import { usePortfolio } from "../../context/PortfolioContext";

const Hero = () => {
    const { profile } = usePortfolio();
    const roles = profile.roles && profile.roles.length > 0 ? profile.roles : ["Data Analyst", "Business Intelligence", "Python Developer"];
    const [roleIndex, setRoleIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentRole = roles[roleIndex];
        const typeSpeed = isDeleting ? 50 : 100;

        const timeout = setTimeout(() => {
            if (!isDeleting && displayText === currentRole) {
                setTimeout(() => setIsDeleting(true), 1500);
            } else if (isDeleting && displayText === "") {
                setIsDeleting(false);
                setRoleIndex((prev) => (prev + 1) % roles.length);
            } else {
                setDisplayText(
                    currentRole.substring(0, displayText.length + (isDeleting ? -1 : 1))
                );
            }
        }, typeSpeed);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, roleIndex]);

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px animate-pulse delay-700]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="mb-4">
                        <span className="text-emerald-400 font-mono text-sm tracking-wider uppercase">
                            Hello, I'm {profile.name}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                        I am a <br />
                        <span className="text-gradient min-h-[1.2em] inline-block">
                            {displayText}
                            <span className="animate-blink text-emerald-400">|</span>
                        </span>
                    </h1>

                    <p className="text-gray-400 text-lg mb-8 max-w-lg">
                        {profile.bio}
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <CVDownloadButton />
                        <a href="#projects" className="flex items-center gap-2 border border-white/20 hover:border-emerald-500/50 hover:bg-white/5 text-white px-6 py-3 rounded-lg font-medium transition-all">
                            <ExternalLink size={20} />
                            <span>View Projects</span>
                        </a>
                    </div>
                </motion.div>

                {/* Right Content - 3D Profile Frame */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative flex justify-center"
                >
                    <div className="relative w-72 h-72 md:w-96 md:h-96">
                        {/* Spinning Rings */}
                        <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-[spin_10s_linear_infinite]"></div>
                        <div className="absolute inset-4 rounded-full border border-white/10 animate-[spin_15s_linear_infinite_reverse]"></div>

                        {/* Profile Image Container */}
                        <div className="absolute inset-8 rounded-full overflow-hidden border-4 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.3)] bg-deep-charcoal">
                            {profile.photo ? (
                                <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-gray-600">
                                    <User size={64} className="text-white/20" />
                                </div>
                            )}
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -bottom-4 -right-4 bg-gray-900/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                                    <ArrowDown size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Model Accuracy</p>
                                    <p className="text-xl font-bold text-white">95%</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500"
            >
                <ArrowDown size={24} />
            </motion.div>
        </section>
    );
};

export default Hero;
