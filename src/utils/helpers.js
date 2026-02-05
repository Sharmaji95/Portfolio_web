import DOMPurify from 'dompurify'; // User should install this, but for now I will use comprehensive regex/basic encoding if I can't run install command on their behalf for new packages without asking.
// Actually, user rules say I can run commands. But I'd rather avoid adding heavy deps if simple works.
// Requirement: "Implement 'Input Sanitization'".
// I will use a custom sanitizer helper to avoid dependency bloat for this simple case unless DOMPurify is preferred.
// Given "Web Application Development" context, installing a package is safer.

export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

export const maskPhoneNumber = (phone) => {
    if (!phone) return "";
    // Returns a link that only constructs the full number on click/interaction implicitly via href, 
    // but for visual masking:
    // "98765 43210" -> "98*** **210"
    return phone.replace(/(\d{2})\d+(\d{3})/, "$1*****$2");
};

// Hook for masking WhatsApp link generation
export const generateWhatsAppLink = (phone) => {
    if (!phone) return "#";
    // dynamic generation is just returning the link, but putting it in a function makes it cleaner
    const cleanNumber = phone.replace(/[^\d]/g, '');
    return `https://wa.me/${cleanNumber}`;
};
