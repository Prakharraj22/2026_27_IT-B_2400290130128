import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, Send } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}

const quickQuestions = [
  'What should I learn next?',
  'Why am I missing this skill?',
  'How can I improve my resume?',
  'Which jobs match me?',
];

// Mock responses keyed by quick question \u2014 designed to be swapped for a real
// call to POST /v1/assistant/chat once a backend + LLM is available.
const mockResponses: Record<string, string> = {
  'what should i learn next?':
    'Based on your roadmap, Spring Boot is your active focus \u2014 you\u2019re 55% through it. After that, REST APIs and Docker are next in sequence toward Backend Developer.',
  'why am i missing this skill?':
    'Spring Boot, Docker and System Design don\u2019t appear in your resume or projects yet, but they show up in most Backend Developer job listings you\u2019re matched against.',
  'how can i improve my resume?':
    'Add measurable outcomes to your project bullets, mention any testing practices you\u2019ve used, and note any deployment or Docker experience \u2014 even small exposure counts.',
  'which jobs match me?':
    'Software Engineer I at Orbital Systems (91% match) and Full-Stack Developer Intern at Loomstack (88% match) are your closest fits right now.',
};

// Small-talk patterns handled before falling back to the generic "connect a
// live model" reply, so common one-word messages like "hi" don't get the
// same non-answer as a genuinely open-ended career question.
const CONVERSATIONAL_PATTERNS: Array<{ test: RegExp; reply: string }> = [
  { test: /^(hi|hello|hey|yo|hiya|sup)[!.\s]*$/i, reply: 'Hi there! Ask me about your skills, roadmap, resume, or job matches \u2014 or tap one of the suggestions below.' },
  { test: /^(good\s?(morning|afternoon|evening))[!.\s]*$/i, reply: 'Hello! What would you like to know about your career progress today?' },
  { test: /^(thanks|thank you|thx|ty)[!.\s]*$/i, reply: 'You\u2019re welcome! Let me know if anything else comes up.' },
  { test: /^(bye|goodbye|see ya|see you)[!.\s]*$/i, reply: 'Take care \u2014 I\u2019ll be here whenever you need career guidance.' },
  { test: /^(who are you|what are you|what can you do)\??$/i, reply: 'I\u2019m your CareerAI Assistant \u2014 I can help with skill gaps, learning roadmaps, resume feedback, and job matches based on your profile.' },
  { test: /^(how are you)\??$/i, reply: 'Doing well, thanks for asking! How\u2019s your career journey going?' },
];

function matchReply(rawText: string): string {
  const normalized = rawText.trim().toLowerCase();
  if (mockResponses[normalized]) return mockResponses[normalized];
  const conversational = CONVERSATIONAL_PATTERNS.find((p) => p.test.test(normalized));
  if (conversational) return conversational.reply;
  return 'That\u2019s a great question \u2014 once connected to the live model, I\u2019ll pull directly from your profile to answer that in detail.';
}

let nextMessageId = 1;

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'assistant', text: 'Hi! I\u2019m your CareerAI Assistant. Ask me anything about your skills, roadmap or job matches.' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: nextMessageId++, role: 'user', text };
    const reply = matchReply(text);
    setMessages((m) => [...m, userMsg, { id: nextMessageId++, role: 'assistant', text: reply }]);
    setInput('');
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open CareerAI Assistant"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-24 right-5 z-40 flex h-[500px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-2xl"
          >
            <div className="flex items-center gap-2.5 border-b border-border-light dark:border-border-dark bg-primary-600 px-4 py-3.5 text-white">
              <Sparkles className="h-4.5 w-4.5" />
              <div>
                <p className="text-sm font-semibold">CareerAI Assistant</p>
                <p className="text-[11px] text-primary-100">Here to help with your career path</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed',
                    m.role === 'assistant'
                      ? 'bg-canvas-light dark:bg-white/5 text-ink-light dark:text-ink-dark'
                      : 'ml-auto bg-primary-600 text-white'
                  )}
                >
                  {m.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 border-t border-border-light dark:border-border-dark px-4 py-3">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-border-light dark:border-border-dark px-2.5 py-1 text-xs text-muted-light dark:text-muted-dark hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-300"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border-light dark:border-border-dark p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your career..."
                aria-label="Ask CareerAI Assistant"
                className="flex-1 rounded-xl border border-border-light dark:border-border-dark bg-canvas-light dark:bg-white/5 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary-500"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white hover:bg-primary-700"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
