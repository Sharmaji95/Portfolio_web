import { useState } from "react";
import { toast } from "react-hot-toast";
import { Mail, Reply, Trash, User, Calendar, ExternalLink, X, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../../context/PortfolioContext";

const Messages = () => {
    const { messages, deleteMessage, markMessageRead } = usePortfolio();
    const [selectedMessage, setSelectedMessage] = useState(null);

    const handleSelect = (message) => {
        setSelectedMessage(message);
        if (!message.read) {
            markMessageRead(message.id);
        }
    };

    const handleReply = () => {
        if (!selectedMessage) return;
        const body = `\n\n\n--- Original Message ---\nFrom: ${selectedMessage.name}\nDate: ${selectedMessage.date}\n\n${selectedMessage.message}`;
        window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}&body=${encodeURIComponent(body)}`;
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this message?")) {
            deleteMessage(id);
            setSelectedMessage(null);
            toast.success("Message deleted successfully.");
        }
    };

    const [searchTerm, setSearchTerm] = useState("");

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col md:flex-row h-[80vh] md:h-[calc(100vh-120px)] gap-6">
            {/* List */}
            <div className={`${selectedMessage ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 min-w-[300px] bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden flex-col h-full shadow-xl`}>
                <div className="p-4 border-b border-white/5 bg-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-lg">Inbox</h2>
                        <span className="bg-white/10 text-xs px-2 py-1 rounded-full text-gray-400">{messages.length}</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-gray-600"
                    />
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredMessages.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
                            <Mail size={32} className="opacity-20" />
                            <p className="text-sm">No messages found.</p>
                        </div>
                    ) : (
                        filteredMessages.map(msg => (
                            <div
                                key={msg.id}
                                onClick={() => handleSelect(msg)}
                                className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 relative group ${selectedMessage?.id === msg.id ? "bg-emerald-500/5 border-l-2 border-l-emerald-500" : "border-l-2 border-l-transparent"}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-sm ${!msg.read ? "font-bold text-white" : "font-medium text-gray-300"}`}>{msg.name}</span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{msg.date}</span>
                                </div>
                                <div className={`text-sm truncate mb-1 ${!msg.read ? "text-white font-medium" : "text-gray-400"}`}>{msg.subject}</div>
                                <div className="text-xs text-gray-500 truncate">{msg.message}</div>

                                {!msg.read && (
                                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Detail View */}
            <div className={`${!selectedMessage ? 'hidden md:flex' : 'flex'} flex-1 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden flex-col relative h-full shadow-xl`}>
                {selectedMessage ? (
                    <>
                        <div className="p-6 border-b border-white/5 flex justify-between items-start bg-white/5">
                            <div className="flex items-start gap-4">
                                <button onClick={() => setSelectedMessage(null)} className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white flex items-center gap-1">
                                    <ArrowLeft size={20} />
                                    <span className="text-sm font-medium">Back</span>
                                </button>
                                <div className="hidden md:block p-3 bg-emerald-500/20 rounded-full text-emerald-400">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold mb-1">{selectedMessage.subject}</h2>
                                    <div className="text-sm text-gray-400 flex flex-col">
                                        <span className="flex items-center gap-2"><User size={12} /> From: <span className="text-white">{selectedMessage.name}</span> ({selectedMessage.email})</span>
                                        <span className="flex items-center gap-2 mt-1"><Calendar size={12} /> Date: {selectedMessage.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={(e) => handleDelete(e, selectedMessage.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                                    <Trash size={20} />
                                </button>
                                <button onClick={() => setSelectedMessage(null)} className="md:hidden p-2 text-gray-400">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 flex-1 overflow-y-auto whitespace-pre-wrap leading-relaxed text-gray-300">
                            {selectedMessage.message}
                        </div>

                        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3">
                            <button onClick={handleReply} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full md:w-auto justify-center">
                                <Reply size={18} />
                                <span>Reply via Email</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <Mail size={48} className="mb-4 opacity-50" />
                        <p>Select a message to read</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
