"use client";

import {
  CheckCheck,
  CircleDashed,
  MessageSquare,
  Mic,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Smile,
  Users,
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
    await processMessage(input.trim());
  };

  const sendSuggestion = async (text: string) => {
    await processMessage(text);
  };

  const processMessage = async (messageText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: messageText,
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

  const dummyChats = [
    {
      name: "KREDO Business",
      lastMsg: "I didn't understand that.",
      time: "11:42 AM",
      active: true,
      initial: "K",
      color: "bg-[#dfe5e7]",
    },
    {
      name: "Dairy Cooperative",
      lastMsg: "Your milk delivery was logged.",
      time: "Yesterday",
      active: false,
      initial: "D",
      color: "bg-[#b3e5fc]",
    },
    {
      name: "Agronomist John",
      lastMsg: "Make sure to water the crops",
      time: "Monday",
      active: false,
      initial: "A",
      color: "bg-[#c8e6c9]",
    },
    {
      name: "Input Supplier",
      lastMsg: "Fertilizer is ready for pickup.",
      time: "Sunday",
      active: false,
      initial: "I",
      color: "bg-[#ffccbc]",
    },
  ];

  return (
    <div className="flex w-full h-full bg-[#f0f2f5] font-sans overflow-hidden">
      {/* Left Sidebar (Chat List) */}
      <div className="w-[30%] min-w-75 max-w-103.75 flex flex-col bg-[#ffffff] border-r border-[#d1d7db] z-20">
        {/* Sidebar Header */}
        <div className="bg-[#f0f2f5] px-4 py-2.5 h-14.75 flex items-center justify-between shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#dfe5e7] flex items-center justify-center overflow-hidden shrink-0 cursor-pointer">
            <svg
              viewBox="0 0 32 32"
              className="w-full h-full text-[#cfd4d6]"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M16 16.5c-3.1 0-5.6-2.5-5.6-5.6S12.9 5.3 16 5.3s5.6 2.5 5.6 5.6-2.5 5.6-5.6 5.6zm0 2.2c4.1 0 12.3 2 12.3 6.1v2H3.7v-2c0-4 8.2-6.1 12.3-6.1z"
              />
            </svg>
          </div>
          <div className="flex items-center gap-4 text-[#54656f]">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-[#d9dce0] transition-colors"
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-[#d9dce0] transition-colors"
            >
              <CircleDashed className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-[#d9dce0] transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-[#d9dce0] transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-[#ffffff] px-3 py-2 border-b border-[#f2f2f2] shrink-0">
          <div className="bg-[#f0f2f5] rounded-lg flex items-center px-3 h-8.75">
            <Search className="w-4 h-4 text-[#54656f] mr-4 shrink-0" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-[#111b21] text-[15px] placeholder:text-[#8696a0] w-full"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#cccccc] scrollbar-track-transparent">
          {dummyChats.map((chat) => (
            <div
              key={chat.name}
              className={`flex items-center px-3 h-18 cursor-pointer hover:bg-[#f5f6f6] transition-colors ${chat.active ? "bg-[#f0f2f5]" : ""}`}
            >
              <div
                className={`w-12.25 h-12.25 rounded-full mr-3 shrink-0 flex items-center justify-center text-[#54656f] font-bold text-xl ${chat.color}`}
              >
                {chat.initial}
              </div>
              <div className="flex-1 h-full flex flex-col justify-center border-b border-[#f2f2f2] pr-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#111b21] text-[17px] leading-snug">
                    {chat.name}
                  </span>
                  <span className="text-[#667781] text-[12px]">
                    {chat.time}
                  </span>
                </div>
                <div className="text-[#667781] text-[14px] truncate leading-snug mt-0.5 max-w-50">
                  {chat.lastMsg}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane (Active Chat) */}
      <div className="flex-1 flex flex-col relative bg-[#efeae2]">
        {/* Background doodle overlay */}
        <div
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")',
            backgroundRepeat: "repeat",
            opacity: 0.06,
          }}
        />

        {/* Active Chat Header */}
        <div className="bg-[#f0f2f5] px-4 py-2.5 h-14.75 flex items-center justify-between shrink-0 border-l border-[#d1d7db] z-10">
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
                className={`flex flex-col mb-1 ${isUser ? "items-end" : "items-start"}`}
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

                {/* Onboarding Suggestions */}
                {!isUser && index === 0 && messages.length === 1 && (
                  <div className="mt-1.5 flex flex-col gap-1.5 w-[65%] min-w-50">
                    <button
                      type="button"
                      onClick={() => sendSuggestion("SCORE")}
                      className="bg-[#ffffff] text-[#00a884] font-medium py-2 px-3 rounded-md shadow-[0_1px_0.5px_rgba(11,20,26,.13)] hover:bg-[#f5f6f6] transition-colors text-[14.2px] text-center"
                    >
                      View Trust Score
                    </button>
                    <button
                      type="button"
                      onClick={() => sendSuggestion("IMPROVE")}
                      className="bg-[#ffffff] text-[#00a884] font-medium py-2 px-3 rounded-md shadow-[0_1px_0.5px_rgba(11,20,26,.13)] hover:bg-[#f5f6f6] transition-colors text-[14.2px] text-center"
                    >
                      Improve Credit
                    </button>
                    <button
                      type="button"
                      onClick={() => sendSuggestion("YES")}
                      className="bg-[#ffffff] text-[#00a884] font-medium py-2 px-3 rounded-md shadow-[0_1px_0.5px_rgba(11,20,26,.13)] hover:bg-[#f5f6f6] transition-colors text-[14.2px] text-center"
                    >
                      Consent to Loan
                    </button>
                  </div>
                )}
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
    </div>
  );
}
