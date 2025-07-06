import React, { useState } from 'react';
import { Sparkles, User, Link, MessageSquare, Mic, Globe, Video } from 'lucide-react';

const GuestForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    topic: '',
    interviewStyle: 'Professional',
    bioUrl: '',
    interviewUrls: ''
  });

  const interviewStyles = [
    { value: 'Professional', label: 'Professional', description: 'Formal and business-like' },
    { value: 'Casual', label: 'Casual', description: 'Relaxed and conversational' },
    { value: 'Entertainer', label: 'Entertainer', description: 'Fun and engaging' },
    { value: 'Thought Leader', label: 'Thought Leader', description: 'Intellectual and insightful' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert interview URLs string to array
    const interviewUrlsArray = formData.interviewUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    const submitData = {
      ...formData,
      interviewUrls: interviewUrlsArray
    };
    
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" aria-label="Guest Information Form" role="form">
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" aria-hidden="true" />
            Guest Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Jordan Harbinger"
            required
            aria-required="true"
            aria-label="Guest Name"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          />
        </div>

        <div>
          <label htmlFor="bioUrl" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-green-600" aria-hidden="true" />
            LinkedIn or Guest Bio URL (optional)
          </label>
          <input
            type="url"
            id="bioUrl"
            name="bioUrl"
            value={formData.bioUrl}
            onChange={handleChange}
            placeholder="e.g., https://linkedin.com/in/jordanharbinger or https://jordanharbinger.com"
            aria-label="LinkedIn or Guest Bio URL"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          />
          <p className="text-xs text-gray-500 mt-2">
            We'll extract and summarize their professional background to enhance the brief.
          </p>
        </div>

        <div>
          <label htmlFor="interviewUrls" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Video className="w-4 h-4 text-purple-600" aria-hidden="true" />
            Previous Interviews (YouTube, Podcast, or Blog URLs)
          </label>
          <textarea
            id="interviewUrls"
            name="interviewUrls"
            value={formData.interviewUrls}
            onChange={handleChange}
            placeholder="https://youtube.com/watch?v=example1&#10;https://podcast.com/episode/example2&#10;https://blog.com/interview/example3"
            rows={4}
            aria-label="Previous Interviews URLs"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            Enter one URL per line. We'll analyze transcripts and content to identify key themes and insights.
          </p>
        </div>

        <div>
          <label htmlFor="link" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Link className="w-4 h-4 text-indigo-600" aria-hidden="true" />
            Guest Website or Social Media (optional)
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="e.g., https://jordanharbinger.com"
            aria-label="Guest Website or Social Media"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          />
        </div>

        <div>
          <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-orange-600" aria-hidden="true" />
            Discussion Topic (optional)
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="e.g., Communication skills and networking"
            aria-label="Discussion Topic"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          />
        </div>

        <div>
          <label htmlFor="interviewStyle" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Mic className="w-4 h-4 text-red-600" aria-hidden="true" />
            Interview Style
          </label>
          <select
            id="interviewStyle"
            name="interviewStyle"
            value={formData.interviewStyle}
            onChange={handleChange}
            aria-label="Interview Style"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          >
            {interviewStyles.map(style => (
              <option key={style.value} value={style.value}>
                {style.label} - {style.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !formData.name.trim()}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
          isLoading || !formData.name.trim()
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
        }`}
        aria-label="Generate Brief"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Generating Brief...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Brief
          </>
        )}
      </button>
    </form>
  );
};

export default GuestForm; 