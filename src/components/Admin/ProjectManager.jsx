import { useState } from "react";
import { Edit, Trash, Plus, X, Save } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const ProjectManager = () => {
    const { projects, addProject, updateProject, deleteProject } = usePortfolio();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: "", category: "", status: "Active", image: "", impact: "", tools: "", challenge: "", solution: "", result: ""
    });

    const openModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                ...project,
                tools: Array.isArray(project.tools) ? project.tools.join(", ") : project.tools
            });
        } else {
            setEditingProject(null);
            setFormData({
                title: "", category: "", status: "Active", image: "", impact: "", tools: "", challenge: "", solution: "", result: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const toolsArray = formData.tools.split(",").map(t => t.trim());
        const projectData = { ...formData, tools: toolsArray };

        if (editingProject) {
            updateProject(editingProject.id, projectData);
            toast.success("Project updated successfully!");
        } else {
            addProject(projectData);
            toast.success("New project added!");
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            deleteProject(id);
            toast.success("Project deleted successfully.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Manage Projects</h2>
                    <p className="text-gray-400 text-sm mt-1">Add, edit, or remove entries from your portfolio</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    <span className="font-medium">Add Project</span>
                </button>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-white/5 border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-8 py-5 font-semibold">Project Title</th>
                                <th className="px-6 py-5 font-semibold">Category</th>
                                <th className="px-6 py-5 font-semibold">Status</th>
                                <th className="px-6 py-5 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="font-semibold text-white text-base">{project.title}</div>
                                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">{project.challenge}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                                            {project.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-medium border ${project.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${project.status === "Active" ? "bg-emerald-500" : "bg-yellow-500"}`}></span>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openModal(project)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(project.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{editingProject ? "Edit Project" : "Add New Project"}</h3>
                                    <p className="text-sm text-gray-400 mt-1">Fill in the details below to update your portfolio.</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Title</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-700" placeholder="e.g. Sales Dashboard" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Category</label>
                                        <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-700" placeholder="e.g. Data Visualization" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Image URL</label>
                                    <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-700" placeholder="https://..." />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Impact Badge</label>
                                        <input type="text" name="impact" value={formData.impact} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-700" placeholder="e.g. Reduced Cost by 20%" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Status</label>
                                        <div className="relative">
                                            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-emerald-500">
                                                <option value="Active">Active</option>
                                                <option value="Draft">Draft</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Tools (comma separated)</label>
                                    <input type="text" name="tools" value={formData.tools} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-700" placeholder="Python, SQL, Tableau" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Live Dashboard URL (Optional)</label>
                                    <input type="text" name="liveLink" value={formData.liveLink || ""} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-700" placeholder="https://..." />
                                </div>

                                <div className="space-y-4 pt-2 border-t border-white/5">
                                    <h4 className="font-bold text-gray-300 transform translate-y-2">Detailed Case Study (For CV)</h4>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">The Challenge</label>
                                        <textarea rows="2" name="challenge" value={formData.challenge} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all resize-none placeholder:text-gray-700" placeholder="What was the problem?" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">The Solution</label>
                                        <textarea rows="2" name="solution" value={formData.solution} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all resize-none placeholder:text-gray-700" placeholder="How did you solve it?" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Business Result</label>
                                        <textarea rows="2" name="result" value={formData.result} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all resize-none placeholder:text-gray-700" placeholder="What was the outcome?" />
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end gap-3 border-t border-white/5">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all font-medium">Cancel</button>
                                    <button type="submit" className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30">
                                        <Save size={18} />
                                        <span>Save Project</span>
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

export default ProjectManager;
