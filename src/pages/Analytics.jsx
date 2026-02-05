import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, Download, MousePointerClick, Smartphone, Monitor } from 'lucide-react';

const Card = ({ title, value, icon: Icon, color }) => (
    <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-400 text-sm mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-500`}>
                <Icon size={24} />
            </div>
        </div>
    </div>
);

const Analytics = () => {
    const { stats, projects } = usePortfolio();

    // Mock Data for Trends (Since we don't have historical data stored yet)
    // In future, you would store daily snapshots in Firebase
    const visitorData = [
        { name: 'Mon', visits: 45 },
        { name: 'Tue', visits: 52 },
        { name: 'Wed', visits: 38 },
        { name: 'Thu', visits: 65 },
        { name: 'Fri', visits: 48 },
        { name: 'Sat', visits: 29 },
        { name: 'Sun', visits: 34 },
    ];

    const deviceData = [
        { name: 'Desktop', value: 65, color: '#10b981' }, // Emerald
        { name: 'Mobile', value: 35, color: '#3b82f6' },  // Blue
    ];

    // Project Engagement Mock
    const projectData = (projects || []).map(p => ({
        name: p.title ? (p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title) : 'Untitled',
        clicks: Math.floor(Math.random() * 50) + 10 // Mock Clicks
    }));

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Total Views" value={stats?.views || 0} icon={Users} color="emerald" />
                <Card title="CV Downloads" value={stats?.cvDownloads || 0} icon={Download} color="blue" />
                <Card title="Project Clicks" value="342" icon={MousePointerClick} color="purple" />
                <Card title="Avg. Time" value="2m 15s" icon={Monitor} color="orange" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visitor Trend */}
                <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-white mb-6">Visitor Trends (Last 7 Days)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={visitorData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="visits" stroke="#10b981" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Device Type */}
                <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-white mb-6">Device Usage</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={deviceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2: Projects */}
            <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-6">Project Engagement</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={projectData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip
                                cursor={{ fill: '#333' }}
                                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333' }}
                            />
                            <Bar dataKey="clicks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
