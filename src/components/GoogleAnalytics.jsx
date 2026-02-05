import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const GoogleAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        // Initialize GA4
        const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
        if (gaId) {
            ReactGA.initialize(gaId);
            console.log("GA4 Initialized with ID:", gaId);
        } else {
            console.warn("GA4 Measurement ID missing (VITE_GA_MEASUREMENT_ID). Analytics disabled.");
        }
    }, []);

    useEffect(() => {
        // Track Page View
        const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
        if (gaId) {
            ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
        }
    }, [location]);

    return null;
};

export default GoogleAnalytics;
