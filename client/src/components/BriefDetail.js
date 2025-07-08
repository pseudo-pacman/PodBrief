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

// Show Notes Modal (to be implemented)
const ShowNotesModal = ({ open, onClose, showNotes, onCopy, onDownloadMarkdown, onDownloadPDF, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg" title="Close">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          📝 Show Notes
        </h2>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-600" />
            <span className="text-gray-500">Generating show notes...</span>
          </div>
        ) : (
          <>
            <pre className="whitespace-pre-wrap break-words bg-gray-50 rounded-lg p-4 border border-gray-100 text-gray-800 text-sm mb-4 max-h-96 overflow-auto">{showNotes}</pre>
            <div className="flex gap-3">
              <button onClick={onCopy} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">Copy</button>
              <button onClick={onDownloadMarkdown} className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">Download .md</button>
              <button onClick={onDownloadPDF} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">Download PDF</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const BriefDetail = ({ brief, onClose, onBack }) => {
  const [copiedSection, setCopiedSection] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showNotesOpen, setShowNotesOpen] = useState(false);
  const [showNotes, setShowNotes] = useState('');
  const [showNotesLoading, setShowNotesLoading] = useState(false);

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

  // Show Notes Handlers
  const handleShowNotes = async () => {
    setShowNotesOpen(true);
    setShowNotesLoading(true);
    setShowNotes('');
    try {
      const res = await fetch('/api/generate-show-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: brief.guestName,
          bio: brief.bio,
          topic: brief.guestTopic,
          questions: brief.questions,
          links: brief.guestLink ? [brief.guestLink] : []
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowNotes(data.showNotes);
        toast.success('Show notes generated!');
      } else {
        throw new Error(data.error || 'Failed to generate show notes');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to generate show notes');
      setShowNotes('');
    } finally {
      setShowNotesLoading(false);
    }
  };

  const handleCopyShowNotes = async () => {
    try {
      await navigator.clipboard.writeText(showNotes);
      toast.success('Show notes copied!');
    } catch {
      toast.error('Failed to copy show notes');
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([showNotes], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `show-notes-${brief.guestName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Markdown downloaded!');
  };

  const handleDownloadShowNotesPDF = async () => {
    try {
      setIsExporting(true);
      // Use a simple PDF export for show notes
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '40px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.color = '#333';
      tempDiv.style.lineHeight = '1.6';
      tempDiv.innerHTML = `<h1>Podcast Show Notes</h1><pre style='white-space:pre-wrap;font-size:16px;'>${showNotes.replace(/</g, '&lt;')}</pre>`;
      document.body.appendChild(tempDiv);
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true, backgroundColor: '#fff', width: 800, height: tempDiv.scrollHeight });
      document.body.removeChild(tempDiv);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdf.internal.pageSize.getHeight() - 20);
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdf.internal.pageSize.getHeight() - 20);
      }
      const filename = `show-notes-${brief.guestName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}.pdf`;
      pdf.save(filename);
      toast.success('PDF downloaded!');
    } catch (err) {
      toast.error('Failed to export PDF');
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
              onClick={handleShowNotes}
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-medium rounded-lg transition-all duration-200"
              title="Generate Show Notes"
            >
              <span role="img" aria-label="Show Notes">📝</span>
              <span className="text-sm">Generate Show Notes</span>
            </button>
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
        {/* Show Notes Modal */}
        <ShowNotesModal
          open={showNotesOpen}
          onClose={() => setShowNotesOpen(false)}
          showNotes={showNotes}
          onCopy={handleCopyShowNotes}
          onDownloadMarkdown={handleDownloadMarkdown}
          onDownloadPDF={handleDownloadShowNotesPDF}
          loading={showNotesLoading}
        />
      </div>
    </div>
  );
};

export default BriefDetail; 