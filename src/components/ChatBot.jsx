import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle } from "lucide-react";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hi there! I'm your Smart Parking Assistant. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://smart-parking-etvw.onrender.com/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        }
      );

      const data = await res.json();
      const botMsg = {
        from: "bot",
        text: data.response || "⚠️ No response received.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "❌ Error connecting to chatbot API. Try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-[#1A1A2E] to-[#16213E] hover:opacity-90 text-white p-3 rounded-full shadow-lg border border-[#2C2C54]"
        >
          <MessageCircle size={32} />
        </button>
      )}

      {open && (
        <div className="w-80 sm:w-96 h-96 border border-[#2C2C54] rounded-2xl shadow-2xl flex flex-col bg-gradient-to-b from-[#0A0A0B] via-[#1A1A2E] to-[#16213E] text-white">
          {/* Header */}
          <div className="bg-[#1A1A2E] text-white flex justify-between items-center px-4 py-3 border-b border-[#2C2C54] rounded-t-2xl">
            <h3 className="font-semibold">Smart Parking Assistant</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-sm bg-[#16213E] px-2 py-1 rounded-lg hover:bg-[#0A0A0B] border border-[#2C2C54]"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-[#0A0A0B]/40">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-xl max-w-[75%] ${
                    msg.from === "user"
                      ? "bg-[#1A1A2E] text-blue-200 border border-[#2C2C54] rounded-br-none"
                      : "bg-[#16213E] text-gray-200 border border-[#2C2C54] rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-gray-400 text-sm animate-pulse">
                Assistant is typing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center border-t border-[#2C2C54] p-2 bg-[#0A0A0B] rounded-b-2xl">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border border-[#2C2C54] rounded-full px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-gradient-to-r from-[#1A1A2E] to-[#16213E] text-white p-2 rounded-full hover:opacity-90 border border-[#2C2C54]"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
