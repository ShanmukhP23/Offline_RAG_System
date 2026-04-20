import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api/client';
import { Send, User, Bot, FileText } from 'lucide-react';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message
        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await sendChatMessage(input);
            setMessages([...newMessages, {
                role: 'assistant',
                content: response.data.answer,
                citations: response.data.citations
            }]);
        } catch (error) {
            console.error(error);
            setMessages([...newMessages, {
                role: 'assistant',
                content: "Sorry, I encountered an error while processing your request."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md border border-gray-200">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <Bot className="w-16 h-16 text-gray-300 mb-4" />
                        <p>I'm your offline multimodal AI assistant.</p>
                        <p className="text-sm mt-2">Upload some documents and ask me anything about them!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-5 h-5 text-blue-600" />
                                </div>
                            )}

                            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`p-3 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-sm'
                                        : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                                    }`}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                </div>

                                {msg.citations && msg.citations.length > 0 && (
                                    <div className="mt-2 w-full">
                                        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Sources:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {msg.citations.map((cite, cIdx) => (
                                                <div key={cIdx} className="group relative flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded text-xs text-blue-600 hover:bg-blue-50 cursor-pointer">
                                                    <FileText className="w-3 h-3" />
                                                    <span className="truncate max-w-[150px]">{cite.filename}</span>

                                                    {/* Tooltip for the citation chunk */}
                                                    <div className="absolute hidden group-hover:block bottom-full left-0 mb-1 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10 whitespace-normal">
                                                        <p className="font-semibold mb-1 opacity-80">Distance: {cite.distance.toFixed(3)}</p>
                                                        <p className="line-clamp-4 leading-relaxed">{cite.chunk}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </div>
                    ))
                )}

                {isLoading && (
                    <div className="flex gap-4 justify-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-blue-600 animate-pulse" />
                        </div>
                        <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-sm text-gray-500 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="flex items-center gap-2 max-w-4xl mx-auto relative">
                    <input
                        type="text"
                        className="flex-1 border-gray-300 border rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow bg-white"
                        placeholder="Ask a question about your documents..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSend();
                        }}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-5 h-5 ml-[2px]" />
                    </button>
                </div>
            </div>
        </div>
    );
}
