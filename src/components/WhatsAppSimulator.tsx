"use client";

import { CheckCheck, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  isActionable?: boolean;
}

export default function WhatsAppSimulator() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Welcome to KREDO Support. Type 'Score' to view your Trust Score or 'Improve' for actionable guides. You can also type 'YES' to consent to a pending loan evaluation.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      // Simulate webhook to unlock
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
    <div className="flex flex-col h-full bg-muted rounded-xl overflow-hidden border border-border shadow-xl relative">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-3 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center font-bold text-lg">
          K
        </div>
        <div>
          <div className="font-semibold text-sm">KREDO Business</div>
          <div className="text-xs opacity-80">Bot Account</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-2 px-3 text-sm relative shadow-sm ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-card text-card-foreground border border-border rounded-tl-none"
              }`}
            >
              <div className="leading-relaxed">{msg.text}</div>
              <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-70">
                {msg.timestamp}
                {msg.sender === "user" && (
                  <CheckCheck className="w-3 h-3 text-primary-foreground" />
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-lg p-3 text-sm rounded-tl-none shadow-sm flex items-center gap-1">
              <span
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></span>
              <span
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-muted p-3 flex items-center gap-2 shrink-0 border-t border-border">
        <form onSubmit={handleSend} className="flex-1 flex gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            className="flex-1 rounded-full bg-background"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            className="rounded-full shrink-0"
          >
            <Send className="w-4 h-4 ml-1" />
          </Button>
        </form>
      </div>
    </div>
  );
}
