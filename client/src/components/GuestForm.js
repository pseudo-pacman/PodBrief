import React, { useState } from 'react';
import { Sparkles, User, Link, MessageSquare, Mic, Globe, Video, Loader2, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Card from './Card';

const GuestForm = ({ onSubmit, isLoading, layout }) => {
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    topic: '',
    interviewStyle: 'Professional',
    bioUrl: '',
    interviewUrls: ''
  });
  const [enriching, setEnriching] = useState(false);

  const interviewStyles = [
    { value: 'Professional', label: 'Professional', description: 'Formal and business-like' },
    { value: 'Casual', label: 'Casual', description: 'Relaxed and conversational' },
    { value: 'Entertainer', label: 'Entertainer', description: 'Fun and engaging' },
    { value: 'Challenger', label: 'Challenger', description: 'Provocative and bold' },
  ];

  const canEnrich = formData.bioUrl || formData.link || formData.interviewUrls;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEnrich = async () => {
    setEnriching(true);
    try {
      const res = await fetch('/api/enrich-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkedin: formData.bioUrl,
          website: formData.link,
          interviews: formData.interviewUrls.split(',').map(s => s.trim()).filter(Boolean)
        })
      });
      const data = await res.json();
      if (data.success && data.enrichment) {
        setFormData(f => ({
          ...f,
          name: data.enrichment.name || f.name,
          topic: data.enrichment.topics?.[0] || f.topic,
        }));
        toast.success('Guest info enriched successfully!');
      } else {
        throw new Error(data.error || 'Failed to enrich guest info');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to enrich guest info');
    } finally {
      setEnriching(false);
    }
  };

  // Use grid layout if layout prop is 'grid'
  const isGrid = layout === 'grid';

  return (
    <div className="w-full animate-fade-in">
      <Card label={<><User className="w-5 h-5 text-brand" /> <span>🎤 Guest Profile</span></>} className="rounded-2xl border bg-white dark:bg-[#1A1A1A] shadow-md mb-0 p-0 transition-colors duration-300">
        <div className="px-6 pt-6 pb-2">
          <h1 className="text-2xl font-semibold font-sans text-primary dark:text-primary-dark mb-1 flex items-center gap-2">
            <User className="w-7 h-7 text-brand" /> Guest Profile
          </h1>
          <p className="text-base text-muted-foreground mb-2">Add or enrich a podcast guest. Fields marked <span className='text-red-500'>*</span> are required.</p>
        </div>
        <hr className="my-2 border-muted-20" />
        <form onSubmit={e => { e.preventDefault(); onSubmit(formData); }} className={`flex flex-col gap-y-6 px-6 pb-6 ${isGrid ? '' : ''}`}>
          <div className={isGrid ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'flex flex-col gap-y-6'}>
            {/* Name */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="text-base font-medium text-muted-foreground">Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-base bg-background dark:bg-[#232323] focus:ring-2 focus:ring-brand focus:outline-none text-primary dark:text-primary-dark transition-colors duration-200"
                placeholder="Guest full name"
                autoComplete="off"
              />
            </div>
            {/* Website */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="link" className="text-base font-medium text-muted-foreground">Personal Website</label>
              <input
                type="url"
                name="link"
                id="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-base bg-background dark:bg-[#232323] focus:ring-2 focus:ring-brand focus:outline-none text-primary dark:text-primary-dark transition-colors duration-200"
                placeholder="https://guest.com"
                autoComplete="off"
              />
            </div>
            {/* LinkedIn */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="bioUrl" className="text-base font-medium text-muted-foreground">LinkedIn Profile</label>
              <input
                type="url"
                name="bioUrl"
                id="bioUrl"
                value={formData.bioUrl}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-base bg-background dark:bg-[#232323] focus:ring-2 focus:ring-brand focus:outline-none text-primary dark:text-primary-dark transition-colors duration-200"
                placeholder="https://linkedin.com/in/guest"
                autoComplete="off"
              />
            </div>
            {/* Previous Interviews */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="interviewUrls" className="text-base font-medium text-muted-foreground">Previous Interviews (comma separated)</label>
              <input
                type="text"
                name="interviewUrls"
                id="interviewUrls"
                value={formData.interviewUrls}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-base bg-background dark:bg-[#232323] focus:ring-2 focus:ring-brand focus:outline-none text-primary dark:text-primary-dark transition-colors duration-200"
                placeholder="https://youtube.com/..., https://podcast.com/..."
                autoComplete="off"
              />
            </div>
            {/* Topic */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="topic" className="text-base font-medium text-muted-foreground">Discussion Topic <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="topic"
                id="topic"
                value={formData.topic}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-base bg-background dark:bg-[#232323] focus:ring-2 focus:ring-brand focus:outline-none text-primary dark:text-primary-dark transition-colors duration-200"
                placeholder="AI and the future of work"
                autoComplete="off"
              />
            </div>
            {/* Interview Style */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="interviewStyle" className="text-base font-medium text-muted-foreground">Interview Style</label>
              <select
                name="interviewStyle"
                id="interviewStyle"
                value={formData.interviewStyle}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-base bg-background dark:bg-[#232323] focus:ring-2 focus:ring-brand focus:outline-none text-primary dark:text-primary-dark transition-colors duration-200"
              >
                {interviewStyles.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p className="text-sm text-muted-foreground mt-1">{interviewStyles.find(s => s.value === formData.interviewStyle)?.description}</p>
            </div>
          </div>
          <hr className="my-4 border-muted-20" />
          {/* Enrich Button */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleEnrich}
              disabled={!canEnrich || enriching}
              className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200
                ${!canEnrich || enriching ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 hover:from-yellow-500 hover:to-yellow-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'}`}
              aria-label="Enrich Guest Info from URLs"
            >
              {enriching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enriching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Enrich Info from URLs
                </>
              )}
            </button>
            <p className="text-xs text-muted-foreground text-center mb-2">
              <span className="font-medium">What does this do?</span> This will automatically extract and summarize the guest's bio, title, company, and key topics from the provided LinkedIn, website, and interview URLs using AI.
            </p>
          </div>
          {/* Generate Brief Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 bg-brand text-white hover:bg-brand-dark transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Generate Brief
          </button>
        </form>
      </Card>
    </div>
  );
};

export default GuestForm; 