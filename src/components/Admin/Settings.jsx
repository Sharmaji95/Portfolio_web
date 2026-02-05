import { useState, useEffect, useCallback } from "react";
import { Save, Upload, Trash2, TrendingUp, Lock, User, X, Loader2 } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import Cropper from "react-easy-crop";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Settings = () => {
    const { profile, updateProfile, changePassword, skills, updateSkills, devMode, toggleDevMode } = usePortfolio();

    // Profile State
    const [formData, setFormData] = useState({ ...profile, skills: skills || {} });
    const [rolesInput, setRolesInput] = useState("");

    // Password State
    const [passwords, setPasswords] = useState({ new: "", confirm: "" });
    const [passwordMsg, setPasswordMsg] = useState("");

    // CV State
    const [cvMode, setCvMode] = useState("auto");
    const [manualCV, setManualCV] = useState(null);
    const [cvUploadError, setCvUploadError] = useState("");
    const [isCvUploading, setIsCvUploading] = useState(false);

    // Cropper State
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [uploadError, setUploadError] = useState("");

    // Sync with Profile Context
    useEffect(() => {
        if (profile) {
            setFormData(prev => ({
                ...prev,
                ...profile,
                skills: skills || prev.skills || {}
            }));
            setRolesInput(profile.roles ? profile.roles.join(", ") : "");
            setCvMode(profile.cvMode || "auto");
            setManualCV(profile.manualCV || null);
        }
    }, [profile, skills]);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRolesChange = (e) => {
        setRolesInput(e.target.value);
    };

    const handlePasswordChange = () => {
        if (passwords.new !== passwords.confirm) {
            setPasswordMsg("Passwords do not match.");
            toast.error("Passwords do not match");
            return;
        }
        if (passwords.new.length < 4) {
            setPasswordMsg("Password must be at least 4 characters.");
            toast.error("Password too short");
            return;
        }
        changePassword(passwords.new);
        setPasswordMsg("Password changed successfully!");
        toast.success("Password updated successfully!");
        setPasswords({ new: "", confirm: "" });
    };

    const handleSave = () => {
        const rolesArray = (rolesInput || "").split(",").map(r => r.trim()).filter(r => r.length > 0);

        // Update Profile
        updateProfile({
            ...formData,
            roles: rolesArray,
            cvMode,
            manualCV
        });

        // Update Skills
        if (formData.skills) {
            updateSkills(formData.skills);
        }

        toast.success("Settings saved successfully!");
    };

    // Image Handling
    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            let imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl);
            setIsCropperOpen(true);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            setFormData(prev => ({ ...prev, photo: croppedImage }));
            setIsCropperOpen(false);
            setImageSrc(null);
            toast.success("Profile image updated");
        } catch (e) {
            console.error(e);
            setUploadError("Failed to crop image");
            toast.error("Failed to crop image");
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, photo: null }));
        toast.success("Profile image removed");
    };

    // CV Upload
    const handleCVUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setCvUploadError("Please upload a PDF file.");
            toast.error("Invalid file type");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setCvUploadError("File size exceeds 5MB.");
            toast.error("File too large");
            return;
        }

        setIsCvUploading(true);
        try {
            const base64 = await readFile(file);
            setManualCV(base64);
            setCvUploadError("");
            toast.success("CV uploaded successfully");
        } catch (err) {
            console.error(err);
            setCvUploadError("Failed to read file.");
            toast.error("Upload failed");
        } finally {
            setIsCvUploading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto relative pb-32">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Profile & Settings</h2>
                    <p className="text-gray-400 mt-1">Customize your portfolio appearance and personal details</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                >
                    <Save size={20} />
                    <span>Save Changes</span>
                </button>
            </div>

            {/* Profile Form */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-xl mb-8">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-white/5 pb-4">Personal Information</h3>

                <div className="flex flex-col md:flex-row gap-8 mb-8 items-start">
                    <div className="w-40 h-40 rounded-full bg-black/40 flex items-center justify-center overflow-hidden border-4 border-white/5 shrink-0 relative group shadow-2xl">
                        {formData.photo ? (
                            <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={64} className="text-gray-600" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-xs font-medium text-white">Change</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-6 w-full">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Profile Image</label>
                            <div className="flex flex-wrap items-center gap-3">
                                <label className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-5 py-2.5 rounded-xl cursor-pointer border border-emerald-500/20 transition-all font-medium">
                                    <Upload size={18} />
                                    <span>Upload Photo</span>
                                    <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                                </label>
                                {formData.photo && (
                                    <button
                                        onClick={handleRemoveImage}
                                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-5 py-2.5 rounded-xl border border-red-500/20 transition-all font-medium"
                                    >
                                        <Trash2 size={18} />
                                        <span>Remove</span>
                                    </button>
                                )}
                            </div>
                            {uploadError && <p className="text-red-400 text-xs mt-2 font-medium">{uploadError}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Or Image URL</label>
                            <input
                                type="text"
                                name="photo"
                                value={formData.photo || ""}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Website Favicon URL</label>
                            <input
                                type="text"
                                name="favicon"
                                value={formData.favicon || ""}
                                onChange={handleChange}
                                placeholder="https://example.com/icon.png"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-1">Icon that appears in the browser tab.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Job Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title || ""}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Bio / Subtext</label>
                        <textarea
                            rows="3"
                            name="bio"
                            value={formData.bio || ""}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                        ></textarea>
                    </div>

                    <div className="col-span-1 md:col-span-2 p-6 bg-black/20 rounded-xl border border-white/5 space-y-6">
                        <h4 className="font-bold text-gray-200 flex items-center gap-2">
                            <TrendingUp size={18} className="text-emerald-500" />
                            Key Metrics
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Exp. Years</label>
                                <input
                                    type="text"
                                    name="yearsOfExperience"
                                    value={formData.yearsOfExperience || ""}
                                    onChange={handleChange}
                                    placeholder="4+"
                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Metric 2 (Value + Label)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.metric2?.value || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, metric2: { ...prev.metric2, value: e.target.value } }))}
                                        placeholder="50+"
                                        className="w-20 bg-zinc-900 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-emerald-500 text-center"
                                    />
                                    <input
                                        type="text"
                                        value={formData.metric2?.label || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, metric2: { ...prev.metric2, label: e.target.value } }))}
                                        placeholder="Projects"
                                        className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Metric 3 (Value + Label)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.metric3?.value || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, metric3: { ...prev.metric3, value: e.target.value } }))}
                                        placeholder="95%"
                                        className="w-20 bg-zinc-900 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-emerald-500 text-center"
                                    />
                                    <input
                                        type="text"
                                        value={formData.metric3?.label || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, metric3: { ...prev.metric3, label: e.target.value } }))}
                                        placeholder="Accuracy"
                                        className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Typing Roles</label>
                        <input
                            type="text"
                            name="roles"
                            value={rolesInput || ""}
                            onChange={handleRolesChange}
                            placeholder="Data Analyst, Python Developer, Storyteller"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-2 ml-1">Comma separated. e.g. "Data Scientist, Analyst"</p>
                    </div>
                </div>
            </div>

            {/* Skills & Tools Section */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-xl mb-8">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-white/5 pb-4">Skills & Tools</h3>

                {/* Radar Chart Data */}
                <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-emerald-500" />
                        Radar Chart Proficiency
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(formData.skills?.radar || []).map((skill, index) => (
                            <div key={index} className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                                <input
                                    type="text"
                                    value={skill.subject}
                                    onChange={(e) => {
                                        const newRadar = [...formData.skills.radar];
                                        newRadar[index].subject = e.target.value;
                                        setFormData(prev => ({ ...prev, skills: { ...prev.skills, radar: newRadar } }));
                                    }}
                                    className="flex-1 bg-transparent text-white text-sm font-bold focus:outline-none border-b border-white/10 focus:border-emerald-500 transition-colors"
                                    placeholder="Skill Name"
                                />
                                <div className="flex items-center gap-1 w-20">
                                    <input
                                        type="number"
                                        value={skill.A}
                                        min="0"
                                        max="100"
                                        onChange={(e) => {
                                            const newRadar = [...formData.skills.radar];
                                            newRadar[index].A = parseInt(e.target.value) || 0;
                                            setFormData(prev => ({ ...prev, skills: { ...prev.skills, radar: newRadar } }));
                                        }}
                                        className="w-full bg-zinc-800 rounded px-2 py-1 text-xs text-white text-center focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    />
                                    <span className="text-xs text-gray-500">%</span>
                                </div>
                                <button
                                    onClick={() => {
                                        const newRadar = formData.skills.radar.filter((_, i) => i !== index);
                                        setFormData(prev => ({ ...prev, skills: { ...prev.skills, radar: newRadar } }));
                                    }}
                                    className="text-red-400 hover:text-red-300 p-1"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => {
                                const newRadar = [...(formData.skills?.radar || []), { subject: "New Skill", A: 50, fullMark: 100 }];
                                setFormData(prev => ({ ...prev, skills: { ...prev.skills, radar: newRadar } }));
                            }}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 border-dashed rounded-xl p-4 flex items-center justify-center gap-2 font-medium transition-all"
                        >
                            + Add Metric
                        </button>
                    </div>
                </div>

                {/* Tech Stack Tools */}
                <div>
                    <h4 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
                        <Upload size={18} className="text-emerald-500" />
                        Tech Stack / Tools
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(formData.skills?.techStack || []).map((tool, index) => (
                            <div key={index} className="bg-black/20 p-4 rounded-xl border border-white/5 relative group">
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500">Name</label>
                                        <input
                                            type="text"
                                            value={tool.name}
                                            onChange={(e) => {
                                                const newStack = [...formData.skills.techStack];
                                                newStack[index].name = e.target.value;
                                                setFormData(prev => ({ ...prev, skills: { ...prev.skills, techStack: newStack } }));
                                            }}
                                            className="w-full bg-transparent text-white text-sm font-medium focus:outline-none border-b border-white/10 focus:border-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500">Icon (Lucide Name)</label>
                                        <input
                                            type="text"
                                            value={tool.icon}
                                            onChange={(e) => {
                                                const newStack = [...formData.skills.techStack];
                                                newStack[index].icon = e.target.value;
                                                setFormData(prev => ({ ...prev, skills: { ...prev.skills, techStack: newStack } }));
                                            }}
                                            className="w-full bg-transparent text-gray-400 text-xs font-mono focus:outline-none border-b border-white/10 focus:border-emerald-500"
                                            placeholder="e.g. Database"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        const newStack = formData.skills.techStack.filter((_, i) => i !== index);
                                        setFormData(prev => ({ ...prev, skills: { ...prev.skills, techStack: newStack } }));
                                    }}
                                    className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-black/50 rounded"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => {
                                const newStack = [...(formData.skills?.techStack || []), { id: Date.now(), name: "New Tool", icon: "Code2" }];
                                setFormData(prev => ({ ...prev, skills: { ...prev.skills, techStack: newStack } }));
                            }}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 border-dashed rounded-xl p-4 flex items-center justify-center gap-2 font-medium transition-all"
                        >
                            + Add Tool
                        </button>
                    </div>
                </div>

                {/* Focus Area Description */}
                <div className="mt-8 pt-6 border-t border-white/5">
                    <h4 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
                        <User size={18} className="text-emerald-500" />
                        Focus Area Description
                    </h4>
                    <textarea
                        rows="2"
                        value={formData.skills?.focusArea || ""}
                        onChange={(e) => {
                            setFormData(prev => ({ ...prev, skills: { ...prev.skills, focusArea: e.target.value } }));
                        }}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all resize-none"
                        placeholder="Describe your main focus area..."
                    ></textarea>
                </div>
            </div>

            {/* Social Media Section */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-xl mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Social Media & Contact</h3>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                        Toggle visibility for public site
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div className="p-5 bg-black/20 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-emerald-400 transition-colors">Phone (CV Only)</label>
                            <button
                                onClick={() => setFormData(prev => ({ ...prev, socialVisibility: { ...prev.socialVisibility, phone: !prev.socialVisibility?.phone } }))}
                                className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${formData.socialVisibility?.phone ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${formData.socialVisibility?.phone ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleChange}
                            className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                            placeholder="+91..."
                        />
                    </div>

                    {[
                        { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/...' },
                        { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
                        { key: 'github', label: 'GitHub', placeholder: 'https://github.com/...' },
                        { key: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/...' },
                        { key: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' }
                    ].map((social) => (
                        <div key={social.key} className="p-5 bg-black/20 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-emerald-400 transition-colors">{social.label}</label>
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, socialVisibility: { ...prev.socialVisibility, [social.key]: !prev.socialVisibility?.[social.key] } }))}
                                    className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${formData.socialVisibility?.[social.key] ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${formData.socialVisibility?.[social.key] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                            <input
                                type={social.type || "text"}
                                value={formData.socialLinks?.[social.key] || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [social.key]: e.target.value } }))}
                                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                                placeholder={social.placeholder}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* CV Mode Toggle */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-xl mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">CV Generation System</h3>
                    <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
                        <button
                            onClick={() => setCvMode("manual")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${cvMode === "manual" ? "bg-emerald-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                        >
                            Manual PDF
                        </button>
                        <button
                            onClick={() => setCvMode("auto")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${cvMode === "auto" ? "bg-emerald-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                        >
                            Auto-Generate
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-black/20 rounded-xl border border-white/5">
                    {cvMode === "manual" ? (
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-1">
                                <h4 className="font-bold text-white mb-2">Upload Custom PDF</h4>
                                <p className="text-gray-400 text-sm">Upload your existing resume design. This exact file will be served to users.</p>
                                {cvUploadError && <p className="text-red-400 text-xs mt-2">{cvUploadError}</p>}
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-6 py-3 rounded-xl cursor-pointer border border-emerald-500/20 transition-all font-medium">
                                    <Upload size={20} />
                                    <span>{manualCV ? "Update PDF" : "Select PDF"}</span>
                                    <input type="file" accept="application/pdf" onChange={handleCVUpload} className="hidden" />
                                </label>
                                {isCvUploading && <Loader2 className="animate-spin text-emerald-500" size={24} />}
                                {manualCV && !isCvUploading && <span className="text-emerald-500 text-sm font-bold bg-emerald-500/10 px-3 py-1 rounded-full">✓ Ready</span>}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 text-emerald-400">
                            <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                <Loader2 size={24} className="animate-spin-slow" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Auto-Generation Active</h4>
                                <p className="text-emerald-400/70 text-sm">System will compile your Profile + Projects + Experience into a perfect ATS-friendly PDF.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Developer Mode */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-xl mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Developer Mode</h3>
                        <p className="text-gray-400 text-sm">
                            Disables content protection (Right-Click, Inspect Element) for debugging.
                            <br />
                            <span className="text-yellow-500 text-xs"> Automatically disables on logout.</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {devMode && (
                            <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded border border-yellow-500/20 animate-pulse">
                                Active
                            </span>
                        )}
                        <button
                            onClick={toggleDevMode}
                            className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${devMode ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                        >
                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${devMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Password Change Section */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-xl mb-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                    <Lock size={20} className="text-emerald-500" />
                    <span>Security</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                        <input
                            type="password"
                            value={passwords.new}
                            onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                        />
                    </div>
                </div>
                {passwordMsg && <p className={`text-sm mt-4 font-bold ${passwordMsg.includes("successfully") ? "text-emerald-400" : "text-yellow-400"}`}>{passwordMsg}</p>}
                <div className="mt-6">
                    <button
                        onClick={handlePasswordChange}
                        disabled={!passwords.new}
                        className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl border border-white/10 transition-all text-sm font-medium disabled:opacity-50 hover:border-white/20"
                    >
                        Update Password
                    </button>
                </div>
            </div>

            {/* Cropper Modal */}
            <AnimatePresence>
                {isCropperOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-zinc-900 w-full max-w-lg rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                        >
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h3 className="font-bold text-white">Crop Profile Photo</h3>
                                <button onClick={() => setIsCropperOpen(false)}><X className="text-gray-400 hover:text-white" /></button>
                            </div>
                            <div className="relative h-80 w-full bg-black">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                            <div className="p-6 flex flex-col gap-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Zoom Level</label>
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        aria-labelledby="Zoom"
                                        onChange={(e) => setZoom(e.target.value)}
                                        className="w-full accent-emerald-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                                <button
                                    onClick={showCroppedImage}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
                                >
                                    Set Profile Image
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

// Helpers
function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result), false);
        reader.readAsDataURL(file);
    });
}

async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg');
}

async function createImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });
}

export default Settings;
