import { apiClient } from './apiClient';

interface ChatbotResponse {
  message: string;
  suggestions?: string[];
  action?: { label: string; href: string };
}

const INTENTS = [
  {
    patterns: ['hola', 'buenos días', 'buenas', 'hi', 'hello', 'hey'],
    response: {
      message: '¡Hola! 👋 Soy MediBot, tu asistente de salud. ¿En qué puedo ayudarte hoy?',
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
      message: 'Para cancelar una cita, ve a tu **Dashboard > Mis Citas** y selecciona la cita que deseas cancelar. Recuerda hacerlo con al menos 24 horas de anticipación. ¿Necesitas ayuda para encontrar tus citas?',
      action: { label: 'Ir a Mis Citas', href: '/dashboard/patient/appointments' },
    },
  },
  {
    patterns: ['precio', 'costo', 'cuánto', 'tarifa', 'pago'],
    response: {
      message: 'Los precios varían según el especialista y el tipo de consulta. Los médicos en MediConnect cobran entre **S/ 80 y S/ 350** por consulta. Puedes filtrar por precio máximo al buscar. 💳 Aceptamos todas las tarjetas y Yape/Plin.',
      suggestions: ['Ver médicos económicos', 'Ver especialistas premium'],
    },
  },
  {
    patterns: ['emergencia', 'urgencia', 'urgente', 'emergencias'],
    response: {
      message: '⚠️ Si estás ante una **emergencia médica**, por favor llama inmediatamente al **117 (SAMU)** o acude al centro de salud más cercano. MediConnect es para consultas programadas, no emergencias.',
    },
  },
  {
    patterns: ['doctor', 'médico', 'especialista', 'buscar médico'],
    response: {
      message: '¡Tenemos más de **100 médicos** certificados en 20 especialidades! 🩺 Puedes filtrar por especialidad, precio, idioma y modalidad (presencial/video/chat). ¿Qué especialidad buscas?',
      suggestions: ['Cardiología', 'Neurología', 'Ginecología', 'Dermatología'],
      action: { label: 'Ver todos los médicos', href: '/doctors' },
    },
  },
  {
    patterns: ['video', 'virtual', 'videollamada', 'online', 'telemedicina'],
    response: {
      message: '📱 Sí, ofrecemos **consultas virtuales** por video, chat o llamada. Al reservar, selecciona la modalidad "Video" o "Chat". El enlace de la reunión se enviará a tu correo. ¡Es igual de efectivo que presencial para muchas consultas!',
      action: { label: 'Buscar consultas virtuales', href: '/doctors' },
    },
  },
  {
    patterns: ['especialidad', 'especialidades'],
    response: {
      message: 'Contamos con **20 especialidades médicas** incluyendo Cardiología, Neurología, Pediatría, Ginecología, Dermatología, Psiquiatría y muchas más. ¿Cuál te interesa?',
      action: { label: 'Ver especialidades', href: '/specialties' },
    },
  },
  {
    patterns: ['gracias', 'thanks', 'perfecto', 'genial', 'excelente'],
    response: {
      message: '¡Con mucho gusto! 😊 Estoy aquí para ayudarte cuando lo necesites. ¿Hay algo más en lo que pueda asistirte?',
      suggestions: ['Buscar médico', 'Ver mis citas', 'Hablar con soporte'],
    },
  },
  {
    patterns: ['receta', 'medicamento', 'fármaco', 'medicina'],
    response: {
      message: '💊 Las recetas y prescripciones solo pueden ser emitidas por tu médico durante o después de la consulta. Después de tu cita, el doctor puede enviarte la receta digital a tu correo. ¿Tienes una cita programada?',
    },
  },
  {
    patterns: ['historial', 'historia clínica', 'resultados', 'exámenes'],
    response: {
      message: '📋 Puedes ver tu historial de consultas en tu **Dashboard > Historial**. Ahí encontrarás las notas de cada consulta, diagnósticos y recomendaciones de tus médicos anteriores.',
      action: { label: 'Ver mi historial', href: '/dashboard/patient/history' },
    },
  },
];

const DEFAULT_RESPONSE: ChatbotResponse = {
  message: 'Entiendo tu consulta. 🤔 Por ahora puedo ayudarte con información sobre reservas, precios, especialidades y cómo funciona MediConnect. Para consultas médicas específicas, te recomiendo hablar directamente con uno de nuestros especialistas.',
  suggestions: ['Buscar un médico', 'Ver especialidades', 'Cómo funciona', 'Precios'],
};

function matchIntent(message: string): ChatbotResponse {
  const lower = message.toLowerCase();
  for (const intent of INTENTS) {
    if (intent.patterns.some((p) => lower.includes(p))) {
      return intent.response;
    }
  }
  return DEFAULT_RESPONSE;
}

export const chatbotService = {
  async getResponse(userMessage: string): Promise<ChatbotResponse> {
    return (await apiClient(
      () => matchIntent(userMessage),
      { delay: 600 + Math.random() * 600, errorProbability: 0.01 }
    )).data;
  },

  async getWelcome(): Promise<ChatbotResponse> {
    return (await apiClient(
      () => ({
        message: '¡Hola! 👋 Soy **MediBot**, tu asistente de salud en MediConnect. Puedo ayudarte a encontrar médicos, resolver dudas sobre tus citas y más. ¿En qué puedo ayudarte?',
        suggestions: ['Buscar un médico', 'Reservar cita', 'Mis citas', 'Precios'],
      }),
      { delay: 300, errorProbability: 0 }
    )).data;
  },
};
