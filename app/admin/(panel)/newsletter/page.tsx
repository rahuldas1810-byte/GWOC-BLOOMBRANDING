'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Send, Loader2, RefreshCw, Mail, CheckCircle, XCircle, Ban, ArrowRightCircle } from 'lucide-react';

interface Subscriber {
  _id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  
  // Send Form State
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [processingSub, setProcessingSub] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const response = await api.getNewsletterSubscribers();
      if (response.success && response.data) {
        setSubscribers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    if (!confirm('Are you sure you want to send this email to all active subscribers?')) {
      return;
    }

    setSending(true);
    try {
      const response = await api.sendNewsletterUpdate({ subject, message });
      if (response.success) {
        alert(response.message || 'Newsletter sent successfully!');
        setShowSendModal(false);
        setSubject('');
        setMessage('');
      } else {
        alert(response.message || 'Failed to send newsletter.');
      }
    } catch (error: any) {
      alert(error.message || 'An unexpected error occurred.');
    } finally {
      setSending(false);
    }
  };

  const handleManageSubscriber = async (email: string, action: 'deactivate' | 'reactivate') => {
    if (processingSub) return;
    
    if (!confirm(`Are you sure you want to ${action} this subscriber?`)) {
      return;
    }

    setProcessingSub(email);
    try {
      const response = await api.manageSubscriber(email, action);
      if (response.success) {
        // Update local state to reflect change immediately
        setSubscribers(prev => prev.map(sub => 
          sub.email === email 
            ? { ...sub, status: action === 'deactivate' ? 'unsubscribed' : 'active' } 
            : sub
        ));
        
        // Optional: show toast/alert (kept subtle as requested)
        // alert(`Subscriber ${action}d successfully`);
      } else {
        alert(response.message || 'Failed to update subscriber');
      }
    } catch (error: any) {
      alert(error.message || 'An error occurred');
    } finally {
      setProcessingSub(null);
    }
  };

  return (
    <div className="min-h-screen bg-earl-gray/10 pb-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark-choc">Newsletter</h1>
            <p className="text-dark-choc/60 mt-1">Manage subscribers and send updates.</p>
          </div>
          <button
            onClick={() => setShowSendModal(true)}
            className="flex items-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-lg hover:bg-electric-blue/90 transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
            Send New Update
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-dark-choc/30" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-dark-choc/5 overflow-hidden">
            <div className="p-6 border-b border-dark-choc/5 flex justify-between items-center">
              <h2 className="font-semibold text-lg text-dark-choc">
                Subscribers ({subscribers.length})
              </h2>
              <button 
                onClick={fetchSubscribers} 
                className="text-dark-choc/50 hover:text-electric-blue transition-colors p-2 rounded-full hover:bg-electric-blue/5"
                title="Refresh List"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-earl-gray/30 text-dark-choc/70 text-sm font-medium uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 w-[40%]">Email</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                    <th className="px-6 py-4">Subscribed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-choc/5">
                  {subscribers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-dark-choc/40">
                        No subscribers yet.
                      </td>
                    </tr>
                  ) : (
                    subscribers.map((sub) => (
                      <tr key={sub._id} className="hover:bg-earl-gray/10 transition-colors">
                        <td className="px-6 py-4 text-dark-choc flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-electric-blue/10 flex items-center justify-center text-electric-blue">
                            <Mail className="w-4 h-4" />
                          </div>
                          {sub.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            sub.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {sub.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            <span className="capitalize">{sub.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {sub.status === 'active' ? (
                            <button
                              onClick={() => handleManageSubscriber(sub.email, 'deactivate')}
                              disabled={processingSub === sub.email}
                              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {processingSub === sub.email ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Ban className="w-3.5 h-3.5" />
                              )}
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleManageSubscriber(sub.email, 'reactivate')}
                              disabled={processingSub === sub.email}
                              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 border border-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {processingSub === sub.email ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <ArrowRightCircle className="w-3.5 h-3.5" />
                              )}
                              Reactivate
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 text-dark-choc/60 text-sm">
                          {new Date(sub.subscribedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-dark-choc/5 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-dark-choc">Send Newsletter Update</h3>
              <button 
                onClick={() => setShowSendModal(false)}
                className="text-dark-choc/40 hover:text-red-500 transition-colors"
                disabled={sending}
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSendUpdate} className="p-6 space-y-6">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm border border-blue-100">
                 <strong>Note:</strong> This will send an email to <strong>{subscribers.filter(s => s.status === 'active').length}</strong> active subscribers.
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-choc mb-2">Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue/20 focus:border-electric-blue outline-none transition-all placeholder:text-dark-choc/30"
                  placeholder="e.g. New Project Launch: Minimalist Villa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-choc mb-2">Message Body (HTML enabled)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue/20 focus:border-electric-blue outline-none transition-all min-h-[200px] placeholder:text-dark-choc/30 font-mono text-sm"
                  placeholder="<p>Hello Subscribers,</p>..."
                  required
                />
                <p className="text-xs text-dark-choc/40 mt-2">Basic HTML tags are supported.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-dark-choc/5">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="px-6 py-3 text-dark-choc/60 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  disabled={sending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center gap-2 bg-electric-blue text-white px-8 py-3 rounded-lg hover:bg-electric-blue/90 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Broadcast
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
