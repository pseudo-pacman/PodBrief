import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  FileText, 
  User, 
  Calendar, 
  Eye, 
  Trash2, 
  MessageSquare, 
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';

const BriefsList = ({ onViewBrief, onRefresh }) => {
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchBriefs();
  }, []);

  const fetchBriefs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/briefs');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch briefs');
      }

      setBriefs(data.briefs);
    } catch (error) {
      console.error('Error fetching briefs:', error);
      setError(error.message);
      toast.error('Failed to load briefs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (briefId, guestName) => {
    if (!window.confirm(`Are you sure you want to delete the brief for "${guestName}"?`)) {
      return;
    }

    try {
      setDeletingId(briefId);
      
      const response = await fetch(`/api/briefs/${briefId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete brief');
      }

      setBriefs(briefs.filter(brief => brief.id !== briefId));
      toast.success('Brief deleted successfully');
      
      // Notify parent component to refresh if needed
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting brief:', error);
      toast.error(error.message || 'Failed to delete brief');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTopicPreview = (topic) => {
    if (!topic) return 'No topic specified';
    return topic.length > 50 ? `${topic.substring(0, 50)}...` : topic;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl mb-6">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Loading Briefs
        </h3>
        <p className="text-gray-600 text-lg">
          Fetching your saved podcast briefs...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Error Loading Briefs
        </h3>
        <p className="text-gray-600 text-lg mb-6">
          {error}
        </p>
        <button
          onClick={fetchBriefs}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (briefs.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-100 to-blue-100 rounded-2xl mb-6">
          <FileText className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          No Briefs Yet
        </h3>
        <p className="text-gray-600 text-lg mb-6">
          Generate your first podcast brief to see it here!
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
        >
          Create Your First Brief
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Saved Briefs</h2>
            <p className="text-gray-500 text-sm">{briefs.length} brief{briefs.length !== 1 ? 's' : ''} generated</p>
          </div>
        </div>
        <button
          onClick={fetchBriefs}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <Loader2 className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-6">
        {briefs.map((brief) => (
          <div
            key={brief.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {brief.guestName}
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    {brief.guestTopic && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MessageSquare className="w-4 h-4" />
                        <span>{getTopicPreview(brief.guestTopic)}</span>
                      </div>
                    )}
                    
                    {brief.guestLink && (
                      <div className="flex items-center gap-2 text-sm">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        <a
                          href={brief.guestLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                          {brief.guestLink}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(brief.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => onViewBrief(brief)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                    title="View Brief"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  
                  <button
                    onClick={() => handleDelete(brief.id, brief.guestName)}
                    disabled={deletingId === brief.id}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Brief"
                  >
                    {deletingId === brief.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span>{deletingId === brief.id ? 'Deleting...' : 'Delete'}</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {brief.bio.length > 150 ? `${brief.bio.substring(0, 150)}...` : brief.bio}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BriefsList; 