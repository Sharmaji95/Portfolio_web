import { useEffect } from 'react';

const ContentProtection = () => {
    useEffect(() => {
        // 1. Disable Right Click
        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        // 2. Disable Keyboard Shortcuts (Ctrl+C, Ctrl+U, F12, Ctrl+Shift+I)
        const handleKeyDown = (e) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.key === 'u') ||
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.metaKey && e.shiftKey && e.key === 'I') || // Mac
                (e.metaKey && e.altKey && e.key === 'u') // Mac sometimes
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
    }, []);

    return null; // Logic only component
};

export default ContentProtection;
