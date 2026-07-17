/**
 * Smart Salud – Chatbot Service
 * Uses xAI Grok API (chat/completions) with a strict system prompt
 * so the bot ONLY answers about the Smart Salud platform.
 */

// ── Types ────────────────────────────────────────────────────────────────────
interface ChatbotResponse {
  message: string;
  suggestions?: string[];
  action?: { label: string; href: string };
}

interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// ── Constants ────────────────────────────────────────────────────────────────
const XAI_BASE_URL = 'https://api.x.ai/v1';
const GROK_MODEL = 'grok-3-mini-fast';

const SYSTEM_PROMPT = `Eres **MediBot**, el asistente virtual oficial de **Smart Salud** (anteriormente conocido como SmartSalud / MediConnect). Tu ÚNICA misión es ayudar a los usuarios con todo lo relacionado a esta plataforma médica.

## TU PERSONALIDAD
- Eres amigable, cálido, profesional y empático.
- Usas un lenguaje inclusivo y cercano, siempre en español.
- Eres conciso pero completo: no más de 3-4 oraciones por respuesta.
- Puedes usar emojis con moderación para ser más cercano (1-2 por respuesta máximo).

## QUÉ ES SMART SALUD
Smart Salud es una plataforma integral de gestión de salud digital que conecta pacientes con médicos certificados. Incluye:
- **Reserva de citas**: Presenciales, por video o por chat.
- **Más de 100 médicos** en 20+ especialidades (Cardiología, Neurología, Pediatría, Dermatología, Ginecología, Psiquiatría, etc.).
- **Dashboard del Paciente**: Ver citas, historial médico, recetas digitales, resultados de exámenes, telemedicina, mensajes con doctores, favoritos y un asistente AI.
- **Dashboard del Médico**: Gestión de agenda, pacientes, consultas, prescripciones, finanzas, analíticas y telemedicina.
- **Dashboard del Administrador**: Gestión de usuarios, doctores, clínicas, reportes financieros, auditoría, seguridad, roles y analíticas avanzadas.
- **Precios**: Consultas entre S/ 80 y S/ 350 según especialista.
- **Métodos de pago**: Tarjetas de crédito/débito, Yape y Plin.
- **Accesibilidad**: Modo oscuro, control de tamaño de texto (A+/A-), alto contraste.
- **Seguridad**: Datos protegidos bajo estándares de seguridad médica.

## RUTAS PRINCIPALES DE LA PLATAFORMA
- /doctors → Buscar médicos
- /specialties → Ver especialidades
- /dashboard/patient/home → Dashboard del paciente
- /dashboard/patient/appointments → Mis citas
- /dashboard/patient/history → Historial médico
- /dashboard/patient/results → Resultados de exámenes
- /dashboard/patient/prescriptions → Recetas
- /dashboard/patient/telemedicine → Telemedicina
- /dashboard/patient/messages → Mensajes
- /dashboard/patient/health → Mi salud
- /dashboard/doctor/home → Dashboard del médico
- /dashboard/doctor/schedule → Agenda del médico
- /dashboard/doctor/patients → Pacientes del médico

## REGLAS ESTRICTAS
1. **NUNCA** respondas preguntas que NO estén relacionadas con Smart Salud, su funcionamiento, sus servicios médicos o la salud en general.
2. Si el usuario pregunta algo fuera de tu alcance (deportes, política, entretenimiento, programación, etc.), responde amablemente: "Lo siento, solo puedo ayudarte con temas relacionados a Smart Salud y tu atención médica. ¿Hay algo del sistema en lo que pueda asistirte? 😊"
3. **NUNCA** des diagnósticos médicos ni recomendaciones de tratamiento. Si alguien pregunta sobre síntomas, recomiéndale que consulte con un especialista en la plataforma.
4. Si es una emergencia médica, SIEMPRE indica llamar al **117 (SAMU)**.
5. Responde SIEMPRE en español a menos que el usuario te escriba en otro idioma, en cuyo caso responde en ese mismo idioma.
6. Cuando sea relevante, sugiere una acción concreta (buscar médico, ver citas, etc.).

## FORMATO DE RESPUESTA
Responde en texto plano. Puedes usar **negritas** con doble asterisco para destacar información importante.`;

// ── Conversation History (in-session memory) ─────────────────────────────────
let conversationHistory: GrokMessage[] = [];

function getApiKey(): string {
  return import.meta.env.VITE_XAI_API_KEY || '';
}

function hasApiKey(): boolean {
  const key = getApiKey();
  return !!key && key !== 'xai-YOUR_API_KEY_HERE';
}

// ── Fallback local intent matching (when no API key) ─────────────────────────
const INTENTS = [
  {
    patterns: ['hola', 'buenos días', 'buenas', 'hi', 'hello', 'hey'],
    response: {
      message: '¡Hola! 👋 Soy MediBot, tu asistente de **Smart Salud**. ¿En qué puedo ayudarte hoy?',
      suggestions: ['Buscar un médico', 'Ver especialidades', 'Mis citas', '¿Cómo funciona?'],
    },
  },
  {
    patterns: ['cita', 'reservar', 'agendar', 'turno', 'citas'],
    response: {
      message: '¡Reservar una cita es muy fácil! 🗓️ Puedes buscar un médico por especialidad, ver su disponibilidad y confirmar tu cita en minutos. ¿Tienes alguna especialidad en mente?',
      suggestions: ['Cardiología', 'Dermatología', 'Pediatría', 'Medicina General'],
      action: { label: 'Buscar médicos', href: '/doctors' },
    },
  },
  {
    patterns: ['cancelar', 'cancelación', 'cancel'],
    response: {
      message: 'Para cancelar una cita, ve a tu **Dashboard > Mis Citas** y selecciona la cita que deseas cancelar. Recuerda hacerlo con al menos 24 horas de anticipación.',
      action: { label: 'Ir a Mis Citas', href: '/dashboard/patient/appointments' },
    },
  },
  {
    patterns: ['precio', 'costo', 'cuánto', 'tarifa', 'pago'],
    response: {
      message: 'Los precios varían según el especialista y tipo de consulta. Los médicos en Smart Salud cobran entre **S/ 80 y S/ 350** por consulta. Aceptamos tarjetas, Yape y Plin. 💳',
      suggestions: ['Ver médicos económicos', 'Ver especialistas premium'],
    },
  },
  {
    patterns: ['emergencia', 'urgencia', 'urgente'],
    response: {
      message: '⚠️ Si estás ante una **emergencia médica**, llama inmediatamente al **117 (SAMU)** o acude al centro de salud más cercano. Smart Salud es para consultas programadas.',
    },
  },
  {
    patterns: ['doctor', 'médico', 'especialista', 'buscar médico'],
    response: {
      message: 'Contamos con más de **100 médicos** certificados en 20+ especialidades. 🩺 Puedes filtrar por especialidad, precio, idioma y modalidad.',
      suggestions: ['Cardiología', 'Neurología', 'Ginecología', 'Dermatología'],
      action: { label: 'Ver todos los médicos', href: '/doctors' },
    },
  },
  {
    patterns: ['video', 'virtual', 'videollamada', 'online', 'telemedicina'],
    response: {
      message: '📱 Sí, ofrecemos **consultas virtuales** por video, chat o llamada. Al reservar, selecciona la modalidad que prefieras.',
      action: { label: 'Buscar consultas virtuales', href: '/doctors' },
    },
  },
  {
    patterns: ['especialidad', 'especialidades'],
    response: {
      message: 'Contamos con **20+ especialidades médicas** incluyendo Cardiología, Neurología, Pediatría, Ginecología, Dermatología, Psiquiatría y más.',
      action: { label: 'Ver especialidades', href: '/specialties' },
    },
  },
  {
    patterns: ['gracias', 'thanks', 'perfecto', 'genial', 'excelente'],
    response: {
      message: '¡Con mucho gusto! 😊 Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?',
      suggestions: ['Buscar médico', 'Ver mis citas', 'Hablar con soporte'],
    },
  },
  {
    patterns: ['receta', 'medicamento', 'medicina', 'fármaco'],
    response: {
      message: '💊 Las recetas digitales son emitidas por tu médico durante o después de la consulta. Puedes verlas en **Dashboard > Recetas**.',
      action: { label: 'Ver recetas', href: '/dashboard/patient/prescriptions' },
    },
  },
  {
    patterns: ['historial', 'historia clínica', 'resultados', 'exámenes'],
    response: {
      message: '📋 Tu historial está disponible en **Dashboard > Historial**. Ahí verás notas, diagnósticos y recomendaciones.',
      action: { label: 'Ver historial', href: '/dashboard/patient/history' },
    },
  },
];

const DEFAULT_RESPONSE: ChatbotResponse = {
  message: 'Entiendo tu consulta. 🤔 Puedo ayudarte con reservas, precios, especialidades y todo sobre Smart Salud. Para consultas médicas específicas, te recomiendo hablar con un especialista.',
  suggestions: ['Buscar un médico', 'Ver especialidades', 'Cómo funciona', 'Precios'],
};

function matchIntentLocal(message: string): ChatbotResponse {
  const lower = message.toLowerCase();
  for (const intent of INTENTS) {
    if (intent.patterns.some((p) => lower.includes(p))) {
      return intent.response;
    }
  }
  return DEFAULT_RESPONSE;
}

// ── Grok API call ────────────────────────────────────────────────────────────
async function callGrokAPI(userMessage: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('No API key configured');

  // Add user message to history
  conversationHistory.push({ role: 'user', content: userMessage });

  // Keep history manageable (last 20 messages)
  if (conversationHistory.length > 20) {
    conversationHistory = conversationHistory.slice(-20);
  }

  const messages: GrokMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory,
  ];

  const response = await fetch(`${XAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROK_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Grok API error:', response.status, errorText);
    throw new Error(`Grok API error: ${response.status}`);
  }

  const data = await response.json();
  const assistantMessage = data.choices?.[0]?.message?.content || '';

  // Save assistant reply to history
  conversationHistory.push({ role: 'assistant', content: assistantMessage });

  return assistantMessage;
}

// ── Parse suggestions from AI response ───────────────────────────────────────
function parseSuggestions(text: string): string[] {
  const lower = text.toLowerCase();
  const suggestions: string[] = [];

  if (lower.includes('médico') || lower.includes('doctor') || lower.includes('especialista')) {
    suggestions.push('Buscar un médico');
  }
  if (lower.includes('cita') || lower.includes('reserva') || lower.includes('agenda')) {
    suggestions.push('Reservar cita');
  }
  if (lower.includes('especialidad')) {
    suggestions.push('Ver especialidades');
  }
  if (lower.includes('historial') || lower.includes('historia')) {
    suggestions.push('Ver historial');
  }
  if (lower.includes('telemedicina') || lower.includes('video')) {
    suggestions.push('Telemedicina');
  }
  if (lower.includes('precio') || lower.includes('costo')) {
    suggestions.push('Ver precios');
  }

  // Always add at least 2 suggestions
  if (suggestions.length === 0) {
    suggestions.push('Buscar un médico', 'Ver mis citas');
  } else if (suggestions.length === 1) {
    suggestions.push('¿Cómo funciona?');
  }

  return suggestions.slice(0, 4);
}

// ── Parse action links from AI response ──────────────────────────────────────
function parseAction(text: string): { label: string; href: string } | undefined {
  const lower = text.toLowerCase();
  if (lower.includes('buscar médico') || lower.includes('buscar un médico') || lower.includes('/doctors')) {
    return { label: 'Buscar médicos', href: '/doctors' };
  }
  if (lower.includes('mis citas') || lower.includes('/appointments')) {
    return { label: 'Ver mis citas', href: '/dashboard/patient/appointments' };
  }
  if (lower.includes('especialidades') || lower.includes('/specialties')) {
    return { label: 'Ver especialidades', href: '/specialties' };
  }
  if (lower.includes('historial') || lower.includes('/history')) {
    return { label: 'Ver historial', href: '/dashboard/patient/history' };
  }
  if (lower.includes('telemedicina')) {
    return { label: 'Telemedicina', href: '/dashboard/patient/telemedicine' };
  }
  return undefined;
}

// ── Grok TTS API ─────────────────────────────────────────────────────────────
async function callGrokTTS(text: string): Promise<ArrayBuffer> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('No API key for TTS');

  // Clean markdown bold markers for speech
  const cleanText = text.replace(/\*\*/g, '');

  const response = await fetch(`${XAI_BASE_URL}/tts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: cleanText,
      voice_id: 'eve',
      language: 'es',
      output_format: {
        codec: 'mp3',
        sample_rate: 24000,
        bit_rate: 128000,
      },
      speed: 1.0,
    }),
  });

  if (!response.ok) {
    throw new Error(`TTS error: ${response.status}`);
  }

  return response.arrayBuffer();
}

// ── Exported Service ─────────────────────────────────────────────────────────
export const chatbotService = {
  /**
   * Get a response to a user message.
   * Uses Grok API if key is available, otherwise falls back to local intents.
   */
  async getResponse(userMessage: string): Promise<ChatbotResponse> {
    if (hasApiKey()) {
      try {
        const reply = await callGrokAPI(userMessage);
        return {
          message: reply,
          suggestions: parseSuggestions(reply),
          action: parseAction(reply),
        };
      } catch (error) {
        console.error('Grok API call failed, falling back to local:', error);
        return matchIntentLocal(userMessage);
      }
    }

    // Fallback: simulate delay + local matching
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    return matchIntentLocal(userMessage);
  },

  /**
   * Welcome message (doesn't need API).
   */
  async getWelcome(): Promise<ChatbotResponse> {
    await new Promise((r) => setTimeout(r, 300));

    // Reset conversation history on new session
    conversationHistory = [];

    const mode = hasApiKey() ? '(Powered by Grok AI 🤖)' : '';
    return {
      message: `¡Hola! 👋 Soy **MediBot**, tu asistente inteligente de **Smart Salud**. ${mode} Puedo ayudarte a encontrar médicos, resolver dudas sobre tus citas, especialidades, precios y todo sobre la plataforma. ¿En qué puedo ayudarte?`,
      suggestions: ['Buscar un médico', 'Reservar cita', 'Mis citas', 'Precios'],
    };
  },

  /**
   * Convert text to speech using Grok TTS API.
   * Returns an AudioBuffer URL or null if unavailable.
   */
  async textToSpeech(text: string): Promise<string | null> {
    if (!hasApiKey()) return null;

    try {
      const audioBuffer = await callGrokTTS(text);
      const blob = new Blob([audioBuffer], { type: 'audio/mp3' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('TTS failed:', error);
      return null;
    }
  },

  /**
   * Whether the Grok API is configured.
   */
  isAIEnabled(): boolean {
    return hasApiKey();
  },
};
