import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Copy, 
  Check, 
  User, 
  MessageSquare, 
  Play, 
  Square, 
  ExternalLink, 
  Calendar,
  ArrowLeft,
  X,
  FileDown,
  Loader2
} from 'lucide-react';
import BriefResults from './BriefResults';
import { exportBriefAsPDF } from '../utils/pdfExport';

const BriefDetail = ({ brief, onClose, onBack }) => {
  const [copiedSection, setCopiedSection] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const copyToClipboard = async (text, section) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      toast.success(`${section} copied to clipboard!`);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      await exportBriefAsPDF(brief);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!brief) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Back to list"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold">Brief Details</h2>
              <p className="text-blue-100 text-sm">Viewing brief for {brief.guestName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export as PDF"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Exporting...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span className="text-sm">Export PDF</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6">
            <BriefResults 
              brief={brief} 
              onCopy={copyToClipboard}
              copiedSection={copiedSection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefDetail; 