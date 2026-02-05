import { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Plus, Trash, BrainCircuit, MessageCircle, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const AIManager = () => {
    const { customQnA, addQnA, updateQnA, deleteQnA } = usePortfolio();
    const [isAdding, setIsAdding] = useState(false);
    const [newQnA, setNewQnA] = useState({ question: "", answer: "" });
    const [editingId, setEditingId] = useState(null);

    const handleAdd = () => {
        if (!newQnA.question || !newQnA.answer) {
            toast.error("Please fill in both question and answer");
            return;
        }
        addQnA(newQnA);
        setNewQnA({ question: "", answer: "" });
        setIsAdding(false);
        toast.success("Knowledge Added!");
    };

    const handleUpdate = (id) => {
        if (!newQnA.question || !newQnA.answer) return;
        updateQnA(id, newQnA);
        setEditingId(null);
        setNewQnA({ question: "", answer: "" });
        toast.success("Knowledge Updated!");
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setNewQnA({ question: item.question, answer: item.answer });
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
                        <BrainCircuit size={32} />
                        AI Knowledge Base
                    </h2>
                    <p className="text-gray-400 mt-1">Train your AI Assistant with custom questions and answers.</p>
                </div>
                <button
                    onClick={() => { setIsAdding(true); setNewQnA({ question: "", answer: "" }); }}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-500/20"
                >
                    <Plus size={20} />
                    <span>Add Knowledge</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Custom Knowledge List */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4">Custom Training Data</h3>
                    <AnimatePresence>
                        {(customQnA || []).length === 0 && !isAdding && (
                            <p className="text-gray-500 italic">No custom knowledge added yet. The AI is using only default logic.</p>
                        )}

                        {/* Add Form */}
                        {isAdding && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-zinc-800/50 border border-emerald-500/30 p-6 rounded-2xl shadow-xl"
                            >
                                <h4 className="font-bold text-emerald-400 mb-4">New Q&A Pair</h4>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="User asks... (e.g. 'What is your hourly rate?')"
                                        value={newQnA.question}
                                        onChange={(e) => setNewQnA({ ...newQnA, question: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                    <textarea
                                        rows="3"
                                        placeholder="AI answers..."
                                        value={newQnA.answer}
                                        onChange={(e) => setNewQnA({ ...newQnA, answer: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 resize-none"
                                    ></textarea>
                                    <div className="flex gap-3 justify-end">
                                        <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-white px-4 py-2">Cancel</button>
                                        <button onClick={handleAdd} className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold">Save</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* List Items */}
                        {(customQnA || []).map((item) => (
                            <motion.div
                                layout
                                key={item.id}
                                className="bg-zinc-900 border border-white/5 p-6 rounded-2xl group hover:border-emerald-500/20 transition-all"
                            >
                                {editingId === item.id ? (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={newQnA.question}
                                            onChange={(e) => setNewQnA({ ...newQnA, question: e.target.value })}
                                            className="w-full bg-black/40 border border-emerald-500/50 rounded-lg px-4 py-2 text-white"
                                        />
                                        <textarea
                                            rows="3"
                                            value={newQnA.answer}
                                            onChange={(e) => setNewQnA({ ...newQnA, answer: e.target.value })}
                                            className="w-full bg-black/40 border border-emerald-500/50 rounded-lg px-4 py-2 text-white resize-none"
                                        ></textarea>
                                        <div className="flex gap-3 justify-end">
                                            <button onClick={() => setEditingId(null)} className="text-sm text-gray-400">Cancel</button>
                                            <button onClick={() => handleUpdate(item.id)} className="flex items-center gap-1 text-sm bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded hover:bg-emerald-500/30">
                                                <Save size={14} /> Update
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2 text-emerald-400 font-medium">
                                                <MessageCircle size={16} />
                                                <span>"{item.question}"</span>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => startEdit(item)} className="text-gray-400 hover:text-white p-1">Edit</button>
                                                <button onClick={() => deleteQnA(item.id)} className="text-red-400 hover:text-red-300 p-1"><Trash size={16} /></button>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed pl-6 border-l-2 border-white/10">
                                            {item.answer}
                                        </p>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Default Logic Info */}
                <div>
                    <div className="sticky top-24 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                        <h3 className="text-xl font-bold text-white mb-6">Default AI Logic</h3>
                        <p className="text-gray-400 mb-6 text-sm">
                            The AI is pre-programmed to answer questions about these topics dynamically using your portfolio data. Custom questions (left) take priority.
                        </p>

                        <div className="space-y-4">
                            {[
                                { title: "Projects", desc: "Lists active projects, tools used, and impact." },
                                { title: "Experience", desc: "Summarizes recent roles and total years of experience." },
                                { title: "Skills", desc: "Lists technical stack and primary focus area." },
                                { title: "Education", desc: "Provides details on latest degree and institution." },
                                { title: "Contact", desc: "Provides your email and availability status." }
                            ].map((topic, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">{topic.title}</h4>
                                        <p className="text-xs text-gray-500">{topic.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIManager;
