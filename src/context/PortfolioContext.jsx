import { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const PortfolioContext = createContext();

export const usePortfolio = () => useContext(PortfolioContext);

const PortfolioProvider = ({ children }) => {
    // --- Global State ---

    // Authentication State
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Global Data Loading State (prevents showing demo data on first load)
    const [isLoadingData, setIsLoadingData] = useState(() => {
        return !localStorage.getItem('portfolio_profile');
    });

    // Monitor Auth State
    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // --- Actions ---
    const login = async (email, password) => {
        if (!auth) {
            console.error("Firebase auth not initialized");
            // Fallback for demo if no firebase
            if (password === "admin123") {
                setUser({ email: "demo@admin.com" });
                return true;
            }
            return false;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = async () => {
        if (auth) {
            await signOut(auth);
        } else {
            setUser(null);
        }
    };

    const isAuthenticated = !!user;

    // Profile Data
    const [profile, setProfile] = useState(() => {
        try {
            const saved = localStorage.getItem('portfolio_profile');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse profile data", e);
        }
        return {
            name: "SharmaJi",
            title: "Senior Data Analyst",
            // ... keeping existing default values ...
            bio: "Turning complex data into actionable business insights. I help companies save money and optimize performance through advanced analytics.",
            yearsOfExperience: "4+",
            metric2: { label: "Dashboards Built", value: "50+" },
            metric3: { label: "Model Accuracy", value: "95%" },
            photo: null,
            roles: ["Data Analyst", "Business Intelligence", "Python Developer", "Data Storyteller"],
            phone: "+91 98765 43210",
            socialLinks: {
                linkedin: "",
                github: "",
                twitter: "",
                email: "hello@example.com",
                whatsapp: ""
            },
            socialVisibility: {
                linkedin: true,
                github: true,
                twitter: true,
                email: true,
                whatsapp: true,
                phone: false
            },
            favicon: ""
        };
    });


    // Projects Data
    const [projects, setProjects] = useState(() => {
        try {
            const saved = localStorage.getItem('portfolio_projects');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse projects data", e);
        }
        return [
            {
                id: 1,
                title: "Retail Sales Optimization",
                category: "Tableau & SQL",
                status: "Active",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
                impact: "Reduced Inventory Cost by 15%",
                tools: ["Tableau", "SQL", "Python"],
                challenge: "The client faced overstocking issues leading to high warehousing costs and waste.",
                solution: "Developed a predictive inventory model using Python and visualized demand forecasts in interactive Tableau dashboards.",
                result: "Achieved a 15% reduction in carrying costs and improved stock turnover ratio by 20% in Q3."
            },
            {
                id: 2,
                title: "Customer Churn Predictor",
                category: "Machine Learning",
                status: "Active",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop",
                impact: "Saved $50k Annually",
                tools: ["Python", "Scikit-Learn", "Streamlit"],
                challenge: "High churn rate in the subscription model was impacting monthly recurring revenue.",
                solution: "Built a Random Forest Classifier to identify at-risk customers with 85% accuracy and deployed a Streamlit app for the sales team.",
                result: "Proactive retention strategies based on the model saved an estimated $50k in annual revenue."
            },
            {
                id: 3,
                title: "Marketing Campaign ROI",
                category: "PowerBI",
                status: "Active",
                image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2340&auto=format&fit=crop",
                impact: "Increased ROI by 12%",
                tools: ["PowerBI", "DAX", "SQL"],
                challenge: "Marketing spend was inefficiently allocated across channels with no clear visibility on returns.",
                solution: "Consolidated ad data into a Data Warehouse and created real-time PowerBI reports tracking CPA and ROAS.",
                result: "Optimized ad spend allocation led to a 12% increase in overall ROI within 2 months."
            }
        ];
    });

    // Skills State
    const [skills, setSkills] = useState(() => {
        try {
            const saved = localStorage.getItem('portfolio_skills');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse skills data", e);
        }
        return {
            radar: [
                { subject: "Python", A: 90, fullMark: 100 },
                { subject: "SQL", A: 95, fullMark: 100 },
                { subject: "Tableau", A: 85, fullMark: 100 },
                { subject: "PowerBI", A: 80, fullMark: 100 },
                { subject: "Excel", A: 98, fullMark: 100 },
                { subject: "ML", A: 75, fullMark: 100 },
            ],
            techStack: [
                { id: 1, name: "Python", icon: "Terminal" },
                { id: 2, name: "SQL", icon: "Database" },
                { id: 3, name: "Tableau", icon: "PieChart" },
                { id: 4, name: "PowerBI", icon: "BarChart3" },
                { id: 5, name: "Excel", icon: "FileSpreadsheet" },
                { id: 6, name: "Pandas", icon: "Code2" },
                { id: 7, name: "Scikit-Learn", icon: "BrainCircuit" },
                { id: 8, name: "Streamlit", icon: "Globe" },
            ],
            focusArea: "Specializing in predictive modeling and automated reporting pipelines using Python & SQL."
        };
    });

    // Testimonials State
    const [testimonials, setTestimonials] = useState(() => {
        try {
            const saved = localStorage.getItem('portfolio_testimonials');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse testimonials data", e);
        }
        return [
            {
                id: 1,
                text: "The sales dashboard Vinay built helped us identify a $50k leak in our inventory process. His insights are always actionable and precise.",
                author: "Sarah Johnson",
                role: "Director of Ops, RetailCorp"
            },
            {
                id: 2,
                text: "We needed a complex predictive model for customer churn. Vinay delivered a solution that improved our retention by 15% in just one quarter.",
                author: "David Chen",
                role: "CEO, TechFlow Strategies"
            },
            {
                id: 3,
                text: "Incredible attention to detail. He doesn't just present data; he tells a story that makes decision-making easy for our non-technical stakeholders.",
                author: "Amanda Williams",
                role: "VP Marketing, GrowthInc"
            },
            {
                id: 4,
                text: "Fast, reliable, and technically brilliant. The automated reporting pipeline he set up saves us 10 hours of manual work every week.",
                author: "Michael Brown",
                role: "Head of Analytics, FinTech Solutions"
            }
        ];
    });

    // Experience State
    const [experiences, setExperiences] = useState(() => {
        try {
            const saved = localStorage.getItem('portfolio_experiences');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse experience data", e);
        }
        return [
            {
                id: 1,
                role: "Senior Data Analyst",
                company: "TechFlow Strategies",
                period: "2023 - Present",
                description: "Leading a team of 3 analysts to drive data-driven decision making across the organization. Implemented automated reporting pipelines reducing manual work by 40%."
            },
            {
                id: 2,
                role: "Data Analyst",
                company: "RetailCorp Inc.",
                period: "2021 - 2023",
                description: "Developed and maintained interactive dashboards in Tableau for tracking sales performance and inventory levels. Optimized SQL queries for 30% faster data retrieval."
            },
            {
                id: 3,
                role: "Junior Data Analyst",
                company: "StartUp Solutions",
                period: "2019 - 2021",
                description: "Assisted in data cleaning and preprocessing for predictive modeling projects. Created monthly performance reports for key stakeholders."
            }
        ];
    });

    // Education State
    const [education, setEducation] = useState(() => {
        try {
            const saved = localStorage.getItem('portfolio_education');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse education data", e);
        }
        return [
            {
                id: 1,
                degree: "Master of Science in Data Science",
                institution: "Tech University",
                period: "2018 - 2020",
                description: "Specialized in Machine Learning and Big Data Analytics. Thesis on Predictive Maintenance using IoT data."
            },
            {
                id: 2,
                degree: "Bachelor of Technology in Computer Science",
                institution: "State Engineering College",
                period: "2014 - 2018",
                description: "Graduated with Honors. Core coursework in Algorithms, Database Management Systems, and Statistics."
            },
            {
                id: 3,
                degree: "Google Data Analytics Professional Certificate",
                institution: "Coursera",
                period: "2021",
                description: "Comprehensive curriculum covering SQL, R, Tableau, and data analysis phases."
            }
        ];
    });

    // Messages State
    const [messages, setMessages] = useState(() => {
        try {
            const saved = localStorage.getItem('portfolio_messages');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse messages data", e);
        }
        return [
            {
                id: 1,
                name: "John Does",
                email: "john@example.com",
                subject: "Project Inquiry",
                message: "Hi, I saw your portfolio and would like to discuss a potential project.",
                date: "2024-02-14",
                read: false
            }
        ];
    });

    // Site Stats (Views, Downloads)
    const [stats, setStats] = useState(() => {
        try {
            const saved = localStorage.getItem('portfolio_stats');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse stats data", e);
        }
        return {
            views: 1240,
            cvDownloads: 45
        };
    });



    // Custom AI Q&A State
    const [customQnA, setCustomQnA] = useState(() => {
        try {
            const saved = localStorage.getItem('portfolio_ai_qna');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse custom Q&A data", e);
        }
        return [
            { id: 1, question: "What is your hourly rate?", answer: "My hourly rate depends on the project complexity, generally ranging between $50 - $100/hr." },
            { id: 2, question: "Are you available for freelance?", answer: "Yes! I am currently open to freelance opportunities." }
        ];
    });

    // Live Analysis State
    const [liveAnalysis, setLiveAnalysis] = useState(() => {
        try {
            const saved = localStorage.getItem('portfolio_live_analysis');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse live analysis data", e);
        }
        return {
            title: "Live Analysis",
            description: "Interact with a real-time Tableau dashboard embedded below.",
            videoUrl: "", // Optional video/iframe URL
            imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop", // Fallback/Thumbnail
            tableauUrl: "", // The actual embed URL
            metrics: [
                { id: 1, label: "Total Sales", value: "$2.4M" },
                { id: 2, label: "Growth", value: "+12%" }
            ]
        };
    });

    // Section Visibility State
    const [sectionVisibility, setSectionVisibility] = useState(() => {
        try {
            const saved = localStorage.getItem('portfolio_section_visibility');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse section visibility data", e);
        }
        return {
            hero: true,
            metrics: true,
            skills: true,
            experience: true,
            education: true,
            projects: true,
            dashboard: true,
            testimonials: true,
            contact: true, // Footer
            aiAssistant: true
        };
    });


    // --- Effects to Save to LocalStorage & Firebase ---
    useEffect(() => {
        // Shared save function
        const saveData = async (collectionName, data) => {
            localStorage.setItem(`portfolio_${collectionName}`, JSON.stringify(data));
            if (db && user) { // Only write to DB if authenticated
                try {
                    await setDoc(doc(db, "portfolio", collectionName), { data });
                } catch (e) {
                    console.error(`Error saving ${collectionName} to Firebase:`, e);
                }
            }
        };

        saveData('profile', profile);
    }, [profile, user]);

    useEffect(() => {
        const saveData = async () => {
            localStorage.setItem('portfolio_projects', JSON.stringify(projects));
            if (db) await setDoc(doc(db, "portfolio", "projects"), { data: projects });
        };
        saveData();
    }, [projects]);



    useEffect(() => {
        const saveData = async () => {
            localStorage.setItem('portfolio_experiences', JSON.stringify(experiences));
            if (db) await setDoc(doc(db, "portfolio", "experiences"), { data: experiences });
        };
        saveData();
    }, [experiences]);

    useEffect(() => {
        const saveData = async () => {
            localStorage.setItem('portfolio_education', JSON.stringify(education));
            if (db) await setDoc(doc(db, "portfolio", "education"), { data: education });
        };
        saveData();
    }, [education]);

    useEffect(() => {
        const saveData = async () => {
            localStorage.setItem('portfolio_messages', JSON.stringify(messages));
            if (db) await setDoc(doc(db, "portfolio", "messages"), { data: messages });
        };
        saveData();
    }, [messages]);

    useEffect(() => {
        const saveData = async () => {
            localStorage.setItem('portfolio_stats', JSON.stringify(stats));
            if (db) await setDoc(doc(db, "portfolio", "stats"), { data: stats });
        };
        saveData();
    }, [stats]);

    useEffect(() => {
        const saveData = async () => {
            localStorage.setItem('portfolio_skills', JSON.stringify(skills));
            if (db) await setDoc(doc(db, "portfolio", "skills"), { data: skills });
        };
        saveData();
    }, [skills]);

    useEffect(() => {
        const saveData = async () => {
            localStorage.setItem('portfolio_ai_qna', JSON.stringify(customQnA));
            if (db) await setDoc(doc(db, "portfolio", "qna"), { data: customQnA });
        };
        saveData();
    }, [customQnA]);

    useEffect(() => {
        const saveData = async () => {
            localStorage.setItem('portfolio_live_analysis', JSON.stringify(liveAnalysis));
            if (db) await setDoc(doc(db, "portfolio", "liveAnalysis"), { data: liveAnalysis });
        };
        saveData();
    }, [liveAnalysis]);

    useEffect(() => {
        const saveData = async () => {
            localStorage.setItem('portfolio_section_visibility', JSON.stringify(sectionVisibility));
            if (db) await setDoc(doc(db, "portfolio", "sectionVisibility"), { data: sectionVisibility });
        };
        saveData();
    }, [sectionVisibility]);


    // --- Realtime Data Sync (onSnapshot) ---
    useEffect(() => {
        if (!db) {
            setIsLoadingData(false);
            return;
        }

        console.log("Setting up realtime listeners...");
        const collections = [
            { name: 'profile', setter: setProfile },
            { name: 'projects', setter: setProjects },
            { name: 'skills', setter: setSkills },
            { name: 'experiences', setter: setExperiences },
            { name: 'education', setter: setEducation },
            { name: 'messages', setter: setMessages },
            { name: 'stats', setter: setStats },
            { name: 'qna', setter: setCustomQnA },
            { name: 'liveAnalysis', setter: setLiveAnalysis },
            { name: 'sectionVisibility', setter: setSectionVisibility }
        ];

        const unsubscribes = collections.map(col => {
            return onSnapshot(doc(db, "portfolio", col.name), (docSnap) => {
                if (docSnap.exists()) {
                    const savedData = docSnap.data().data;
                    if (savedData) {
                        console.log(`Realtime Update: ${col.name}`);
                        col.setter(savedData);
                    }
                }
            }, (error) => {
                console.error(`Listener failed for ${col.name}:`, error);
            });
        });

        // Add a small delay to allow listeners to fire before dismissing loading screen
        setTimeout(() => setIsLoadingData(false), 2000);

        return () => {
            console.log("Cleaning up listeners...");
            unsubscribes.forEach(unsub => unsub());
        };
    }, []);

    // --- Actions --- (Data actions only, auth actions moved up)

    // ... data actions ... (kept implicitly by not selecting them for replacement, but I need to be careful with the range)

    const updateProfile = (newData) => {
        setProfile(prev => ({ ...prev, ...newData }));
    };

    const updateSkills = (newSkills) => {
        setSkills(newSkills);
    };



    const addProject = (project) => {
        const newProject = { ...project, id: Date.now() };
        setProjects([...projects, newProject]);
    };

    const updateProject = (id, updatedData) => {
        setProjects(projects.map(p => p.id === id ? { ...p, ...updatedData } : p));
    };

    const deleteProject = (id) => {
        setProjects(projects.filter(p => p.id !== id));
    };

    const addTestimonial = (testimonial) => {
        setTestimonials(prev => [...prev, { ...testimonial, id: Date.now() }]);
    };

    const updateTestimonial = (id, updatedTestimonial) => {
        setTestimonials(prev => prev.map(t => t.id === id ? { ...updatedTestimonial, id } : t));
    };

    const deleteTestimonial = (id) => {
        setTestimonials(prev => prev.filter(t => t.id !== id));
    };

    const addExperience = (experience) => {
        setExperiences(prev => [...prev, { ...experience, id: Date.now() }]);
    };

    const updateExperience = (id, updatedExperience) => {
        setExperiences(prev => prev.map(e => e.id === id ? { ...updatedExperience, id } : e));
    };

    const deleteExperience = (id) => {
        setExperiences(prev => prev.filter(e => e.id !== id));
    };

    const addEducation = (edu) => {
        setEducation(prev => [...prev, { ...edu, id: Date.now() }]);
    };

    const updateEducation = (id, updatedEdu) => {
        setEducation(prev => prev.map(e => e.id === id ? { ...updatedEdu, id } : e));
    };

    const deleteEducation = (id) => {
        setEducation(prev => prev.filter(e => e.id !== id));
    };

    // Message Actions
    const addMessage = (msg) => {
        const newMessage = {
            ...msg,
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            read: false
        };
        setMessages(prev => [newMessage, ...prev]);
    };

    const markMessageRead = (id) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    };

    const deleteMessage = (id) => {
        setMessages(prev => prev.filter(m => m.id !== id));
    };

    // Stat Actions
    const incrementStats = (type) => { // type: 'views' | 'cvDownloads'
        setStats(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
    };

    // Custom AI Q&A Actions
    const addQnA = (item) => {
        setCustomQnA(prev => [...prev, { ...item, id: Date.now() }]);
    };

    const updateQnA = (id, updatedItem) => {
        setCustomQnA(prev => prev.map(item => item.id === id ? { ...updatedItem, id } : item));
    };

    const deleteQnA = (id) => {
        setCustomQnA(prev => prev.filter(item => item.id !== id));
    };

    // Live Analysis Actions
    const updateLiveAnalysis = (newData) => {
        setLiveAnalysis(prev => ({ ...prev, ...newData }));
    };

    // Section Visibility Actions
    const toggleSectionVisibility = (sectionId) => {
        setSectionVisibility(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
    };


    return (
        <PortfolioContext.Provider value={{
            profile, projects, testimonials, experiences, education, messages, stats, isAuthenticated,
            isLoadingData,
            login, logout, updateProfile, addProject, updateProject, deleteProject,
            addTestimonial, updateTestimonial, deleteTestimonial,
            addExperience, updateExperience, deleteExperience,
            addEducation, updateEducation, deleteEducation,
            addMessage, deleteMessage, markMessageRead, incrementStats,
            skills, updateSkills,
            customQnA, addQnA, updateQnA, deleteQnA,
            liveAnalysis, updateLiveAnalysis,
            sectionVisibility, toggleSectionVisibility
        }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export default PortfolioProvider;
