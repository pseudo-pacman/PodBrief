import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Copy, Check, User, MessageSquare, Play, Square, ExternalLink, Calendar, FileDown, Loader2, RefreshCw, FlaskConical, Edit2, Save, X } from 'lucide-react';
import { exportBriefAsPDF } from '../utils/pdfExport';
import Card from './Card';

const TONE_OPTIONS = [
  { value: 'personal', label: 'Personal' },
  { value: 'deeper', label: 'Deeper' },
  { value: 'provocative', label: 'Provocative' },
  { value: 'funny', label: 'Funny' },
  { value: 'bold', label: 'Bold' },
];

const BriefResults = ({ brief, onCopy, copiedSection }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [questions, setQuestions] = useState(brief.questions);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [refineTone, setRefineTone] = useState('personal');
  const [showToneDropdown, setShowToneDropdown] = useState(null);

  const sections = [
    {
      id: 'bio',
      title: 'Professional Bio',
      content: brief.bio,
      icon: User,
      description: '2-3 sentence introduction',
      color: 'blue',
      gradient: 'from-blue-50 to-indigo-50'
    },
    {
      id: 'questions',
      title: 'Interview Questions',
      content: brief.questions,
      icon: MessageSquare,
      description: '5 engaging questions',
      isList: true,
      color: 'green',
      gradient: 'from-green-50 to-emerald-50'
    },
    {
      id: 'intro',
      title: 'Intro Script',
      content: brief.intro,
      icon: Play,
      description: '~30-second introduction',
      color: 'purple',
      gradient: 'from-purple-50 to-pink-50'
    },
    {
      id: 'outro',
      title: 'Outro Script',
      content: brief.outro,
      icon: Square,
      description: '~15-second closing',
      color: 'orange',
      gradient: 'from-orange-50 to-red-50'
    }
  ];

  const getCopyText = (section) => {
    if (section.isList) {
      return section.content.map((q, i) => `${i + 1}. ${q}`).join('\n\n');
    }
    return section.content;
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      orange: 'text-orange-600 bg-orange-100'
    };
    return colors[color] || colors.blue;
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

  // AI Question Assistant handlers
  const handleRegenerate = async (index) => {
    setLoadingIndex(index);
    setShowToneDropdown(null);
    try {
      const res = await fetch('/api/assist-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: brief.guestTopic || brief.topic || '',
          originalQuestion: questions[index],
          mode: 'regenerate'
        })
      });
      const data = await res.json();
      if (data.success && data.question) {
        setQuestions(qs => qs.map((q, i) => i === index ? data.question : q));
        toast.success('Question updated!');
      } else {
        throw new Error(data.error || 'Failed to regenerate question');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to regenerate question');
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleRefine = async (index) => {
    setLoadingIndex(index);
    setShowToneDropdown(null);
    try {
      const res = await fetch('/api/assist-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: brief.guestTopic || brief.topic || '',
          originalQuestion: questions[index],
          mode: 'refine',
          tone: refineTone
        })
      });
      const data = await res.json();
      if (data.success && data.question) {
        setQuestions(qs => qs.map((q, i) => i === index ? data.question : q));
        toast.success('Question updated!');
      } else {
        throw new Error(data.error || 'Failed to refine question');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to refine question');
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(questions[index]);
    setShowToneDropdown(null);
  };

  const handleSaveEdit = (index) => {
    setQuestions(qs => qs.map((q, i) => i === index ? editValue : q));
    setEditIndex(null);
    toast.success('Question updated!');
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditValue('');
  };

  return (
    <div className="max-w-screen-md mx-auto py-section space-y-8 animate-fade-in">
      {/* Guest Info Card */}
      <Card label={<><User className="w-5 h-5 text-brand" /> <span>👤 Guest Info</span></>} className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-primary dark:text-primary-dark">Generated for</h3>
        </div>
        <div className="space-y-3">
          <p className="text-2xl font-bold text-brand dark:text-brand-light">{brief.guestName}</p>
          {brief.guestLink && (
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-gray-400" />
              <a 
                href={brief.guestLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand hover:text-brand-dark font-medium hover:underline transition-colors"
              >
                {brief.guestLink}
              </a>
            </div>
          )}
          {brief.guestTopic && (
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <span className="text-muted-foreground font-medium">Topic: {brief.guestTopic}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Brief Sections */}
      <div className="space-y-6">
        {sections.map((section) => {
          const Icon = section.icon;
          const isCopied = copiedSection === section.id;
          const colorClasses = getColorClasses(section.color);
          const sectionLabels = {
            bio: <><User className="w-5 h-5 text-brand" /> <span>📝 Professional Bio</span></>,
            questions: <><MessageSquare className="w-5 h-5 text-brand" /> <span>🧠 Interview Questions</span></>,
            intro: <><Play className="w-5 h-5 text-brand" /> <span>🎬 Intro Script</span></>,
            outro: <><Square className="w-5 h-5 text-brand" /> <span>🏁 Outro Script</span></>,
          };
          return (
            <Card key={section.id} label={sectionLabels[section.id]} highlight={isCopied} className="fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colorClasses}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary dark:text-primary-dark">{section.title}</h3>
                </div>
                <button
                  onClick={() => onCopy(getCopyText(section), section.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-brand bg-white dark:bg-[#232323] hover:bg-accent/30 rounded-lg border border-zinc-200 dark:border-zinc-700 transition-all duration-200 hover:shadow-sm"
                  title={`Copy ${section.title}`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <hr className="my-4 border-muted-20" />
              <div>
                {section.isList ? (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <Card key={index} className={`p-4 bg-muted-10 border-none shadow-none transition-all duration-200 ${loadingIndex === index ? 'animate-pulse border-brand' : ''}`}> 
                        <div className="flex gap-4 items-start">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm mt-1">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            {editIndex === index ? (
                              <div className="flex flex-col gap-2">
                                <textarea
                                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand text-primary dark:text-primary-dark text-base bg-background dark:bg-[#232323] transition-colors"
                                  value={editValue}
                                  onChange={e => setEditValue(e.target.value)}
                                  rows={2}
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <button onClick={() => handleSaveEdit(index)} className="px-3 py-1 bg-green-600 text-white rounded-lg flex items-center gap-1 text-sm hover:bg-green-700"><Save className="w-4 h-4" />Save</button>
                                  <button onClick={handleCancelEdit} className="px-3 py-1 bg-muted text-muted-foreground rounded-lg flex items-center gap-1 text-sm hover:bg-muted-20"><X className="w-4 h-4" />Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1">
                                <span className="text-base text-primary dark:text-primary-dark">{question}</span>
                                <div className="flex gap-2 mt-2">
                                  <button onClick={() => handleEdit(index)} className="px-2 py-1 text-xs font-medium bg-accent/30 text-brand rounded-lg hover:bg-accent transition-transform duration-200"><Edit2 className="w-4 h-4" />Edit</button>
                                  <button onClick={() => handleRegenerate(index)} className="px-2 py-1 text-xs font-medium bg-accent/30 text-brand rounded-lg hover:bg-accent transition-transform duration-200 flex items-center gap-1"><RefreshCw className="w-4 h-4 animate-spin" />Regenerate</button>
                                  <button onClick={() => { setShowToneDropdown(index); }} className="px-2 py-1 text-xs font-medium bg-accent/30 text-brand rounded-lg hover:bg-accent transition-transform duration-200 flex items-center gap-1"><FlaskConical className="w-4 h-4" />Refine</button>
                                </div>
                                {showToneDropdown === index && (
                                  <div className="mt-2 flex gap-2 items-center">
                                    <select value={refineTone} onChange={e => setRefineTone(e.target.value)} className="rounded-lg border border-zinc-200 dark:border-zinc-700 px-2 py-1 text-xs bg-background dark:bg-[#232323] text-primary dark:text-primary-dark">
                                      {TONE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                      ))}
                                    </select>
                                    <button onClick={() => handleRefine(index)} className="px-2 py-1 text-xs font-medium bg-brand text-white rounded-lg hover:bg-brand-dark transition-transform duration-200 flex items-center gap-1"><FlaskConical className="w-4 h-4" />Apply</button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-base text-primary dark:text-primary-dark leading-relaxed">
                    {section.content}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Generated Info */}
      <div className="text-center pt-6 border-t border-muted-20">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
          <Calendar className="w-4 h-4" />
          <span>
            Generated on {new Date(brief.createdAt).toLocaleDateString()} at{' '}
            {new Date(brief.createdAt).toLocaleTimeString()}
          </span>
        </div>
        {/* PDF Export Button */}
        <div className="flex justify-center">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-brand to-brand-light hover:from-brand-dark hover:to-brand text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                <span>Export as PDF</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Downloads as podbrief-{brief.guestName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}.pdf
        </p>
      </div>
    </div>
  );
};

export default BriefResults; 