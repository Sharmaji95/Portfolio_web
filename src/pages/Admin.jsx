import { useState } from "react";
import AdminLayout from "../components/Admin/AdminLayout";
import { Lock } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

import { toast } from "react-hot-toast";

const Admin = () => {
    const { isAuthenticated, login, loading } = usePortfolio();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState("dashboard");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            toast.success("Welcome back, Admin!");
        } catch (err) {
            console.error(err);
            setError(err.message || "Login Failed");
            toast.error("Login Failed: " + err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-deep-charcoal flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-deep-charcoal flex items-center justify-center px-4">
                <div className="glass p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl">
                    <div className="flex justify-center mb-6 text-emerald-500">
                        <Lock size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-white mb-6">Admin Access</h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="Admin Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-gray-500"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-gray-500"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors">
                            Unlock Dashboard
                        </button>
                    </form>
                    <p className="text-center text-gray-500 text-xs mt-4">Protected Area. Authorized Personnel Only.</p>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} />
    );
};

export default Admin;
