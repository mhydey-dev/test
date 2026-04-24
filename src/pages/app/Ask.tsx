import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, User, ShieldCheck } from "lucide-react";
import { aiSuggestions, cannedAnswers } from "@/lib/reputation-mock";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const FALLBACK = `Based on your on-chain footprint, your reputation is driven primarily by consistent DeFi behavior on Aave V3, a 3.2-year wallet age, and active DAO participation. The largest improvement levers right now are diversifying protocol exposure and linking a verified social attestation.`;

const Ask = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      const match = cannedAnswers.find(
        (c) => c.question.toLowerCase() === q.toLowerCase(),
      );
      const answer = match?.answer ?? FALLBACK;
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
      setThinking(false);
    }, 900);
  };

  return (
    <>
      <div className="flex-1 px-4 md:px-8 py-6  flex flex-col min-h-[calc(100vh-9rem)]">
        <Card className="flex-1 rounded-2xl border-border/60 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">
                  Ask anything about your reputation
                </h2>
                <p className="text-muted-foreground max-w-md mb-6">
                  Your data stays private. Answers are computed locally over
                  your encrypted on-chain history.
                </p>
                <div className="grid sm:grid-cols-2 gap-2 w-full max-w-2xl">
                  {aiSuggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left p-3 rounded-xl border border-border/60 hover:border-border hover:bg-muted/40 text-sm text-foreground transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={
                  "flex gap-3 " +
                  (m.role === "user" ? "justify-end" : "justify-start")
                }
              >
                {m.role === "assistant" && (
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap " +
                    (m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground")
                  }
                >
                  {m.content}
                </div>
                {m.role === "user" && (
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-foreground" />
                  </div>
                )}
              </motion.div>
            ))}

            {thinking && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                    <span
                      className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border/40 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your score, activity, or how to improve…"
                className="rounded-xl"
              />
              <Button
                type="submit"
                disabled={!input.trim() || thinking}
                className="rounded-xl"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3" /> Computed over your private
              data — never sent to third parties.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Ask;
