'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Send, Loader2, RefreshCw, Mail, CheckCircle, XCircle, Ban, ArrowRightCircle, AlertTriangle, Search, Filter, ArrowUpDown } from 'lucide-react';
import { toast } from '@/components/admin/Toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Subscriber {
  _id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmLabel?: string;
  isDestructive?: boolean;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

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
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscribers = subscribers
    .filter(sub => {
      const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.subscribedAt).getTime();
      const dateB = new Date(b.subscribedAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const openConfirm = (config: Omit<ConfirmState, 'isOpen'>) => {
    setConfirmModal({ ...config, isOpen: true });
  };

  const handleSendUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    openConfirm({
      title: 'Send Broadcast',
      message: `Are you sure you want to send this email to ${subscribers.filter(s => s.status === 'active').length} active subscribers? This action cannot be undone.`,
      confirmLabel: 'Yes, Send Now',
      onConfirm: async () => {
        setSending(true);
        try {
          const response = await api.sendNewsletterUpdate({ subject, message });
          if (response.success) {
            toast.success(response.message || 'Newsletter sent successfully!');
            setShowSendModal(false);
            setSubject('');
            setMessage('');
          } else {
            toast.error(response.message || 'Failed to send newsletter.');
          }
        } catch (error: any) {
          toast.error(error.message || 'An unexpected error occurred.');
        } finally {
          setSending(false);
        }
      }
    });
  };

  const handleManageSubscriber = async (email: string, action: 'deactivate' | 'reactivate') => {
    if (processingSub) return;

    openConfirm({
      title: action === 'deactivate' ? 'Deactivate Subscriber' : 'Reactivate Subscriber',
      message: `Are you sure you want to ${action} ${email}?`,
      confirmLabel: action === 'deactivate' ? 'Deactivate' : 'Reactivate',
      isDestructive: action === 'deactivate',
      onConfirm: async () => {
        setProcessingSub(email);
        try {
          const response = await api.manageSubscriber(email, action);
          if (response.success) {
            setSubscribers(prev => prev.map(sub =>
              sub.email === email
                ? { ...sub, status: action === 'deactivate' ? 'unsubscribed' : 'active' }
                : sub
            ));
            toast.success(`Subscriber ${action === 'deactivate' ? 'deactivated' : 'reactivated'} successfully`);
          } else {
            toast.error(response.message || 'Failed to update subscriber');
          }
        } catch (error: any) {
          toast.error(error.message || 'An error occurred');
        } finally {
          setProcessingSub(null);
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-earl-gray/10 pb-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-choc">Newsletter</h1>
            <p className="text-dark-choc/60 mt-1 text-sm sm:base">Manage subscribers and send updates.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-3"
          >
            <button
              onClick={fetchSubscribers}
              className="hidden sm:flex items-center justify-center p-3 rounded-xl bg-white border border-dark-choc/5 text-dark-choc/50 hover:text-electric-blue transition-all"
              title="Refresh List"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowSendModal(true)}
              className="flex items-center justify-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-xl hover:bg-electric-blue/90 transition-all shadow-md active:scale-95 w-full sm:w-auto font-semibold"
            >
              <Send className="w-5 h-5" />
              <span>Send New Update</span>
            </button>
          </motion.div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-choc/20 group-focus-within:text-electric-blue transition-colors" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-dark-choc/5 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue transition-all text-sm font-medium"
            />
          </div>
          <div className="md:col-span-3">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-choc/30" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full pl-10 pr-4 py-3.5 bg-white border border-dark-choc/5 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue transition-all text-sm font-bold text-dark-choc/70 appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="unsubscribed">Stopped Only</option>
              </select>
            </div>
          </div>
          <div className="md:col-span-3">
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-dark-choc/5 rounded-2xl shadow-sm hover:bg-gray-50 transition-all text-sm font-bold text-dark-choc/70"
            >
              <span className="flex items-center gap-2 text-dark-choc/40">
                <ArrowUpDown className="w-4 h-4" />
                Sort:
              </span>
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-dark-choc/5 overflow-hidden">
          <div className="p-3 sm:p-6 border-b border-dark-choc/5 flex justify-between items-center bg-white/50">
            <h2 className="font-bold text-base sm:text-lg text-dark-choc flex items-center gap-2 min-w-0">
              <span className="truncate">Subscribers</span>
              <span className="bg-electric-blue/10 text-electric-blue text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-tighter shrink-0">
                {filteredSubscribers.length} Result{filteredSubscribers.length !== 1 ? 's' : ''}
              </span>
            </h2>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-electric-blue hover:underline"
              >
                Clear Results
              </button>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-earl-gray/30 text-dark-choc/70 text-[10px] font-black uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-6 py-5">Email Address</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 hidden lg:table-cell">Subscription Date</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-choc/5">
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <Search className="w-10 h-10" />
                        <p className="text-sm font-bold">No matching subscribers found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((sub) => (
                    <tr key={sub._id} className="hover:bg-earl-gray/10 transition-colors group">
                      <td className="px-6 py-4 text-dark-choc">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-electric-blue/5 flex items-center justify-center text-electric-blue shrink-0 group-hover:bg-electric-blue/10 transition-colors">
                            <Mail className="w-4 h-4" />
                          </div>
                          <span className="truncate max-w-[250px] font-medium" title={sub.email}>{sub.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${sub.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                          }`}>
                          {sub.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{sub.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-dark-choc/60 text-sm hidden lg:table-cell">
                        {new Date(sub.subscribedAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {sub.status === 'active' ? (
                            <button
                              onClick={() => handleManageSubscriber(sub.email, 'deactivate')}
                              disabled={processingSub === sub.email}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all disabled:opacity-50"
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
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 transition-all disabled:opacity-50"
                            >
                              {processingSub === sub.email ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <ArrowRightCircle className="w-3.5 h-3.5" />
                              )}
                              Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="md:hidden divide-y divide-dark-choc/5">
            <AnimatePresence mode="popLayout">
              {filteredSubscribers.length === 0 ? (
                <div className="px-6 py-20 text-center opacity-30">
                  <p className="text-sm font-bold">No matching subscribers found</p>
                </div>
              ) : (
                filteredSubscribers.map((sub, idx) => (
                  <motion.div
                    layout
                    key={sub._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-electric-blue/5 flex items-center justify-center text-electric-blue shrink-0">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-dark-choc truncate text-base" title={sub.email}>
                            {sub.email}
                          </p>
                          <p className="text-xs text-dark-choc/40 font-medium">
                            Since {new Date(sub.subscribedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 ${sub.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${sub.status === 'active' ? 'bg-green-600' : 'bg-red-600'} animate-pulse shrink-0`} />
                        {sub.status === 'active' ? 'Active' : 'Stopped'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {sub.status === 'active' ? (
                        <button
                          onClick={() => handleManageSubscriber(sub.email, 'deactivate')}
                          disabled={processingSub === sub.email}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 active:scale-95 transition-all disabled:opacity-50"
                        >
                          {processingSub === sub.email ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Ban className="w-4 h-4" />
                          )}
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleManageSubscriber(sub.email, 'reactivate')}
                          disabled={processingSub === sub.email}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-green-600 bg-green-50 hover:bg-green-100 active:scale-95 transition-all disabled:opacity-50"
                        >
                          {processingSub === sub.email ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ArrowRightCircle className="w-4 h-4" />
                          )}
                          Reactivate
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Send Modal */}
      <AnimatePresence>
        {showSendModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSendModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white sm:rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 flex flex-col h-full sm:h-auto max-h-[100dvh] sm:max-h-[90vh]"
            >
              <div className="p-4 sm:p-6 border-b border-dark-choc/5 flex justify-between items-center bg-gray-50/50 shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-dark-choc">New Broadcast</h3>
                  <p className="text-xs text-dark-choc/50 mt-0.5">Push updates to all active subscribers</p>
                </div>
                <button
                  onClick={() => setShowSendModal(false)}
                  className="p-2 bg-dark-choc/5 rounded-full text-dark-choc/40 hover:text-red-500 hover:bg-red-50 transition-all"
                  disabled={sending}
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSendUpdate} className="p-4 sm:p-6 space-y-6 overflow-y-auto">
                <div className="bg-electric-blue/5 text-electric-blue p-4 rounded-xl text-sm border border-electric-blue/10 flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-electric-blue/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <p className="font-medium text-electric-blue/80">Recipient Base: <span className="font-bold text-electric-blue">{subscribers.filter(s => s.status === 'active').length}</span> active subscribers.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-dark-choc/70 ml-1">Subject Line</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-5 py-4 bg-earl-gray/10 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all placeholder:text-dark-choc/20 font-medium"
                    placeholder="Enter message subject..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-dark-choc/70 ml-1">Message Body (Rich HTML)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-5 py-4 bg-earl-gray/10 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-electric-blue/5 focus:border-electric-blue outline-none transition-all min-h-[200px] placeholder:text-dark-choc/20 font-mono text-sm leading-relaxed"
                    placeholder="<p>Dear Subscribers,</p>..."
                    required
                  />
                  <div className="flex items-center gap-2 p-2 bg-dark-choc/5 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-dark-choc/30" />
                    <p className="text-[10px] text-dark-choc/40 font-bold uppercase tracking-widest">Supported Tags: b, i, p, a, h1, h2, ul, li</p>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-dark-choc/5">
                  <button
                    type="button"
                    onClick={() => setShowSendModal(false)}
                    className="px-8 py-4 text-dark-choc/60 hover:bg-earl-gray/30 rounded-xl transition-all font-bold text-sm"
                    disabled={sending}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-electric-blue text-white px-10 py-4 rounded-xl hover:bg-electric-blue/90 transition-all shadow-xl shadow-electric-blue/20 active:scale-95 disabled:opacity-70 font-bold"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Dispatching...
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-[110] p-8 text-center"
            >
              <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${confirmModal.isDestructive ? 'bg-red-50 text-red-500' : 'bg-electric-blue/5 text-electric-blue'}`}>
                {confirmModal.isDestructive ? <AlertTriangle className="w-10 h-10" /> : <CheckCircle className="w-10 h-10" />}
              </div>
              <h3 className="text-2xl font-black text-dark-choc mb-2 tracking-tight">{confirmModal.title}</h3>
              <p className="text-dark-choc/60 font-medium mb-8 leading-relaxed px-4">{confirmModal.message}</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    confirmModal.onConfirm();
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                  }}
                  className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 ${confirmModal.isDestructive ? 'bg-red-600 text-white shadow-xl shadow-red-200' : 'bg-electric-blue text-white shadow-xl shadow-electric-blue/20'}`}
                >
                  {confirmModal.confirmLabel || 'Confirm'}
                </button>
                <button
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="w-full py-4 rounded-2xl font-bold text-dark-choc/40 hover:bg-dark-choc/5 transition-all active:scale-95"
                >
                  Go Back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
