import { useState } from "react";
import { Edit, Trash, Plus, X, Save, Quote } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const TestimonialManager = () => {
    const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = usePortfolio();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ text: "", author: "", role: "" });

    const openModal = (testimonial = null) => {
        if (testimonial) {
            setEditingId(testimonial.id);
            setFormData(testimonial);
        } else {
            setEditingId(null);
            setFormData({ text: "", author: "", role: "" });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateTestimonial(editingId, formData);
            toast.success("Testimonial updated!");
        } else {
            addTestimonial(formData);
            toast.success("New testimonial added!");
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Remove this testimonial?")) {
            deleteTestimonial(id);
            toast.success("Testimonial removed.");
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Testimonials</h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus size={18} />
                    <span>Add Testimonial</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((t) => (
                    <div key={t.id} className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl relative group hover:border-emerald-500/30 transition-all shadow-lg hover:shadow-emerald-500/5 flex flex-col h-full">
                        <div className="mb-4">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 mb-4">
                                <Quote size={20} />
                            </div>
                            <p className="text-gray-300 italic leading-relaxed">"{t.text}"</p>
                        </div>

                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-white text-lg">{t.author}</h4>
                                <span className="text-sm text-emerald-400">{t.role}</span>
                            </div>
                        </div>

                        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-200">
                            <button onClick={() => openModal(t)} className="p-2.5 bg-black/40 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition-all backdrop-blur-sm border border-white/5">
                                <Edit size={18} />
                            </button>
                            <button onClick={() => deleteTestimonial(t.id)} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/20">
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
                                <h3 className="text-xl font-bold">{editingId ? "Edit Testimonial" : "Add Testimonial"}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Client Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Role / Company</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Testimonial</label>
                                    <textarea
                                        rows="4"
                                        required
                                        value={formData.text}
                                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
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

export default TestimonialManager;
