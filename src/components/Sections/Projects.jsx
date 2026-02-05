import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ExternalLink, ArrowRight, BarChart, Database, TrendingUp } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

const Projects = () => {
    const { projects } = usePortfolio();
    const [selectedProject, setSelectedProject] = useState(null);

    // Filter only active projects for public view
    const activeProjects = projects.filter(p => p.status === "Active");

    return (
        <section id="projects" className="py-20 bg-deep-charcoal">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <span className="text-emerald-400 font-mono text-sm tracking-wider uppercase">Portfolio</span>
                    <h2 className="text-3xl md:text-5xl font-bold mt-2">Feat<span className="text-emerald-400">ured Work</span></h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            whileHover={{ y: -10 }}
                            className="group cursor-pointer rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all shadow-lg hover:shadow-emerald-500/10"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                                    {project.category}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp size={16} className="text-emerald-500" />
                                    <span className="text-sm font-medium text-gray-300">{project.impact}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(Array.isArray(project.tools) ? project.tools : []).map(tool => (
                                        <span key={tool} className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400">{tool}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Project Modal */}
                <AnimatePresence>
                    {selectedProject && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => setSelectedProject(null)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                                className="relative w-full max-w-5xl bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto"
                            >
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full hover:bg-emerald-500 text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>

                                <div className="h-64 md:h-80 overflow-hidden relative">
                                    <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 md:left-10">
                                        <h2 className="text-3xl md:text-5xl font-bold">{selectedProject.title}</h2>
                                        <p className="text-emerald-400 text-lg mt-2 font-medium">{selectedProject.impact}</p>
                                    </div>
                                </div>

                                <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x divide-white/10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                            <BarChart size={24} />
                                            <h4 className="text-lg font-bold uppercase tracking-wider">The Challenge</h4>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed">{selectedProject.challenge}</p>
                                    </div>

                                    <div className="space-y-4 md:pl-8">
                                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                            <Database size={24} />
                                            <h4 className="text-lg font-bold uppercase tracking-wider">Data Solution</h4>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed">{selectedProject.solution}</p>
                                    </div>

                                    <div className="space-y-4 md:pl-8">
                                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                            <TrendingUp size={24} />
                                            <h4 className="text-lg font-bold uppercase tracking-wider">Business Result</h4>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed">{selectedProject.result}</p>

                                        <div className="pt-6">
                                            {selectedProject.liveLink ? (
                                                <a
                                                    href={selectedProject.liveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg transition-colors font-medium w-full justify-center"
                                                >
                                                    <span>View Live Dashboard</span>
                                                    <ExternalLink size={18} />
                                                </a>
                                            ) : (
                                                <button disabled className="flex items-center gap-2 bg-zinc-700 text-gray-400 px-5 py-2.5 rounded-lg font-medium w-full justify-center cursor-not-allowed">
                                                    <span>Dashboard Not Live</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Projects;
