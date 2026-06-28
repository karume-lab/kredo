"use client";

import {
  CheckCheck,
  Mic,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Smile,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export default function WhatsAppSimulator() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Welcome to KREDO Support. Type 'Score' to view your Trust Score or 'Improve' for actionable guides. You can also type 'YES' to consent to a pending loan evaluation.",
      timestamp: "",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages((prev) => [
      {
        ...prev[0],
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...prev.slice(1),
    ]);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Process intent
    const text = userMessage.text.toUpperCase();
    let botResponse = "";

    // Slight delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (text === "SCORE") {
      botResponse =
        "Your KREDO Trust Score: Healthy (4 / 5 Active Trust Links Verified). You have 1 active cooperative member link, 2 verified peer guarantors, and 1 active input supplier transaction account.";
    } else if (text === "IMPROVE") {
      botResponse =
        "To increase your credit limit from KES 30,000 to KES 45,000: 1) Maintain milk deliveries for 3 more days this month, or 2) ask a third cooperative member to vouch for you.";
    } else if (text === "YES") {
      botResponse =
        "Consent verified successfully. KREDO evaluation unlocked. Your loan officer will contact you shortly.";
      try {
        await fetch("/api/consent/confirm", { method: "POST" });
      } catch (err) {
        console.error("Failed to notify consent endpoint", err);
      }
    } else {
      botResponse =
        "I didn't understand that. Try typing 'Score', 'Improve', or 'YES' if you have a pending evaluation request.";
    }

    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#efeae2] font-sans relative">
      {/* Background doodle overlay (simulated with a pattern if needed, but solid color is fine for now) */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")',
          backgroundRepeat: "repeat",
          opacity: 0.06,
        }}
      />

      {/* Header */}
      <div className="bg-[#f0f2f5] px-4 py-2.5 flex items-center justify-between shrink-0 border-b border-[#d1d7db] z-10">
        <div className="flex items-center gap-4 cursor-pointer">
          <div className="w-10 h-10 bg-[#dfe5e7] rounded-full flex items-center justify-center text-[#54656f] font-bold text-lg overflow-hidden shrink-0">
            K
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#111b21] text-[16px] leading-5">
              KREDO Business
            </span>
            <span className="text-[13px] text-[#667781] leading-4">
              bot account
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-[#54656f]">
          <button
            type="button"
            className="hover:bg-[#d9dce0] p-2 rounded-full transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="hover:bg-[#d9dce0] p-2 rounded-full transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-[5%] md:px-[9%] py-4 space-y-2 z-10 scrollbar-thin scrollbar-thumb-[#cccccc] scrollbar-track-transparent">
        {messages.map((msg, index) => {
          const isUser = msg.sender === "user";
          const showTail =
            index === 0 || messages[index - 1].sender !== msg.sender;

          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[65%] rounded-md px-2.5 py-1.5 text-[14.2px] relative shadow-[0_1px_0.5px_rgba(11,20,26,.13)] ${
                  isUser
                    ? "bg-[#d9fdd3] text-[#111b21] rounded-tr-none"
                    : "bg-[#ffffff] text-[#111b21] rounded-tl-none"
                }`}
              >
                {/* Tail SVG */}
                {showTail && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 8 13"
                    className={`absolute top-0 w-2 h-3.25 ${
                      isUser
                        ? "-right-2 text-[#d9fdd3]"
                        : "-left-2 text-[#ffffff]"
                    }`}
                  >
                    {isUser ? (
                      <path
                        fill="currentColor"
                        d="M5.188 1H0v11.156L7.984 1.906c1.332-.977-.281-2.454-2.796-.906z"
                      />
                    ) : (
                      <path
                        fill="currentColor"
                        d="M1.533 3.118L8 12.156V1h-6.85c-1.332-.977 1.281-2.454 3.796-.906l-3.413 3.024z"
                      />
                    )}
                  </svg>
                )}

                <div className="leading-4.75 whitespace-pre-wrap">
                  {msg.text}
                </div>
                <div className="flex items-center justify-end gap-1 mt-0.5 text-[11px] text-[#667781] leading-3.75 float-right ml-3 translate-y-0.5">
                  {msg.timestamp}
                  {isUser && (
                    <CheckCheck className="w-3.75 h-3.75 text-[#53bdeb]" />
                  )}
                </div>
                {/* Clearfix for the float */}
                <div className="clear-both" />
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#ffffff] text-[#111b21] rounded-md rounded-tl-none px-4 py-3 shadow-[0_1px_0.5px_rgba(11,20,26,.13)] relative flex items-center gap-1.5 h-8.5">
              <svg
                aria-hidden="true"
                viewBox="0 0 8 13"
                className="absolute top-0 -left-2 w-2 h-3.25 text-[#ffffff]"
              >
                <path
                  fill="currentColor"
                  d="M1.533 3.118L8 12.156V1h-6.85c-1.332-.977 1.281-2.454 3.796-.906l-3.413 3.024z"
                />
              </svg>
              <span
                className="w-1.5 h-1.5 bg-[#8696a0] rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-[#8696a0] rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-[#8696a0] rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input Area */}
      <div className="bg-[#f0f2f5] px-4 py-2.5 flex items-center gap-3 shrink-0 z-10 min-h-15.5">
        <div className="flex items-center gap-4 text-[#54656f]">
          <button
            type="button"
            className="hover:text-[#3b4a54] transition-colors"
          >
            <Smile className="w-6.5 h-6.5 stroke-[1.5]" />
          </button>
          <button
            type="button"
            className="hover:text-[#3b4a54] transition-colors"
          >
            <Paperclip className="w-6 h-6 stroke-[1.5] -rotate-45" />
          </button>
        </div>

        <form onSubmit={handleSend} className="flex-1 flex items-end">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            className="flex-1 rounded-lg bg-[#ffffff] border-none focus:outline-none focus:ring-0 px-4 py-2.5 text-[15px] text-[#111b21] placeholder:text-[#8696a0] shadow-sm min-h-10.5"
          />
        </form>

        <div className="flex items-center text-[#54656f]">
          {input.trim() ? (
            <button
              type="button"
              onClick={handleSend}
              className="hover:text-[#3b4a54] transition-colors p-2"
            >
              <Send className="w-6 h-6 stroke-[1.5]" />
            </button>
          ) : (
            <button
              type="button"
              className="hover:text-[#3b4a54] transition-colors p-2"
            >
              <Mic className="w-6 h-6 stroke-[1.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
