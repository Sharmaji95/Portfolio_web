import { motion } from "framer-motion";
import { usePortfolio } from "../../context/PortfolioContext";
import { ExternalLink } from "lucide-react";

const Dashboard = () => {
    const { liveAnalysis } = usePortfolio();

    if (!liveAnalysis) return null;

    return (
        <section className="py-20 bg-deep-charcoal relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        {(() => {
                            const title = liveAnalysis.title || "Live Analysis";
                            const lastSpaceIndex = title.lastIndexOf(" ");
                            if (lastSpaceIndex === -1) return <span className="text-emerald-400">{title}</span>;
                            return (
                                <>
                                    {title.substring(0, lastSpaceIndex)} <span className="text-emerald-400">{title.substring(lastSpaceIndex + 1)}</span>
                                </>
                            );
                        })()}
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">{liveAnalysis.description}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Visual / Embed */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="lg:col-span-3 w-full h-[500px] md:h-[600px] glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-zinc-900 group"
                    >
                        {liveAnalysis.tableauUrl ? (
                            <iframe
                                src={liveAnalysis.tableauUrl}
                                className="w-full h-full border-0"
                                title="Live Analysis Dashboard"
                            ></iframe>
                        ) : (
                            <div className="w-full h-full relative">
                                <img
                                    src={liveAnalysis.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop"}
                                    alt="Dashboard Preview"
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <div className="bg-black/60 backdrop-blur-md border border-white/10 px-6 py-4 rounded-xl text-center">
                                        <p className="text-gray-300 font-medium">Interactive Dashboard</p>
                                        <p className="text-xs text-gray-500 mt-1">Embed URL not configured</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Metrics Side Panel */}
                    <div className="lg:col-span-1 space-y-4">
                        {(liveAnalysis.metrics || []).map((metric, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl shadow-lg hover:border-emerald-500/30 transition-colors"
                            >
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">{metric.label}</p>
                                <p className="text-3xl font-bold text-emerald-400 font-mono">{metric.value}</p>
                            </motion.div>
                        ))}

                        {liveAnalysis.tableauUrl && (
                            <a
                                href={liveAnalysis.tableauUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 mt-4"
                            >
                                <ExternalLink size={20} />
                                <span>Open Full Screen</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
