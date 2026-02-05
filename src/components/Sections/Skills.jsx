import { motion } from "framer-motion";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import * as LucideIcons from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

const Skills = () => {
    const { skills } = usePortfolio();

    // Fallback data if context is empty (initial load)
    const radarData = skills?.radar || [
        { subject: "Python", A: 90, fullMark: 100 },
        { subject: "SQL", A: 95, fullMark: 100 },
        { subject: "Tableau", A: 85, fullMark: 100 },
        { subject: "PowerBI", A: 80, fullMark: 100 },
        { subject: "Excel", A: 98, fullMark: 100 },
        { subject: "ML", A: 75, fullMark: 100 },
    ];

    const techStack = skills?.techStack || [
        { name: "Python", icon: "Terminal" },
        { name: "SQL", icon: "Database" },
        { name: "Tableau", icon: "PieChart" },
        { name: "PowerBI", icon: "BarChart3" },
        { name: "Excel", icon: "FileSpreadsheet" },
        { name: "Pandas", icon: "Code2" },
        { name: "Scikit-Learn", icon: "BrainCircuit" },
        { name: "Streamlit", icon: "Globe" },
    ];

    // Helper to render icon by name
    const renderIcon = (iconName) => {
        const IconComponent = LucideIcons[iconName];
        return IconComponent ? <IconComponent size={24} /> : <LucideIcons.Code2 size={24} />;
    };

    return (
        <section id="skills" className="py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Technical <span className="text-emerald-400">Expertise</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        A comprehensive toolkit for extracting value from data. From raw SQL queries to interactive dashboards.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Radar Chart Block */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2 glass rounded-2xl p-6 md:p-10 min-h-[400px] flex flex-col justify-center items-center"
                    >
                        <h3 className="text-2xl font-semibold mb-6 text-gray-200">Proficiency Analysis</h3>
                        <div className="w-full h-[300px] md:h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                    <PolarGrid stroke="#374151" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 14 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Skills"
                                        dataKey="A"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fill="#10b981"
                                        fillOpacity={0.3}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Marquee / Icon Block - Bento Style */}
                    <div className="flex flex-col gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass rounded-2xl p-8 flex-1 flex flex-col justify-center"
                        >
                            <h3 className="text-xl font-semibold mb-6 text-gray-200">Tool Stack</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {techStack.map((tech, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg hover:bg-emerald-500/10 transition-colors border border-white/5 hover:border-emerald-500/30">
                                        <span className="text-emerald-400">{renderIcon(tech.icon)}</span>
                                        <span className="text-gray-300 font-medium">{tech.name}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass rounded-2xl p-8 flex-1 bg-gradient-to-br from-emerald-900/20 to-deep-charcoal border-emerald-500/20"
                        >
                            <div className="flex items-center gap-4 mb-2">
                                <LucideIcons.BrainCircuit className="text-emerald-400" size={32} />
                                <h3 className="text-xl font-bold text-white">Focus Area</h3>
                            </div>
                            <p className="text-gray-400">
                                {skills?.focusArea || "Specializing in predictive modeling and automated reporting pipelines using Python & SQL."}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
