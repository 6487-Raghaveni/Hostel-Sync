import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = { role: "user" | "assistant"; content: string };

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "👋 Hi! I'm the Hostel Sync AI Assistant. I can help you with:\n\n• Raising complaints\n• Checking complaint status\n• Understanding hostel policies\n• Navigating the platform\n\nHow can I help you today?",
};

const SAMPLE_RESPONSES: Record<string, string> = {
  complaint: "To raise a complaint, go to your **Student Dashboard** → **Raise Complaint**. Select the domain (Electrical, Plumbing, etc.), describe the issue, and submit. You'll receive a ticket ID for tracking.",
  status: "You can check your complaint status in the **Student Dashboard** → **My Complaints** section. Each complaint has a real-time tracker: Submitted → Accepted → Assigned → In Progress → Resolved.",
  hostel: "Hostel Sync supports multiple hostels with gender-based access control. Your warden manages complaints specific to your hostel block.",
  worker: "Workers are auto-assigned based on the complaint domain. They can view tasks, update progress, and mark issues as resolved through their dashboard.",
  warden: "Wardens can review, accept, or reject complaints. They assign priority levels and route tasks to domain-specific workers.",
  help: "I can assist with complaint submission, status tracking, hostel policies, and platform navigation. Just ask me anything!",
};

function getResponse(input: string): Promise<string> {
  const lower = input.toLowerCase();
  return new Promise((resolve) => {
    setTimeout(() => {
      for (const [key, response] of Object.entries(SAMPLE_RESPONSES)) {
        if (lower.includes(key)) return resolve(response);
      }
      resolve("Thanks for your question! In the full version, I'm powered by AI to give you detailed answers. For now, try asking about **complaints**, **status tracking**, **hostels**, **workers**, or **wardens**.");
    }, 800 + Math.random() * 700);
  });
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    const reply = await getResponse(text);
    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              size="lg"
              onClick={() => setOpen(true)}
              className="h-14 w-14 rounded-full shadow-glow gradient-hero p-0"
            >
              <MessageCircle className="h-6 w-6 text-primary-foreground" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] sm:w-[400px] h-[520px] rounded-2xl border border-border bg-card shadow-card-hover flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border gradient-hero">
              <div className="flex items-center gap-2 text-primary-foreground">
                <Bot className="h-5 w-5" />
                <span className="font-semibold text-sm">Hostel Sync AI</span>
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-primary-foreground hover:bg-white/20" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 h-7 w-7 rounded-full gradient-hero-soft flex items-center justify-center mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "gradient-hero text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.content.split("\n").map((line, j) => (
                      <span key={j}>
                        {line.split(/(\*\*.*?\*\*)/).map((part, k) =>
                          part.startsWith("**") && part.endsWith("**") ? (
                            <strong key={k}>{part.slice(2, -2)}</strong>
                          ) : (
                            part
                          )
                        )}
                        {j < msg.content.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-muted flex items-center justify-center mt-0.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="h-7 w-7 rounded-full gradient-hero-soft flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="bg-muted rounded-xl px-3 py-2 rounded-bl-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                />
                <Button type="submit" size="icon" disabled={!input.trim() || loading} className="h-9 w-9 rounded-lg">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-[10px] text-muted-foreground text-center mt-2">Powered by Hostel Sync AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
