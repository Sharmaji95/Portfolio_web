import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

const Experience = () => {
    const { experiences } = usePortfolio();

    // Default Fallback
    const data = experiences && experiences.length > 0 ? experiences : [
        {
            id: 1,
            role: "No Experience Listed",
            company: "Add in Admin Panel",
            period: "Present",
            description: "Go to your Admin Panel > Experience to add your work history."
        }
    ];

    return (
        <section id="experience" className="py-20 bg-deep-charcoal relative">
            <div className="max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Work <span className="text-emerald-400">Experience</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        My professional journey and the value I've delivered.
                    </p>
                </motion.div>

                <div className="relative border-l border-white/10 ml-4 md:ml-0 space-y-12">
                    {data.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative pl-8 md:pl-12"
                        >
                            <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-zinc-900" />

                            <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl hover:border-emerald-500/30 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{item.role}</h3>
                                        <span className="text-emerald-400 font-medium">{item.company}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm bg-white/5 px-3 py-1 rounded-full w-fit">
                                        <Calendar size={14} />
                                        <span>{item.period}</span>
                                    </div>
                                </div>
                                <p className="text-gray-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
