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
  Loader2,
  Megaphone,
  ClipboardList,
  Sparkles,
  Zap
} from 'lucide-react';
import BriefResults from './BriefResults';
import { exportBriefAsPDF } from '../utils/pdfExport';
import Card from './Card';

// Show Notes Modal (to be implemented)
const ShowNotesModal = ({ open, onClose, showNotes, onCopy, onDownloadMarkdown, onDownloadPDF, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card label={<span className="flex items-center gap-2">📝 <span>Show Notes</span></span>} className="max-w-2xl w-full max-h-[90vh] overflow-auto p-6 relative shadow-2xl bg-white dark:bg-[#1A1A1A] border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-muted transition-colors rounded-lg" title="Close">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-brand" />
            <span className="text-muted-foreground">Generating show notes...</span>
          </div>
        ) : (
          <>
            <pre className="whitespace-pre-wrap break-words bg-muted rounded-lg p-4 border border-muted-foreground text-primary dark:text-primary-dark text-sm mb-4 max-h-96 overflow-auto transition-colors duration-300">{showNotes}</pre>
            <div className="flex gap-3">
              <button onClick={onCopy} className="px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark transition-colors">Copy</button>
              <button onClick={onDownloadMarkdown} className="px-4 py-2 bg-highlight text-white rounded-lg font-medium hover:bg-yellow-500 transition-colors">Download .md</button>
              <button onClick={onDownloadPDF} className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-soft transition-colors">Download PDF</button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

// Social Posts Modal
const SocialPostsModal = ({ open, onClose, loading, posts, selectedTypes, onCopy, onDownload, error }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card label={<span className="flex items-center gap-2"><Megaphone className="w-5 h-5 text-pink-500" /> Social Media Posts</span>} className="max-w-2xl w-full max-h-[90vh] overflow-auto p-6 relative shadow-2xl bg-white dark:bg-[#1A1A1A] border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-muted transition-colors rounded-lg" title="Close">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-pink-500" />
            <span className="text-muted-foreground">Generating social posts...</span>
          </div>
        ) : error ? (
          <div className="text-red-600 font-semibold py-8 text-center">{error}</div>
        ) : (
          <>
            {selectedTypes.includes('twitter') && posts.twitter && (
              <div className="mb-6">
                <h3 className="font-bold text-brand mb-2">Twitter/X Thread</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  {posts.twitter.map((tweet, i) => (
                    <li key={i} className="bg-muted rounded-lg p-2 text-primary dark:text-primary-dark">{tweet}</li>
                  ))}
                </ol>
                <button onClick={() => onCopy(posts.twitter.join('\n\n'))} className="mt-2 px-3 py-1 bg-brand text-white rounded-lg text-sm hover:bg-brand-dark transition-colors">Copy Thread</button>
              </div>
            )}
            {selectedTypes.includes('linkedin') && posts.linkedin && (
              <div className="mb-6">
                <h3 className="font-bold text-brand-dark mb-2">LinkedIn Post</h3>
                <div className="bg-muted rounded-lg p-3 text-primary dark:text-primary-dark whitespace-pre-line">{posts.linkedin}</div>
                <button onClick={() => onCopy(posts.linkedin)} className="mt-2 px-3 py-1 bg-brand-dark text-white rounded-lg text-sm hover:bg-brand transition-colors">Copy LinkedIn</button>
              </div>
            )}
            {selectedTypes.includes('instagram') && posts.instagram && (
              <div className="mb-6">
                <h3 className="font-bold text-pink-600 mb-2">Instagram Caption</h3>
                <div className="bg-pink-50 dark:bg-pink-900 rounded-lg p-3 text-primary dark:text-primary-dark whitespace-pre-line">{posts.instagram}</div>
                <button onClick={() => onCopy(posts.instagram)} className="mt-2 px-3 py-1 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700 transition-colors">Copy Instagram</button>
              </div>
            )}
            <button onClick={onDownload} className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-soft transition-colors">Download All (.md)</button>
          </>
        )}
      </Card>
    </div>
  );
};

const BriefDetail = ({ brief, onClose, onBack }) => {
  const [copiedSection, setCopiedSection] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showNotesOpen, setShowNotesOpen] = useState(false);
  const [showNotes, setShowNotes] = useState('');
  const [showNotesLoading, setShowNotesLoading] = useState(false);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialPosts, setSocialPosts] = useState({ twitter: [], linkedin: '', instagram: '' });
  const [socialTypes, setSocialTypes] = useState(['twitter', 'linkedin', 'instagram']);
  const [socialQuote, setSocialQuote] = useState(brief.quote || '');
  const [socialError, setSocialError] = useState('');
  const [showSocialForm, setShowSocialForm] = useState(false);

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

  const handleOpenSocialModal = () => {
    setShowSocialForm(true);
    setSocialModalOpen(true);
    setSocialError('');
    setSocialPosts({ twitter: [], linkedin: '', instagram: '' });
  };

  const handleGenerateSocialPosts = async (e) => {
    e.preventDefault();
    setSocialLoading(true);
    setShowSocialForm(false);
    setSocialError('');
    setSocialPosts({ twitter: [], linkedin: '', instagram: '' });
    try {
      const res = await fetch('/api/generate-social-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: brief.guestName,
          episodeTopic: brief.guestTopic || brief.topic,
          bio: brief.bio,
          quote: socialQuote,
          postTypes: socialTypes
        })
      });
      const data = await res.json();
      if (data.success) {
        setSocialPosts(data.posts);
        toast.success('Social posts generated!');
      } else {
        throw new Error(data.error || 'Failed to generate social posts');
      }
    } catch (err) {
      setSocialError(err.message || 'Failed to generate social posts');
      toast.error(err.message || 'Failed to generate social posts');
    } finally {
      setSocialLoading(false);
    }
  };

  const handleCopySocial = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDownloadSocial = () => {
    let content = '';
    if (socialTypes.includes('twitter') && socialPosts.twitter.length) {
      content += '## Twitter/X Thread\n' + socialPosts.twitter.map((t, i) => `${i+1}. ${t}`).join('\n') + '\n\n';
    }
    if (socialTypes.includes('linkedin') && socialPosts.linkedin) {
      content += '## LinkedIn Post\n' + socialPosts.linkedin + '\n\n';
    }
    if (socialTypes.includes('instagram') && socialPosts.instagram) {
      content += '## Instagram Caption\n' + socialPosts.instagram + '\n';
    }
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `social-posts-${brief.guestName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  if (!brief) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white/90 dark:bg-zinc-950/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-screen-md w-full max-h-[90vh] overflow-hidden shadow-2xl rounded-2xl border bg-white dark:bg-muted/10 dark:border-muted p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-t-2xl gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Back to list"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-semibold font-sans">Brief Details</h2>
              <p className="text-blue-100 text-base">Viewing brief for {brief.guestName}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenSocialModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-400 hover:bg-pink-500 text-pink-900 font-medium rounded-lg transition-all duration-200"
              title="Generate Social Posts"
            >
              <Megaphone className="w-4 h-4" />
              <span className="text-sm">Generate Social Posts</span>
            </button>
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
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] bg-muted/10">
          <div className="p-8">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 max-w-3xl mx-auto mt-8 border border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-col md:flex-row md:gap-8 gap-4">
                {/* Left: Guest Info */}
                <div className="flex-1 min-w-0">
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-1">Guest</div>
                    <div className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{brief.guestName}</div>
                    <div className="text-zinc-500 text-sm mt-1">{brief.guestBio}</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-1">Topic</div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{brief.topic}</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-1">Links</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {brief.links && brief.links.map((link, i) => (
                        <li key={i}>
                          <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition-colors">{link}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Right: What You'll Get */}
                <div className="flex-1 min-w-0">
                  <div className="mb-4 border-l-4 border-blue-500 pl-4 bg-blue-50 dark:bg-zinc-800 rounded-lg py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs uppercase tracking-wider text-blue-600 font-semibold">What You'll Get</span>
                    </div>
                    <ul className="list-disc pl-5 text-zinc-900 dark:text-zinc-100 text-sm space-y-1">
                      <li>SEO-optimized Show Notes</li>
                      <li>Social Media Posts (Twitter/X, LinkedIn, Instagram)</li>
                      <li>Episode Summary & Highlights</li>
                      <li>Download as Markdown or PDF</li>
                    </ul>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                    <span>Powered by AI</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-800 my-4" />
              {/* Questions Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">Interview Questions</span>
                </div>
                <ol className="list-decimal pl-6 space-y-2">
                  {brief.questions && brief.questions.map((q, i) => (
                    <li key={i} className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2 text-zinc-900 dark:text-zinc-100">{q}</li>
                  ))}
                </ol>
              </div>
            </div>
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
        {/* Social Posts Modal */}
        {socialModalOpen && (
          <div className="">
            {showSocialForm ? (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
                <Card className="max-w-md w-full p-8 relative shadow-2xl rounded-2xl border bg-white dark:bg-muted/10 dark:border-muted">
                  <button onClick={() => setSocialModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-muted-20 rounded-lg" title="Close">
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Megaphone className="w-5 h-5 text-pink-500" /> Generate Social Media Posts</h2>
                  <form onSubmit={handleGenerateSocialPosts} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Select post types:</label>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-1">
                          <input type="checkbox" checked={socialTypes.includes('twitter')} onChange={e => setSocialTypes(t => e.target.checked ? [...t, 'twitter'] : t.filter(x => x !== 'twitter'))} /> Twitter/X
                        </label>
                        <label className="flex items-center gap-1">
                          <input type="checkbox" checked={socialTypes.includes('linkedin')} onChange={e => setSocialTypes(t => e.target.checked ? [...t, 'linkedin'] : t.filter(x => x !== 'linkedin'))} /> LinkedIn
                        </label>
                        <label className="flex items-center gap-1">
                          <input type="checkbox" checked={socialTypes.includes('instagram')} onChange={e => setSocialTypes(t => e.target.checked ? [...t, 'instagram'] : t.filter(x => x !== 'instagram'))} /> Instagram
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Favorite quote (optional):</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 text-gray-800"
                        value={socialQuote}
                        onChange={e => setSocialQuote(e.target.value)}
                        placeholder="E.g. 'AI should serve people, not replace them.'"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-pink-400 to-pink-500 text-pink-900 hover:from-pink-500 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                      disabled={socialTypes.length === 0 || socialLoading}
                    >
                      {socialLoading ? <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" /> : <Megaphone className="w-5 h-5 inline-block mr-2" />}
                      Generate Posts
                    </button>
                  </form>
                </Card>
              </div>
            ) : (
              <SocialPostsModal
                open={socialModalOpen}
                onClose={() => setSocialModalOpen(false)}
                loading={socialLoading}
                posts={socialPosts}
                selectedTypes={socialTypes}
                onCopy={handleCopySocial}
                onDownload={handleDownloadSocial}
                error={socialError}
              />
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default BriefDetail; 