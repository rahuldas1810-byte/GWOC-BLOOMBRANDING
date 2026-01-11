"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Minus } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
        { text: "Hi there! 👋 Welcome to Bloom Branding. How can we help you elevate your brand today?", isUser: false },
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        // Add user message
        const userText = inputValue.trim();
        setMessages((prev) => [...prev, { text: userText, isUser: true }]);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    messages: [...messages, { text: userText, isUser: true }],
                    // CHANGE 1: Sending the current URL path for context awareness
                    currentPath: window.location.pathname 
                }),
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            setMessages((prev) => [...prev, { text: data.response, isUser: false }]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { text: "Sorry, I'm having trouble connecting to the server. Please try again later.", isUser: false },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="mb-4 bg-white border border-gray-100 rounded-2xl shadow-xl w-[350px] sm:w-[380px] overflow-hidden pointer-events-auto flex flex-col max-h-[600px]"
                    >
                        {/* Header */}
                        <div className="bg-[#7C3AED] p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Bloom Support</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-xs text-white/90">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={toggleChat}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px] bg-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.isUser
                                                ? "bg-[#7C3AED] text-white rounded-br-sm"
                                                : "bg-[#F3F4F6] text-gray-800 rounded-bl-sm"
                                            }`}
                                    >
                                        <div className="markdown-content">
                                            <ReactMarkdown
                                                components={{
                                                    // CHANGE 2: Updated button text color to Purple (#7C3AED) to match theme
                                                    a: ({ node, ...props }) => (
                                                        <a 
                                                            {...props} 
                                                            className="inline-block mt-2 px-4 py-2 bg-white text-[#7C3AED] font-bold rounded-lg text-xs hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                        />
                                                    )
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-[#F3F4F6] text-gray-800 rounded-bl-sm rounded-2xl p-3">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] border border-gray-200 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="absolute right-2 p-1.5 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] disabled:opacity-50 disabled:hover:bg-[#7C3AED] transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-center mt-2">
                                <p className="text-[10px] text-gray-400">Powered by Bloom AI</p>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
                onClick={toggleChat}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto w-14 h-14 rounded-full bg-[#7C3AED] shadow-lg shadow-[#7C3AED]/30 flex items-center justify-center text-white relative group overflow-hidden"
            >
                {isHovered && !isOpen && (
                    <span className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
                )}

                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                        >
                            <Minus className="w-7 h-7" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ opacity: 0, rotate: 90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: -90 }}
                        >
                            <MessageCircle className="w-7 h-7 fill-white/20" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}