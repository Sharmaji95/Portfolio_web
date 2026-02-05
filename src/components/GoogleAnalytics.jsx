import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Replace with your Measurement ID
// const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; 

const GoogleAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        // Only run if GA ID is present in environment or hardcoded
        const gaId = import.meta.env.VITE_GA_ID;

        if (gaId && typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('config', gaId, {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);

    return null;
};

// Helper to initialize script in index.html or here
export const initGA = (id) => {
    if (!id) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', id);
};

export default GoogleAnalytics;
