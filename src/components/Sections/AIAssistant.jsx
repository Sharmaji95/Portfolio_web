import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../../context/PortfolioContext";

const AIAssistant = () => {
    const { profile, projects, experiences, education, customQnA } = usePortfolio();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            text: `Hello! I'm an AI assistant trained on ${profile?.name || "SharmaJi"}'s career data. Ask me about projects, skills, or experience!`
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showGreeting, setShowGreeting] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Show greeting tooltip after 3 seconds
        const timer = setTimeout(() => {
            setShowGreeting(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const generateResponse = (query) => {
        const lowerQuery = query.toLowerCase();

        // 0. Check Custom Q&A First (Priority)
        if (customQnA && customQnA.length > 0) {
            // Check if any custom QnA matches keywords
            // Basic matching: if user query includes the question, or question includes user query (fuzzy)
            const matchedCustom = customQnA.find(q =>
                lowerQuery.includes(q.question.toLowerCase()) ||
                q.question.toLowerCase().includes(lowerQuery)
            );
            if (matchedCustom) return matchedCustom.answer;
        }

        // 1. Projects
        if (lowerQuery.includes('project') || lowerQuery.includes('work') || lowerQuery.includes('built') || lowerQuery.includes('portfolio')) {
            const projectTitles = projects.filter(p => p.status === 'Active').map(p => p.title).join(", ");
            return `I have worked on several key projects including: ${projectTitles}. Would you like to know details about a specific one?`;
        }

        // 2. Specific Project Details
        const matchedProject = projects.find(p => lowerQuery.includes(p.title.toLowerCase()));
        if (matchedProject) {
            return `The **${matchedProject.title}** project focused on ${matchedProject.category}. It used ${matchedProject.tools.join(', ')} and resulted in: "${matchedProject.impact}".`;
        }

        // 3. Experience
        if (lowerQuery.includes('experience') || lowerQuery.includes('job') || lowerQuery.includes('company') || lowerQuery.includes('role')) {
            const recentRole = experiences[0];
            return `I have ${profile.yearsOfExperience} years of experience. Currently, I am a ${recentRole.role} at ${recentRole.company}.`;
        }

        // 4. Skills / Tech Stack
        if (lowerQuery.includes('skill') || lowerQuery.includes('tech') || lowerQuery.includes('stack') || lowerQuery.includes('python') || lowerQuery.includes('sql') || lowerQuery.includes('tool')) {
            // Aggregate unique tools from projects
            const allTools = [...new Set(projects.flatMap(p => p.tools))].join(", ");
            return `My technical toolkit includes: ${allTools}. I specialize in transforming data into insights.`;
        }

        // 5. Contact
        if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('hire') || lowerQuery.includes('reach')) {
            return `You can reach me at ${profile.socialLinks.email}. I'm open to new opportunities!`;
        }

        // 6. Education
        if (lowerQuery.includes('education') || lowerQuery.includes('degree') || lowerQuery.includes('study') || lowerQuery.includes('university')) {
            const latestEdu = education[0];
            return `I hold a ${latestEdu.degree} from ${latestEdu.institution}.`;
        }

        // Default
        return "I can tell you about my projects, experience, skills, or education. What would you like to know?";
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), role: 'user', text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI Delay
        setTimeout(() => {
            const responseText = generateResponse(userMsg.text);
            const aiMsg = { id: Date.now() + 1, role: 'assistant', text: responseText };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1000);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="fixed bottom-6 right-6 z-40 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-16 right-0 w-80 md:w-96 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <Bot size={20} />
                                <span className="font-bold">Ask My Data</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded p-1 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="h-80 bg-deep-charcoal p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-emerald-600 text-white rounded-tr-none'
                                            : 'bg-white/10 text-gray-200 rounded-tl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-zinc-900 border-t border-white/10">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about skills, projects..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-500"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isTyping}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed p-2"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Proactive Greeting Tooltip */}
            <AnimatePresence>
                {showGreeting && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute bottom-20 right-0 w-48 bg-white text-zinc-900 p-3 rounded-xl rounded-tr-none shadow-xl border border-white/20 text-sm font-medium z-30"
                    >
                        <div className="relative">
                            <p>👋 Hi! Have questions? Ask my digital twin!</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowGreeting(false);
                                }}
                                className="absolute -top-5 -left-5 bg-zinc-800 text-white rounded-full p-1 shadow-md hover:bg-zinc-700"
                            >
                                <X size={10} />
                            </button>
                            {/* Arrow */}
                            <div className="absolute -bottom-5 right-4 w-4 h-4 bg-white rotate-45 transform translate-y-1/2"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    setShowGreeting(false);
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-500/30 transition-transform hover:scale-110 active:scale-95 group relative z-40"
            >
                <div className="relative">
                    <MessageSquare size={24} />
                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    )}
                </div>
            </button>
        </div>
    );
};

export default AIAssistant;
