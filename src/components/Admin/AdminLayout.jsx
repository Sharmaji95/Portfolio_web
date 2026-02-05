import { useState } from "react";
import { LayoutDashboard, FolderKanban, Settings, MessageSquare, LogOut, FileText, Quote, Briefcase, GraduationCap, BrainCircuit, Menu, X, BarChart3, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../../context/PortfolioContext";
import DashboardStats from "./DashboardStats";
import ProjectManager from "./ProjectManager";
import TestimonialManager from "./TestimonialManager";
import ExperienceManager from "./ExperienceManager";
import EducationManager from "./EducationManager";
import SettingsComponent from "./Settings";
import Messages from "./Messages";
import AIManager from "./AIManager";
import LiveAnalysisManager from "./LiveAnalysisManager";
import SectionManager from "./SectionManager";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
    const { logout, messages } = usePortfolio();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { id: "live-analysis", label: "Live Analysis", icon: <BarChart3 size={20} /> },
        { id: "sections", label: "Manage Sections", icon: <Layers size={20} /> },
        { id: "projects", label: "Projects", icon: <FolderKanban size={20} /> },
        { id: "experience", label: "Experience", icon: <Briefcase size={20} /> },
        { id: "education", label: "Education", icon: <GraduationCap size={20} /> },
        { id: "testimonials", label: "Testimonials", icon: <Quote size={20} /> },
        { id: "ai-assistant", label: "AI Assistant", icon: <BrainCircuit size={20} /> },
        { id: "settings", label: "Settings", icon: <Settings size={20} /> },
        { id: "messages", label: "Messages", icon: <MessageSquare size={20} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard": return <DashboardStats />;
            case "live-analysis": return <LiveAnalysisManager />;
            case "sections": return <SectionManager />;
            case "projects": return <ProjectManager />;
            case "experience": return <ExperienceManager />;
            case "education": return <EducationManager />;
            case "testimonials": return <TestimonialManager />;
            case "ai-assistant": return <AIManager />;
            case "messages": return <Messages />;
            case "settings": return <SettingsComponent />;
            default: return <DashboardStats />;
        }
    };

    return (
        <div className="flex h-screen bg-deep-charcoal text-white overflow-hidden">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-900 border-b border-white/5 flex items-center justify-between px-4 z-50">
                <span className="font-bold text-lg">Admin Panel</span>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-400 hover:text-white">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Backdrop for Mobile */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 w-64 bg-zinc-900/95 md:bg-zinc-900/50 backdrop-blur-xl md:backdrop-blur-none border-r border-white/5 
                flex flex-col z-50 transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
                <div className="p-6 hidden md:block">
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Admin<span className="text-emerald-400">Panel</span>
                    </h1>
                </div>

                {/* Mobile Sidebar Header */}
                <div className="p-6 md:hidden flex justify-between items-center">
                    <h1 className="text-xl font-bold">Menu</h1>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-1"><X size={20} /></button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 md:mt-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === item.id
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            {/* Active indicator bar */}
                            {activeTab === item.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-xl" />
                            )}

                            <span className={`transition-transform duration-200 ${activeTab === item.id ? "scale-110" : "group-hover:scale-110"}`}>
                                {item.icon}
                            </span>

                            <div className="flex-1 flex justify-between items-center z-10">
                                <span className={`font-medium ${activeTab === item.id ? "text-emerald-100" : ""}`}>{item.label}</span>
                                {item.id === "messages" && messages?.some(m => !m.read) && (
                                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-emerald-500/20 animate-pulse">
                                        {messages.filter(m => !m.read).length}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5 space-y-2 bg-gradient-to-t from-black/20 to-transparent">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                    <button
                        onClick={() => {
                            logout();
                            navigate('/');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-blue-500/10 hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/20"
                    >
                        <FileText size={20} />
                        <span>View Live Site</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-deep-charcoal w-full">
                <div className="p-4 pt-20 md:p-8 max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab ? renderContent() : children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
