'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NewsletterSection({ title, description }: { title?: string; description?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const displayTitle = title || "Subscribe to our Newsletter";
  const displayDesc = description || "Subscribe to our newsletter to receive daily updates.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setStatus('success');
      setMessage(data.message || 'Thanks for subscribing!');
      setEmail('');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Failed to subscribe. Please try again.');
    }
  };

  return (
    <section className="w-full bg-[#E5E2DC]/30 py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          
          {/* Left Column: Visual */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
             {/* ... (unchanged) ... */}
            <div className="relative group">
              {/* Dashed Circle */}
              <div className="absolute inset-0 border border-dashed border-[#2c2420]/20 rounded-full scale-125 md:scale-150 animate-[spin_60s_linear_infinite]" />
              
              {/* Image Container */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden bg-[#E5E2DC] flex items-center justify-center border border-[#2c2420]/10 shadow-sm z-10">
                <img 
                  src="https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&q=80&w=600" 
                  alt="Newsletter" 
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay Icon */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#2c2420]/10 backdrop-blur-[1px]">
                  <div className="bg-[#F2F0E9]/90 p-4 rounded-full shadow-lg">
                    <Mail className="w-6 h-6 md:w-8 md:h-8 text-[#2c2420]" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#2c2420] leading-tight">
                {displayTitle}
              </h2>
              <p className="text-[#2c2420]/70 text-lg font-sans max-w-md mx-auto md:mx-0">
                {displayDesc}
              </p>
            </motion.div>

            <motion.form 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="w-full max-w-md flex flex-col gap-4"
            >
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2c2420]/40" />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                  required
                  className="w-full pl-12 pr-6 py-4 bg-white/50 border border-[#2c2420]/10 rounded-full focus:outline-none focus:ring-1 focus:ring-[#2c2420]/20 focus:bg-white transition-all text-[#2c2420] placeholder:text-[#2c2420]/40 font-sans"
                />
              </div>

              <div className="flex flex-col items-center md:items-start gap-4">
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full md:w-auto px-10 py-4 bg-[#2c2420] text-[#F2F0E9] rounded-full font-medium hover:bg-[#2c2420]/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                       Processing...
                    </span>
                  ) : status === 'success' ? (
                    <span className="flex items-center gap-2">
                      Subscribed
                    </span>
                  ) : (
                    'Subscribe'
                  )}
                </button>

                {message && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-sm ${status === 'error' ? 'text-red-500' : 'text-[#2c2420]'}`}
                  >
                    {message}
                  </motion.p>
                )}
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}
