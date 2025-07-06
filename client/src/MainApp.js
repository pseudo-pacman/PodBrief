import React, { useState, useMemo, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { Mic, Sparkles, Copy, Check, Loader2, Zap, Users, FileText, List } from 'lucide-react';
import GuestForm from './components/GuestForm';
import BriefResults from './components/BriefResults';
import BriefsList from './components/BriefsList';
import BriefDetail from './components/BriefDetail';
import Header from './components/Header';
import { AccessibilityContext } from './App';

function MainApp() {
  const accessibility = useContext(AccessibilityContext) || { largeFont: false, highContrast: false };
  const [isLoading, setIsLoading] = useState(false);
  const [brief, setBrief] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);
  const [viewMode, setViewMode] = useState('form'); // 'form', 'list', 'detail'
  const [selectedBrief, setSelectedBrief] = useState(null);

  const generateBrief = async (guestData) => {
    setIsLoading(true);
    setBrief(null);
    
    try {
      let contextualData = null;
      
      // If bio URL or interview URLs are provided, get contextual information first
      if (guestData.bioUrl || (guestData.interviewUrls && guestData.interviewUrls.length > 0)) {
        console.log('Getting contextual information...');
        
        const contextualizeResponse = await fetch('/api/contextualizeGuest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bioUrl: guestData.bioUrl,
            interviewUrls: guestData.interviewUrls
          }),
        });
        
        if (contextualizeResponse.ok) {
          contextualData = await contextualizeResponse.json();
          console.log('Contextual data received:', contextualData);
          
          if (contextualData.errors && contextualData.errors.length > 0) {
            console.warn('Some contextualization errors:', contextualData.errors);
          }
        } else {
          console.warn('Failed to get contextual data, proceeding without it');
        }
      }
      
      // Generate the brief with contextual data if available
      const briefData = {
        name: guestData.name,
        link: guestData.link,
        topic: guestData.topic,
        interviewStyle: guestData.interviewStyle,
        bioSummary: contextualData?.bioSummary,
        interviewInsights: contextualData?.interviewInsights
      };
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(briefData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate brief');
      }
      
      setBrief(data.brief);
      toast.success('Brief generated successfully!');
    } catch (error) {
      console.error('Error generating brief:', error);
      toast.error(error.message || 'Failed to generate brief. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text, section) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      toast.success(`${section} copied to clipboard!`);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleViewBrief = (brief) => {
    setSelectedBrief(brief);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedBrief(null);
  };

  const handleCloseDetail = () => {
    setViewMode('form');
    setSelectedBrief(null);
  };

  const handleRefreshBriefs = () => {
    if (viewMode === 'list') {
      setViewMode('list');
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-200 ${accessibility.largeFont ? 'text-xl' : ''} ${accessibility.highContrast ? 'high-contrast' : ''}`}
    >
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('form')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                  viewMode === 'form'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Mic className="w-5 h-5" />
                <span>Generate Brief</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <List className="w-5 h-5" />
                <span>Saved Briefs</span>
              </button>
            </div>
          </div>
        </div>
        {viewMode === 'form' && (
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-6">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Generate Professional
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Podcast Briefs
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Create engaging interview briefs with AI-powered content generation. 
              Get professional bios, questions, and scripts in seconds.
            </p>
          </div>
        )}
        {viewMode === 'form' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sticky top-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Guest Information</h2>
                    <p className="text-gray-500 text-sm">Enter your guest details</p>
                  </div>
                </div>
                <GuestForm onSubmit={generateBrief} isLoading={isLoading} />
              </div>
            </div>
            <div className="lg:col-span-2 space-y-8">
              {isLoading && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl mb-6">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Generating Your Brief
                  </h3>
                  <p className="text-gray-600 text-lg max-w-md mx-auto">
                    Our AI is crafting a professional podcast brief for your guest...
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              {brief && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                        <Sparkles className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Generated Brief</h2>
                        <p className="text-green-600 font-medium">Ready to use!</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <BriefResults 
                      brief={brief} 
                      onCopy={copyToClipboard}
                      copiedSection={copiedSection}
                    />
                  </div>
                </div>
              )}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">What You'll Get</h3>
                    <p className="text-gray-500 text-sm">Professional content for your podcast</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Professional Bio</h4>
                      <p className="text-sm text-gray-600">2-3 sentence introduction for your guest</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="w-3 h-3 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">5 Interview Questions</h4>
                      <p className="text-sm text-gray-600">Engaging questions tailored to your guest</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="w-3 h-3 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Intro Script</h4>
                      <p className="text-sm text-gray-600">~30-second introduction for your host</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                    <div className="w-3 h-3 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Outro Script</h4>
                      <p className="text-sm text-gray-600">~15-second closing for your host</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">Powered by AI</h3>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">GPT-3.5</div>
                    <div className="text-blue-100 text-sm">AI Model</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">5</div>
                    <div className="text-blue-100 text-sm">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">45s</div>
                    <div className="text-blue-100 text-sm">Total Script</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {viewMode === 'list' && (
          <BriefsList 
            onViewBrief={handleViewBrief}
            onRefresh={handleRefreshBriefs}
          />
        )}
        {viewMode === 'detail' && selectedBrief && (
          <BriefDetail
            brief={selectedBrief}
            onClose={handleCloseDetail}
            onBack={handleBackToList}
          />
        )}
      </main>
    </div>
  );
}

export default MainApp; 