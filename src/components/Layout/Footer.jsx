import { motion } from "framer-motion";
import { Send, Linkedin, Github, Mail, Twitter, MessageCircle } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { toast } from "react-hot-toast";

import { sanitizeInput } from "../../utils/helpers";

const Footer = () => {
    const { profile, addMessage } = usePortfolio();
    const socialLinks = profile.socialLinks || {};
    const socialState = profile.socialVisibility || { linkedin: true, github: true, twitter: true, email: true, whatsapp: true };

    return (
        <footer id="contact" className="bg-zinc-900 border-t border-white/5 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">

                {/* Contact Form */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold mb-4">Let's <span className="text-emerald-400">Connect</span></h2>
                        <p className="text-gray-400 mb-8">
                            Open to full-time opportunities and freelance projects. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                        </p>

                        <form className="space-y-4" onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);

                            // Sanitize Inputs
                            const msg = {
                                name: sanitizeInput(formData.get('name')),
                                email: sanitizeInput(formData.get('email')), // Email should technically be validated not just sanitized by HTML escape, but basic XSS prevention is the goal here.
                                subject: sanitizeInput(formData.get('subject')),
                                message: sanitizeInput(formData.get('message'))
                            };
                            if (msg.name && msg.email && msg.message) {
                                addMessage(msg);

                                // WhatsApp Notification Logic
                                if (profile.socialLinks?.whatsapp) {
                                    // Extract number if it's a link
                                    let phone = profile.socialLinks.whatsapp.replace("https://wa.me/", "").replace("whatsapp://send?phone=", "");
                                    // Clean phone number (remove +, spaces, dashes if needed, though wa.me handles some)
                                    // Actually wa.me prefers clean numbers. 
                                    const waText = `Hi ${profile.name || 'Admin'}, my name is *${msg.name}*.\n\n*Subject:* ${msg.subject}\n\n${msg.message}\n\n(Sent via Portfolio)`;
                                    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(waText)}`;

                                    window.open(waUrl, '_blank');
                                    toast.success("Message Saved! Opening WhatsApp...");
                                } else {
                                    toast.success("Message Sent Successfully!");
                                }

                                e.target.reset();
                            }
                        }}>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Name"
                                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-600"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="Email"
                                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-600"
                                />
                            </div>
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-600"
                            />
                            <textarea
                                rows="4"
                                name="message"
                                required
                                placeholder="Message"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-600 resize-none"
                            ></textarea>

                            <button type="submit" className="group flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white w-full py-4 rounded-lg font-bold transition-all">
                                Send Message
                                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Socials & Info */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-6">Connect on Social</h3>
                        <div className="flex gap-4">
                            {socialState?.linkedin && socialLinks.linkedin && (
                                <a
                                    href={socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all border border-white/5 hover:border-emerald-500"
                                >
                                    <Linkedin size={24} />
                                </a>
                            )}
                            {socialState?.github && socialLinks.github && (
                                <a
                                    href={socialLinks.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all border border-white/5 hover:border-emerald-500"
                                >
                                    <Github size={24} />
                                </a>
                            )}
                            {socialState?.twitter && socialLinks.twitter && (
                                <a
                                    href={socialLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all border border-white/5 hover:border-emerald-500"
                                >
                                    <Twitter size={24} />
                                </a>
                            )}
                            {socialState?.whatsapp && socialLinks.whatsapp && (
                                <a
                                    href={socialLinks.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all border border-white/5 hover:border-emerald-500"
                                >
                                    <MessageCircle size={24} />
                                </a>
                            )}
                            {socialState?.email && socialLinks.email && (
                                <a
                                    href={`mailto:${socialLinks.email}`}
                                    className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all border border-white/5 hover:border-emerald-500"
                                >
                                    <Mail size={24} />
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="mt-12 md:mt-0 p-8 rounded-2xl bg-gradient-to-br from-emerald-900/10 to-transparent border border-emerald-500/10">
                        <h4 className="text-emerald-400 font-bold mb-2">Portfolio Details</h4>
                        <p className="text-gray-500 text-sm">
                            Built with React.js, Tailwind CSS, Framer Motion & Recharts.
                            <br />
                            Designed for minimalism and performance.
                        </p>
                        <p className="text-gray-600 text-xs mt-4">
                            © {new Date().getFullYear()} {profile.name || "SharmaJi"}. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
