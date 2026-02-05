import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

const Testimonials = () => {
    const { testimonials } = usePortfolio();
    const data = testimonials && testimonials.length > 0 ? testimonials : [
        { id: 1, text: "No testimonials yet.", author: "", role: "" }
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (data.length <= 1) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % data.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [data.length]);

    return (
        <section className="py-20 bg-deep-charcoal relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <div className="mb-10 flex justify-center text-emerald-500">
                    <Quote size={48} className="opacity-50" />
                </div>

                <div className="relative h-64 flex items-center justify-center">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                        <p className="text-xl md:text-3xl font-medium text-gray-200 leading-relaxed italic">
                            "{data[index].text}"
                        </p>
                        <div className="mt-8">
                            <h4 className="text-lg font-bold text-emerald-400">{data[index].author}</h4>
                            <span className="text-sm text-gray-500 uppercase tracking-widest">{data[index].role}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Indicators */}
                {data.length > 1 && (
                    <div className="flex justify-center gap-3 mt-8">
                        {data.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-emerald-500' : 'w-2 bg-gray-700 hover:bg-gray-600'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Testimonials;
