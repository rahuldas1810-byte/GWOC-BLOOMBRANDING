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
                        className="mb-4 bg-[#E8E6D8] border border-[#624A41]/10 rounded-2xl shadow-2xl w-[350px] sm:w-[400px] overflow-hidden pointer-events-auto flex flex-col max-h-[600px]"
                        style={{
                            boxShadow: '0 25px 50px -12px rgba(98, 74, 65, 0.25), 0 0 0 1px rgba(98, 74, 65, 0.05)'
                        }}
                    >
                        {/* Header - Premium Dark Chocolate gradient */}
                        <div className="bg-gradient-to-r from-[#624A41] via-[#725850] to-[#624A41] p-5 flex items-center justify-between relative overflow-hidden">
                            {/* Subtle pattern overlay */}
                            <div
                                className="absolute inset-0 opacity-[0.03]"
                                style={{
                                    backgroundImage: `radial-gradient(circle at 1px 1px, #BDAF62 1px, transparent 0)`,
                                    backgroundSize: '20px 20px',
                                }}
                            />
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-[#BDAF62]/20 border border-[#BDAF62]/30 flex items-center justify-center backdrop-blur-sm">
                                    <MessageCircle className="w-5 h-5 text-[#BDAF62]" />
                                </div>
                                <div>
                                    <h3 className="font-serif text-[#E8E6D8] text-base tracking-wide">Bloom Support</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-[#BDAF62] animate-pulse shadow-sm shadow-[#BDAF62]/50" />
                                        <span className="text-xs text-[#E8E6D8]/70 font-mono uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={toggleChat}
                                className="p-2 hover:bg-[#E8E6D8]/10 rounded-full transition-all duration-300 text-[#E8E6D8] relative z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area - Earl Gray background */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px] bg-[#E8E6D8] scrollbar-thin scrollbar-thumb-[#624A41]/20 scrollbar-track-transparent">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                    className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-4 text-sm leading-relaxed ${msg.isUser
                                            ? "bg-[#2C4494] text-white rounded-2xl rounded-br-md shadow-md shadow-[#2C4494]/20"
                                            : "bg-white/80 backdrop-blur-sm text-[#624A41] rounded-2xl rounded-bl-md border border-[#624A41]/10 shadow-sm"
                                            }`}
                                    >
                                        <div className="markdown-content">
                                            <ReactMarkdown
                                                components={{
                                                    a: ({ node, ...props }) => (
                                                        <a
                                                            {...props}
                                                            className="inline-block mt-2 px-4 py-2 bg-[#2C4494] text-white font-mono text-xs uppercase tracking-wider rounded-full hover:bg-[#1E3570] transition-all duration-300 shadow-sm"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        />
                                                    ),
                                                    p: ({ node, ...props }) => (
                                                        <p {...props} className="text-inherit" />
                                                    ),
                                                    strong: ({ node, ...props }) => (
                                                        <strong {...props} className="font-semibold text-inherit" />
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
                                    <div className="bg-white/80 backdrop-blur-sm text-[#624A41] rounded-2xl rounded-bl-md border border-[#624A41]/10 p-4 shadow-sm">
                                        <div className="flex gap-1.5">
                                            <span className="w-2 h-2 bg-[#BDAF62] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2 h-2 bg-[#BDAF62] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-2 h-2 bg-[#BDAF62] rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area - Refined styling */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white/50 backdrop-blur-sm border-t border-[#624A41]/10">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full bg-white text-[#624A41] placeholder-[#624A41]/40 rounded-full py-3.5 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C4494]/30 border border-[#624A41]/15 transition-all duration-300 shadow-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="absolute right-2 p-2.5 bg-[#2C4494] text-white rounded-full hover:bg-[#1E3570] disabled:opacity-40 disabled:hover:bg-[#2C4494] transition-all duration-300 shadow-md hover:shadow-lg disabled:shadow-sm"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-center mt-3">
                                <p className="text-[10px] text-[#624A41]/50 font-mono uppercase tracking-widest">Powered by Bloom AI</p>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button - Electric Blue with premium styling */}
            <motion.button
                onClick={toggleChat}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-br from-[#3E2B26] to-[#5A4238] shadow-xl shadow-[#3E2B26]/40 flex items-center justify-center text-white relative group overflow-hidden border border-white/10"
            >
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/10" />

                {isHovered && !isOpen && (
                    <span className="absolute inset-0 rounded-full border-2 border-[#BDAF62]/50 animate-ping" />
                )}

                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            className="relative z-10"
                        >
                            <Minus className="w-7 h-7" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ opacity: 0, rotate: 90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: -90 }}
                            className="relative z-10"
                        >
                            <MessageCircle className="w-7 h-7 fill-white/20" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}