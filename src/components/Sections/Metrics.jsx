import { motion } from "framer-motion";
import { usePortfolio } from "../../context/PortfolioContext";

const Metrics = () => {
    const { profile } = usePortfolio();

    const metrics = [
        { label: "Years Experience", value: profile.yearsOfExperience || "3+" },
        { label: profile.metric2?.label || "Dashboards Built", value: profile.metric2?.value || "50+" },
        { label: profile.metric3?.label || "Model Accuracy", value: profile.metric3?.value || "95%" },
    ];

    return (
        <section className="py-10 bg-deep-charcoal relative z-10">
            <div className="max-w-6xl mx-auto px-6">
                <div className="glass rounded-2xl p-8 flex flex-col md:flex-row justify-around items-center gap-8 md:gap-4 border-white/5">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-emerald-400 mb-2">
                                {metric.value}
                            </h3>
                            <p className="text-gray-400 font-medium tracking-wide uppercase text-sm">
                                {metric.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Metrics;
