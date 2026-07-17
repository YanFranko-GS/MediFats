import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, ChevronDown, Mic, MicOff, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { chatbotService } from '../../services/chatbotService';
import { useSpeech } from '../../hooks/useSpeech';
import { cn } from '../../utils';
import type { ChatMessage } from '../../types';

function makeId() {
  return Math.random().toString(36).slice(2);
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    'Buscar un médico',
    'Reservar cita',
    'Ver especialidades',
    'Mis citas',
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSpeechSupported,
    isSpeaking,
    speakText,
    stopSpeaking,
  } = useSpeech();

  const isAI = chatbotService.isAIEnabled();

  // Load welcome message on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setLoading(true);
      chatbotService.getWelcome().then((res) => {
        const msg: ChatMessage = {
          id: makeId(),
          role: 'assistant',
          content: res.message,
          timestamp: new Date().toISOString(),
        };
        setMessages([msg]);
        if (res.suggestions) setSuggestions(res.suggestions);
        setLoading(false);
      });
    }
  }, [open]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  // When voice recognition finishes, auto-send the transcript
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      setInput(transcript);
      // Small delay so user can see what was transcribed, then send
      const timer = setTimeout(() => {
        sendMessage(transcript);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript]);

  const handleToggle = () => {
    setOpen((o) => !o);
    setUnread(0);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = {
      id: makeId(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setSuggestions([]);
    setLoading(true);

    try {
      const res = await chatbotService.getResponse(text.trim());
      const botMsg: ChatMessage = {
        id: makeId(),
        role: 'assistant',
        content: res.message,
        timestamp: new Date().toISOString(),
      };
      setMessages((m) => [...m, botMsg]);
      if (res.suggestions) setSuggestions(res.suggestions);
      if (!open) setUnread((n) => n + 1);

      // Auto-speak the response if enabled
      if (autoSpeak) {
        speakText(res.message);
      }

      if (res.action) {
        setSuggestions((s) => [...(res.suggestions || []), `→ ${res.action!.label}`]);
      }
    } catch {
      const errMsg: ChatMessage = {
        id: makeId(),
        role: 'assistant',
        content: 'Lo siento, tuve un problema al procesar tu consulta. ¿Puedes intentarlo de nuevo?',
        timestamp: new Date().toISOString(),
      };
      setMessages((m) => [...m, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (s: string) => {
    const clean = s.startsWith('→ ') ? s.slice(2) : s;
    sendMessage(clean);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeakMessage = (content: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(content);
    }
  };

  // Render bold markdown **text**
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>
        : <span key={i}>{p}</span>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="w-[380px] max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-surface-200 dark:border-slate-800 flex flex-col overflow-hidden"
            style={{ height: '560px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-white">MediBot</p>
                    {isAI && (
                      <span className="px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-medium text-white flex items-center gap-0.5">
                        <Sparkles className="h-2.5 w-2.5" />
                        AI
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      isListening ? 'bg-red-400 animate-pulse' : 'bg-green-400 animate-pulse'
                    )} />
                    <p className="text-xs text-primary-100">
                      {isListening ? 'Escuchando...' : isSpeaking ? 'Hablando...' : 'En línea'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Auto-speak toggle */}
                <button
                  onClick={() => {
                    setAutoSpeak((v) => !v);
                    if (isSpeaking) stopSpeaking();
                  }}
                  className={cn(
                    'p-1.5 rounded-full transition-colors',
                    autoSpeak ? 'bg-white/30 text-white' : 'hover:bg-white/20 text-white/70'
                  )}
                  aria-label={autoSpeak ? 'Desactivar respuestas por voz' : 'Activar respuestas por voz'}
                  title={autoSpeak ? 'Voz activada' : 'Activar voz'}
                >
                  {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
                <button
                  onClick={handleToggle}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Cerrar chat"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-surface-50 dark:bg-slate-950">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex gap-2',
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  {/* Avatar */}
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                    msg.role === 'assistant'
                      ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  )}>
                    {msg.role === 'assistant'
                      ? <Bot className="h-3.5 w-3.5" />
                      : <User className="h-3.5 w-3.5" />
                    }
                  </div>
                  {/* Bubble */}
                  <div className="flex flex-col gap-1 max-w-[78%]">
                    <div className={cn(
                      'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                      msg.role === 'assistant'
                        ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-sm shadow-sm border border-surface-200 dark:border-slate-700'
                        : 'bg-primary-600 text-white rounded-tr-sm'
                    )}>
                      {renderContent(msg.content)}
                    </div>
                    {/* Speaker button for assistant messages */}
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleSpeakMessage(msg.content)}
                        className="self-start ml-1 p-1 rounded-full text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                        aria-label="Escuchar mensaje"
                        title="Escuchar este mensaje"
                      >
                        {isSpeaking ? (
                          <VolumeX className="h-3 w-3" />
                        ) : (
                          <Volume2 className="h-3 w-3" />
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Listening indicator */}
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 flex-row-reverse"
                >
                  <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
                    <Mic className="h-3.5 w-3.5 text-red-500 animate-pulse" />
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                    <p className="text-sm text-red-600 dark:text-red-400 italic">
                      {transcript || '🎤 Escuchando...'}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center shrink-0">
                    <Bot className="h-3.5 w-3.5 text-primary-600" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            <AnimatePresence>
              {suggestions.length > 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-surface-100 dark:border-slate-800 overflow-x-auto"
                >
                  <div className="flex gap-2 pb-1">
                    {suggestions.slice(0, 4).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSuggestion(s)}
                        className="shrink-0 px-3 py-1.5 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 text-xs font-medium rounded-full border border-primary-100 dark:border-primary-900 hover:bg-primary-100 dark:hover:bg-primary-900/60 transition-colors whitespace-nowrap"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="px-3 py-3 bg-white dark:bg-slate-900 border-t border-surface-200 dark:border-slate-800 shrink-0">
              <div className="flex gap-2 items-center">
                {/* Microphone button */}
                {isSpeechSupported && (
                  <button
                    onClick={handleVoiceToggle}
                    disabled={loading}
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 active:scale-95',
                      isListening
                        ? 'bg-red-500 text-white animate-pulse hover:bg-red-600'
                        : 'bg-surface-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-surface-200 dark:hover:bg-slate-700 hover:text-primary-600',
                      'disabled:opacity-40 disabled:cursor-not-allowed'
                    )}
                    aria-label={isListening ? 'Detener grabación' : 'Hablar por voz'}
                    title={isListening ? 'Detener' : 'Hablar por voz'}
                  >
                    {isListening ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </button>
                )}

                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                  placeholder={isListening ? '🎤 Escuchando tu voz...' : 'Escribe tu consulta...'}
                  disabled={loading || isListening}
                  className="flex-1 bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50"
                  aria-label="Mensaje al chatbot"
                />

                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 active:scale-95"
                  aria-label="Enviar mensaje"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-center text-xs text-slate-300 dark:text-slate-600 mt-2">
                MediBot · Smart Salud {isAI ? '· Powered by Grok AI' : ''}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente MediBot'}
        className="w-14 h-14 bg-primary-600 hover:bg-primary-700 rounded-full shadow-primary flex items-center justify-center text-white transition-colors relative"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <ChevronDown className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {unread > 0 && !open && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
