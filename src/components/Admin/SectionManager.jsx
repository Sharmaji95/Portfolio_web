import { Eye, EyeOff, Layers } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { toast } from "react-hot-toast";

const SectionManager = () => {
    const { sectionVisibility, toggleSectionVisibility } = usePortfolio();

    const sections = [
        { id: 'hero', label: 'Hero Section' },
        { id: 'metrics', label: 'Key Metrics' },
        { id: 'skills', label: 'Skills & Tools' },
        { id: 'experience', label: 'Work Experience' },
        { id: 'education', label: 'Education' },
        { id: 'projects', label: 'Projects' },
        { id: 'dashboard', label: 'Live Analysis' },
        { id: 'testimonials', label: 'Testimonials' },
        { id: 'contact', label: 'Contact Footer' },
        { id: 'aiAssistant', label: 'AI Assistant Bubble' },
    ];

    const handleToggle = (id) => {
        toggleSectionVisibility(id);
        toast.success(`Visibility updated`);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-10">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Section Manager</h2>
                <p className="text-gray-400 mt-1">Control which sections are visible on your public portfolio.</p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Layers size={20} className="text-emerald-500" />
                        <span>Homepage Sections</span>
                    </h3>
                    <span className="text-xs text-gray-500 bg-black/30 px-3 py-1 rounded-full">
                        {Object.values(sectionVisibility).filter(Boolean).length} Active
                    </span>
                </div>

                <div className="divide-y divide-white/5">
                    {sections.map(section => (
                        <div key={section.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl transition-colors ${sectionVisibility[section.id] ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {sectionVisibility[section.id] ? <Eye size={24} /> : <EyeOff size={24} />}
                                </div>
                                <div>
                                    <h4 className={`font-bold text-lg ${sectionVisibility[section.id] ? 'text-white' : 'text-gray-500'}`}>{section.label}</h4>
                                    <p className="text-xs text-gray-500">
                                        {sectionVisibility[section.id] ? 'Visible to public' : 'Hidden from public'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleToggle(section.id)}
                                className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 ${sectionVisibility[section.id] ? 'bg-emerald-500 focus:ring-emerald-500' : 'bg-zinc-700 focus:ring-zinc-600'
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${sectionVisibility[section.id] ? 'translate-x-7' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SectionManager;
