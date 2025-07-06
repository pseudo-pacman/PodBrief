import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Copy, Check, User, MessageSquare, Play, Square, ExternalLink, Calendar, FileDown, Loader2 } from 'lucide-react';
import { exportBriefAsPDF } from '../utils/pdfExport';

const BriefResults = ({ brief, onCopy, copiedSection }) => {
  const [isExporting, setIsExporting] = useState(false);
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

  return (
    <div className="space-y-8">
      {/* Guest Info Card */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Generated for</h3>
        </div>
        <div className="space-y-3">
          <p className="text-2xl font-bold text-blue-600">{brief.guestName}</p>
          {brief.guestLink && (
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-gray-400" />
              <a 
                href={brief.guestLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                {brief.guestLink}
              </a>
            </div>
          )}
          {brief.guestTopic && (
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 font-medium">Topic: {brief.guestTopic}</span>
            </div>
          )}
        </div>
      </div>

      {/* Brief Sections */}
      <div className="grid gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          const isCopied = copiedSection === section.id;
          const colorClasses = getColorClasses(section.color);
          
          return (
            <div key={section.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorClasses}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-500">{section.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onCopy(getCopyText(section), section.title)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-sm"
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
              </div>
              
              <div className={`p-6 bg-gradient-to-r ${section.gradient}`}>
                {section.isList ? (
                  <div className="space-y-4">
                    {section.content.map((question, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <p className="text-gray-800 leading-relaxed font-medium">
                          {question}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-800 leading-relaxed text-lg">
                      {section.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Generated Info */}
      <div className="text-center pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
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
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
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
        
        <p className="text-xs text-gray-400 mt-3">
          Downloads as podbrief-{brief.guestName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}.pdf
        </p>
      </div>
    </div>
  );
};

export default BriefResults; 