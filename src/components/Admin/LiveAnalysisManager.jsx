import { useState } from "react";
import { Save, AlertCircle, BarChart3, Trash2, Plus, ExternalLink } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { toast } from "react-hot-toast";

const LiveAnalysisManager = () => {
    const { liveAnalysis, updateLiveAnalysis } = usePortfolio();

    // Initialize form with context state (ensure safe access)
    const [formData, setFormData] = useState({
        title: liveAnalysis?.title || "Live Analysis",
        description: liveAnalysis?.description || "",
        tableauUrl: liveAnalysis?.tableauUrl || "",
        imageUrl: liveAnalysis?.imageUrl || "",
        metrics: liveAnalysis?.metrics || []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMetricChange = (index, field, value) => {
        const newMetrics = [...formData.metrics];
        newMetrics[index] = { ...newMetrics[index], [field]: value };
        setFormData(prev => ({ ...prev, metrics: newMetrics }));
    };

    const addMetric = () => {
        setFormData(prev => ({
            ...prev,
            metrics: [...prev.metrics, { id: Date.now(), label: "New Metric", value: "0" }]
        }));
    };

    const removeMetric = (index) => {
        const newMetrics = formData.metrics.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, metrics: newMetrics }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateLiveAnalysis(formData);
        toast.success("Live Analysis Section Updated!");
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Live Analysis Manager</h2>
                    <p className="text-gray-400 mt-1">Configure your featured live dashboard or project</p>
                </div>
                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                >
                    <Save size={20} />
                    <span>Save Changes</span>
                </button>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-xl space-y-8">
                {/* Main Details */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Section Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold text-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                        <textarea
                            rows="3"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all resize-none"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Tableau / Embed URL</label>
                            <input
                                type="text"
                                name="tableauUrl"
                                value={formData.tableauUrl}
                                onChange={handleChange}
                                placeholder="https://public.tableau.com/views/..."
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <AlertCircle size={12} />
                                Leave empty to show Fallback Image
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Fallback Image URL</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Metrics Section */}
                <div className="pt-8 border-t border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                            <BarChart3 size={20} className="text-emerald-500" />
                            Key Highlight Metrics
                        </h4>
                        <button
                            onClick={addMetric}
                            className="flex items-center gap-2 text-sm bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg transition-colors border border-emerald-500/20"
                        >
                            <Plus size={16} /> Add Metric
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.metrics.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 border border-dashed border-white/10 rounded-xl bg-black/20">
                                No metrics added yet.
                            </div>
                        ) : (
                            formData.metrics.map((metric, index) => (
                                <div key={metric.id || index} className="flex gap-4 items-center bg-black/20 p-4 rounded-xl border border-white/5 group">
                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Label</label>
                                            <input
                                                type="text"
                                                value={metric.label}
                                                onChange={(e) => handleMetricChange(index, 'label', e.target.value)}
                                                className="w-full bg-transparent border-b border-white/10 focus:border-emerald-500 focus:outline-none text-white text-sm pb-1"
                                                placeholder="Total Revenue"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Value</label>
                                            <input
                                                type="text"
                                                value={metric.value}
                                                onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                                                className="w-full bg-transparent border-b border-white/10 focus:border-emerald-500 focus:outline-none text-emerald-400 font-mono text-sm pb-1"
                                                placeholder="$1.2M"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeMetric(index)}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Preview Link */}
                <div className="pt-6 border-t border-white/5 flex text-gray-500 text-sm gap-2">
                    <ExternalLink size={16} />
                    <span>This content will appear in the "Live Analysis" section on the homepage.</span>
                </div>
            </div>
        </div>
    );
};

export default LiveAnalysisManager;
