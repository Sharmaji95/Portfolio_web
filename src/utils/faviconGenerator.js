/**
 * Generates a circular favicon data URI.
 * @param {string} type - 'image' or 'letter'
 * @param {string} source - Image URL or Letter string
 * @returns {Promise<string>} - Base64 Data URI of the icon
 */
export const generateFavicon = async (type, source) => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        // Helper to draw circle container
        const drawContainer = () => {
            ctx.beginPath();
            ctx.arc(32, 32, 32, 0, 2 * Math.PI);
            ctx.closePath();
        };

        if (type === 'letter') {
            // Background
            drawContainer();
            ctx.fillStyle = '#10b981'; // Emerald-500
            ctx.fill();

            // Letter
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 40px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(source.charAt(0).toUpperCase(), 32, 34); // slight y-offset for visual center
            resolve(canvas.toDataURL('image/png'));
        }
        else if (type === 'image') {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = source;

            img.onload = () => {
                // Clip to circle
                drawContainer();
                ctx.clip();

                // Draw image covering the canvas (cover fit)
                const aspect = img.width / img.height;
                let drawWidth = 64;
                let drawHeight = 64;
                let offsetX = 0;
                let offsetY = 0;

                if (aspect > 1) {
                    drawWidth = 64 * aspect;
                    offsetX = -(drawWidth - 64) / 2;
                } else {
                    drawHeight = 64 / aspect;
                    offsetY = -(drawHeight - 64) / 2;
                }

                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                resolve(canvas.toDataURL('image/png'));
            };

            img.onerror = () => {
                console.warn("Favicon image failed to load, falling back to letter.");
                // Fallback to default if image fails
                resolve(null);
            };
        }
    });
};
