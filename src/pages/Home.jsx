import Navbar from '../components/Layout/Navbar'
import Footer from '../components/Layout/Footer'
import Hero from '../components/Sections/Hero'
import Metrics from '../components/Sections/Metrics'
import Skills from '../components/Sections/Skills'
import Projects from '../components/Sections/Projects'
import Dashboard from '../components/Sections/Dashboard'
import Experience from '../components/Sections/Experience'
import Education from '../components/Sections/Education'
import Testimonials from '../components/Sections/Testimonials'
import AIAssistant from '../components/Sections/AIAssistant'
import { useEffect } from 'react'
import { usePortfolio } from '../context/PortfolioContext'

const Home = () => {
    const { incrementStats, sectionVisibility } = usePortfolio();
    // Default to true if context not ready yet (prevents flash of empty)
    const show = sectionVisibility || { hero: true, metrics: true, skills: true, experience: true, education: true, projects: true, dashboard: true, testimonials: true, contact: true, aiAssistant: true };

    useEffect(() => {
        // Track unique view (simple session storage check to avoid spamming on reload, or just raw hits)
        const hasViewed = sessionStorage.getItem('hasViewedPortfolio');
        if (!hasViewed) {
            incrementStats('views');
            sessionStorage.setItem('hasViewedPortfolio', 'true');
        }
    }, [incrementStats]); // Added dependency

    return (
        <div className="min-h-screen bg-deep-charcoal text-white font-sans selection:bg-emerald-green selection:text-white">
            <Navbar />
            {show.hero && <Hero />}
            {show.metrics && <Metrics />}
            {show.skills && <Skills />}
            {show.experience && <Experience />}
            {show.education && <Education />}
            {show.projects && <Projects />}
            {show.dashboard && <Dashboard />}
            {show.testimonials && <Testimonials />}
            {show.contact && <Footer />}
            {show.aiAssistant && <AIAssistant />}
        </div>
    )
}

export default Home;
