import { useEffect } from "react";
import { Eye, Download, MessageSquare, TrendingUp, Briefcase } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

const DashboardStats = () => {
    const { stats, messages, projects } = usePortfolio();

    const dashboardStats = [
        { label: "Total Views", value: stats.views.toLocaleString(), change: "+12%", icon: <Eye size={24} />, color: "bg-blue-500/10 text-blue-400" },
        { label: "CV Downloads", value: stats.cvDownloads.toString(), change: "+5%", icon: <Download size={24} />, color: "bg-emerald-500/10 text-emerald-400" },
        { label: "Messages", value: messages.length.toString(), change: `+${messages.filter(m => !m.read).length} new`, icon: <MessageSquare size={24} />, color: "bg-purple-500/10 text-purple-400" },
        { label: "Active Projects", value: projects.length.toString(), change: "Live", icon: <Briefcase size={24} />, color: "bg-orange-500/10 text-orange-400" },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, index) => (
                    <div key={index} className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 hover:bg-zinc-800/50 hover:shadow-xl hover:shadow-emerald-500/10 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            {stat.icon}
                        </div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                {stat.icon}
                            </div>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20 backdrop-blur-sm">
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1 tracking-tight relative z-10">{stat.value}</h3>
                        <p className="text-gray-400 text-sm font-medium relative z-10">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Simulated Activity Chart */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-md border border-white/5 p-8 rounded-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Engagement Analytics</h3>
                        <select className="bg-black/30 border border-white/10 rounded-lg px-3 py-1 text-xs text-gray-400 focus:outline-none">
                            <option>Last 30 Days</option>
                            <option>Last 7 Days</option>
                        </select>
                    </div>

                    {/* Fake Chart Bars */}
                    <div className="flex items-end justify-between h-64 gap-2">
                        {[40, 65, 45, 80, 55, 70, 48, 85, 60, 75, 50, 90, 65, 80, 95].map((h, i) => (
                            <div key={i} className="w-full bg-white/5 rounded-t-sm relative group/bar hover:bg-emerald-500/20 transition-colors">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-emerald-500/80 rounded-t-sm transition-all duration-1000 ease-out group-hover/bar:bg-emerald-400"
                                    style={{ height: `${h}%`, width: '100%' }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-500 font-mono">
                        <span>Feb 01</span>
                        <span>Feb 15</span>
                        <span>Feb 28</span>
                    </div>
                </div>

                {/* Quick Actions / Mini Stats */}
                <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-8 rounded-2xl flex flex-col justify-center gap-4">
                    <h3 className="text-xl font-bold text-white mb-2">System Health</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1 text-gray-400">
                                <span>API Latency</span>
                                <span className="text-emerald-400">24ms</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[20%] bg-emerald-500 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1 text-gray-400">
                                <span>Storage Used</span>
                                <span className="text-blue-400">45%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[45%] bg-blue-500 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1 text-gray-400">
                                <span>Profile Completion</span>
                                <span className="text-purple-400">92%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[92%] bg-purple-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default DashboardStats;
