import { useState } from "react";
import { Edit, Trash, Plus, X, Save, GraduationCap } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const EducationManager = () => {
    const { education, addEducation, updateEducation, deleteEducation } = usePortfolio();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ degree: "", institution: "", period: "", description: "" });

    const openModal = (edu = null) => {
        if (edu) {
            setEditingId(edu.id);
            setFormData(edu);
        } else {
            setEditingId(null);
            setFormData({ degree: "", institution: "", period: "", description: "" });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateEducation(editingId, formData);
            toast.success("Education entry updated!");
        } else {
            addEducation(formData);
            toast.success("Education entry added!");
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Remove this education entry?")) {
            deleteEducation(id);
            toast.success("Entry removed successfully.");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Manage Education</h2>
                    <p className="text-gray-400 text-sm mt-1">Showcase your academic background and certifications</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    <span className="font-medium">Add Entry</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {education.map((edu) => (
                    <div key={edu.id} className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row gap-6 relative group hover:border-emerald-500/30 transition-all shadow-lg hover:shadow-emerald-500/5">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                                <GraduationCap size={32} />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                <h4 className="text-xl font-bold text-white">{edu.degree}</h4>
                                <span className="hidden md:block text-gray-600">•</span>
                                <p className="text-emerald-400 font-medium">{edu.institution}</p>
                            </div>
                            <div className="inline-block bg-white/5 px-3 py-1 rounded-full text-xs text-gray-400 mb-4 border border-white/5">
                                {edu.period}
                            </div>
                            <p className="text-gray-400 leading-relaxed">{edu.description}</p>
                        </div>

                        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-200">
                            <button onClick={() => openModal(edu)} className="p-2.5 bg-black/40 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition-all backdrop-blur-sm border border-white/5">
                                <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(edu.id)} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/20">
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
                                <h3 className="text-xl font-bold">{editingId ? "Edit Education" : "Add Education"}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Degree / Certification</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.degree}
                                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Institution / Issuer</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.institution}
                                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Period (e.g. 2018 - 2022)</label>
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

export default EducationManager;
