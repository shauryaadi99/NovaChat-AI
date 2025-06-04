import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { Moon, Sun, Send, Copy } from "lucide-react";
import clsx from "clsx";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const welcomeMessage = {
      role: "assistant",
      content: "Hello! How can I help you today?",
    };
    setMessages([welcomeMessage]);
  }, []);

  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3-8b-instruct",
            messages: updatedMessages,
          }),
        }
      );

      const data = await response.json();

      if (data?.choices?.[0]?.message) {
        setMessages((prev) => [...prev, data.choices[0].message]);
      } else {
        console.error("No valid response from API:", data);
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);
  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  return (
    <div
      className={clsx(
        "flex items-center justify-center min-h-screen font-sans px-4 transition-all duration-300",
        darkMode
          ? "bg-gradient-to-br from-[#141e30] via-[#243b55] to-[#141e30] text-white"
          : "bg-gradient-to-br from-white via-[#e6ecff] to-white text-gray-900"
      )}
    >
      <div className="w-full max-w-3xl rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 backdrop-blur-2xl bg-white/30 dark:bg-zinc-800/40 transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 bg-gradient-to-r from-[#4169e1] to-[#7baaf7] text-white shadow-md">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-widest text-white">
            ✨ NovaChat AI
          </h2>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Chat Window */}
        <div
          ref={chatContainerRef}
          className={clsx(
            "h-[65vh] overflow-y-auto px-6 py-4 space-y-4 transition-colors duration-300 scroll-smooth",
            darkMode ? "bg-zinc-900/40 text-white" : "bg-white/40 text-gray-900"
          )}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={clsx(
                "flex w-full",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                style={{ animation: "bubbleBounce 0.35s ease-out" }}
                className={clsx(
                  "flex items-center max-w-[80%] md:max-w-[70%] gap-2",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-sm shadow">
                  {msg.role === "user" ? "👤" : "🤖"}
                </div>

                {/* Message bubble */}
                <div
                  className={clsx(
                    "px-4 py-3 rounded-xl text-sm shadow-md border backdrop-blur-md",
                    msg.role === "user"
                      ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-right border-blue-200/20"
                      : "bg-white/80 dark:bg-zinc-700/70 text-gray-900 dark:text-gray-100 border-white/10"
                  )}
                >
                  <p className="leading-relaxed break-words whitespace-pre-wrap">
                    {msg.content}
                  </p>

                  {msg.role !== "user" && (
                    <button
                      onClick={() => copyToClipboard(msg.content)}
                      className="text-xs mt-2 flex items-center gap-1 text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <Copy size={14} />
                      Copy
                    </button>
                  )}
                </div>
              </div>
              {/* {msg.role !== "user" && {
                boxShadow: "0 2px 6px rgba(65, 105, 225, 0.1)",
                borderLeft: "3px solid #4169e1",
              }} */}

              {/* Inline keyframes */}
              <style>{`
      @keyframes bubbleBounce {
        0% {
          transform: translateY(10px);
          opacity: 0;
        }
        100% {
          transform: translateY(0px);
          opacity: 1;
        }
      }
    `}</style>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 px-4 mt-2 animate-pulse">
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#3b82f6",
                  borderRadius: "50%",
                  animation: "bounce 1s infinite",
                  animationDelay: "0s",
                }}
              />
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#3b82f6",
                  borderRadius: "50%",
                  animation: "bounce 1s infinite",
                  animationDelay: "0.2s",
                }}
              />
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#3b82f6",
                  borderRadius: "50%",
                  animation: "bounce 1s infinite",
                  animationDelay: "0.4s",
                }}
              />
              <span className="text-sm italic text-blue-500 ml-2">
                Thinking...
              </span>

              <style>{`
      @keyframes bounce {
        0%, 80%, 100% {
          transform: scale(0.5);
          opacity: 0.6;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `}</style>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-3 px-5 py-4 bg-white/30 dark:bg-zinc-800/40 backdrop-blur-md border-t border-white/20 dark:border-zinc-700">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type something brilliant..."
            rows={1}
            className="flex-grow resize-none bg-transparent outline-none text-sm px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-[#4169e1] placeholder-gray-600"
          />
          <button
            onClick={handleSend}
            className="p-3 bg-gradient-to-br from-[#4169e1] to-[#5b8efc] hover:from-[#355bc7] hover:to-[#4d7de6] active:scale-95 text-white rounded-full transition shadow-md hover:shadow-xl disabled:opacity-50"
            disabled={loading}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
