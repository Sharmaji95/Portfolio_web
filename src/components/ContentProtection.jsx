import { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const ContentProtection = () => {
    const { devMode } = usePortfolio();

    useEffect(() => {
        if (devMode) return; // Disable protection in Dev Mode

        // 1. Disable Right Click
        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        // 2. Disable Keyboard Shortcuts
        const handleKeyDown = (e) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.key === 'u') ||
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.metaKey && e.shiftKey && e.key === 'I') ||
                (e.metaKey && e.altKey && e.key === 'u')
            ) {
                e.preventDefault();
                return false;
            }
        };

        // 3. Prevent Dragging Images
        const preventDrag = (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('dragstart', preventDrag);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('dragstart', preventDrag);
        };
    }, [devMode]);

    if (devMode) {
        return (
            <div className="fixed bottom-4 left-4 z-50 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse border border-yellow-600">
                ⚠️ DEV MODE ACTIVE
            </div>
        );
    }

    return null;
};

export default ContentProtection;
