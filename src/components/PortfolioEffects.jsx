import { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { generateFavicon } from '../utils/faviconGenerator';

const PortfolioEffects = () => {
    const { profile } = usePortfolio();

    useEffect(() => {
        if (!profile) return;

        // 1. Update Page Title
        document.title = profile.name || "Portfolio";

        // 2. Update Favicon
        const updateFavicon = async () => {
            const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);

            let iconData = null;

            if (profile.favicon) {
                // Try to generate circular custom image
                iconData = await generateFavicon('image', profile.favicon);
            }

            if (!iconData) {
                // Fallback to default 'P'
                iconData = await generateFavicon('letter', 'P');
            }

            if (iconData) {
                link.href = iconData;
            }
        };

        updateFavicon();

    }, [profile?.name, profile?.favicon]);



    return null; // This component renders nothing, just handles side effects
};

export default PortfolioEffects;
