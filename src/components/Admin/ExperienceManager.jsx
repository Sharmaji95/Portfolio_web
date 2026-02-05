import { useState } from "react";
import { Edit, Trash, Plus, X, Save, Briefcase } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const ExperienceManager = () => {
    const { experiences, addExperience, updateExperience, deleteExperience } = usePortfolio();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ role: "", company: "", period: "", description: "" });

    const openModal = (exp = null) => {
        if (exp) {
            setEditingId(exp.id);
            setFormData(exp);
        } else {
            setEditingId(null);
            setFormData({ role: "", company: "", period: "", description: "" });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateExperience(editingId, formData);
            toast.success("Experience updated!");
        } else {
            addExperience(formData);
            toast.success("Experience added!");
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this experience entry?")) {
            deleteExperience(id);
            toast.success("Entry deleted.");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Experience</h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus size={18} />
                    <span>Add Experience</span>
                </button>
            </div>

            <div className="space-y-4">
                {experiences.map((exp) => (
                    <div key={exp.id} className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row gap-6 relative group hover:border-emerald-500/30 transition-all shadow-lg hover:shadow-emerald-500/5">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                                <Briefcase size={32} />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                <h4 className="text-xl font-bold text-white">{exp.role}</h4>
                                <span className="hidden md:block text-gray-600">•</span>
                                <p className="text-emerald-400 font-medium">{exp.company}</p>
                            </div>
                            <div className="inline-block bg-white/5 px-3 py-1 rounded-full text-xs text-gray-400 mb-4 border border-white/5">
                                {exp.period}
                            </div>
                            <p className="text-gray-400 leading-relaxed">{exp.description}</p>
                        </div>

                        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-200">
                            <button onClick={() => openModal(exp)} className="p-2.5 bg-black/40 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition-all backdrop-blur-sm border border-white/5">
                                <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(exp.id)} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/20">
                                <Trash size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">{editingId ? "Edit Experience" : "Add Experience"}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Job Role / Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Company Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Period (e.g. 2023 - Present)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.period}
                                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                                    <textarea
                                        rows="4"
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                                    ></textarea>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">Cancel</button>
                                    <button type="submit" className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                        <Save size={18} />
                                        <span>Save</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExperienceManager;
