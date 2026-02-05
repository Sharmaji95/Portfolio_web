import { PDFDownloadLink } from '@react-pdf/renderer';
import CVDocument from './CVDocument';
import { Download, FileText } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

const CVDownloadButton = () => {
    const { profile, projects, experiences, education, incrementStats } = usePortfolio();

    const handleDownload = () => {
        incrementStats('cvDownloads');
    };

    // Handle Manual CV Mode
    if (profile.cvMode === 'manual' && profile.manualCV) {
        return (
            <a
                href={profile.manualCV}
                download={`${profile.name.replace(/\s+/g, '_')}_CV.pdf`}
                onClick={handleDownload}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-emerald-500/20"
            >
                <FileText size={20} />
                <span>Download My CV</span>
            </a>
        );
    }

    // Auto-Generate Mode
    return (
        <PDFDownloadLink document={<CVDocument profile={profile} projects={projects} experiences={experiences} education={education} />} fileName={`${profile.name.replace(/\s+/g, '_')}_Generated_CV.pdf`}>
            {({ blob, url, loading, error }) => (
                <button
                    disabled={loading}
                    onClick={handleDownload}
                    className={`flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-emerald-500/20 ${loading ? 'opacity-75 cursor-wait' : ''}`}
                >
                    <Download size={20} />
                    <span>{loading ? 'Generating CV...' : 'Download My CV'}</span>
                </button>
            )}
        </PDFDownloadLink>
    );
};

export default CVDownloadButton;
