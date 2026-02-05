import { motion } from "framer-motion";
import { GraduationCap, Calendar } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

const Education = () => {
    const { education } = usePortfolio();

    const data = education && education.length > 0 ? education : [
        {
            id: 1,
            degree: "No Education Listed",
            institution: "Add in Admin Panel",
            period: "2024",
            description: "Go to your Admin Panel > Education to add your degrees and certificates."
        }
    ];

    return (
        <section id="education" className="py-20 bg-deep-charcoal relative">
            <div className="max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Education & <span className="text-emerald-400">Certifications</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Academic background and professional qualifications.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-zinc-900 border border-white/5 p-6 rounded-xl hover:border-emerald-500/30 transition-colors group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    <GraduationCap size={20} />
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 text-xs bg-white/5 px-3 py-1 rounded-full">
                                    <Calendar size={12} />
                                    <span>{item.period}</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">{item.degree}</h3>
                            <span className="text-emerald-400 font-medium text-sm">{item.institution}</span>

                            <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;
