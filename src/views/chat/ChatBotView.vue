<template>
  <div class="chatbot-container">
    <div class="chat-messages" ref="messagesContainer">
      <!-- Mostrar mensajes con soporte Markdown -->
      <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.type]">
        <div class="message-avatar" v-if="msg.type === 'bot'">
          <img src="../../assets/images/robot-icon.png" alt="Bot" class="avatar-icon" />
        </div>
        <div class="message-content">
          <div class="message-bubble">
            <p v-html="formatMessage(msg.content)"></p>
          </div>
          <span class="message-time">{{ msg.time }}</span>
        </div>
      </div>
      
      <!-- Indicador de escritura -->
      <div v-if="isTyping" class="typing-indicator">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
    
    <!-- Área de entrada -->
    <div class="chat-input">
      <div class="input-container">
        <button class="attachment-btn" title="Adjuntar archivo">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"></path>
          </svg>
        </button>
        
        <textarea
          placeholder="Escribe un mensaje..."
          rows="1" 
          @input="autoResize"
          @keydown.enter.prevent="sendMessage" 
          v-model="message"
          ref="textarea"
        ></textarea>
        
        <button class="send-btn" @click="sendMessage" :disabled="!message.trim()" title="Enviar mensaje">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon" :class="{ 'active': message.trim() }">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
      
      <div class="suggestions">
        <button v-for="(suggestion, index) in suggestions" :key="index" class="suggestion-btn" @click="useQuickReply(suggestion)">
          {{ suggestion }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from '@/helpers/axios';
import { ref, onMounted, nextTick, watch } from 'vue';
import { marked } from 'marked'; // Necesitas instalar esta librería

const message = ref('');
const messages = ref<{ type: string, content: string, time: string }[]>([]);
const isTyping = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const textarea = ref<HTMLTextAreaElement | null>(null);

const API_URL = import.meta.env.VITE_API_URL;
const userId = localStorage.getItem('user_id');
const endpoint = `${API_URL}/api/chatgpt`;

const suggestions = ref([
  '¿Dame un plan de inversion?',
  'Dame tips de finanzas',
  'Como evado impuestos?',
  'ostia'
]);

const formatMessage = (content: string) => {
  // Convertir markdown a HTML
  return marked(content);
};

const autoResize = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto';
    textarea.value.style.height = `${textarea.value.scrollHeight}px`;
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const useQuickReply = (suggestion: string) => {
  message.value = suggestion;
  sendMessage();
};

onMounted(() => {
  messages.value.push({
    type: "bot",
    content: "¡Hola! ¿En qué puedo ayudarte hoy?",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });
  
  if (textarea.value) {
    textarea.value.style.height = 'auto';
  }
});

watch(messages, () => {
  scrollToBottom();
});

watch(isTyping, () => {
  scrollToBottom();
});

const sendMessage = async () => {
  if (message.value.trim()) {
    const userMessage = {
      type: 'user',
      content: message.value,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    messages.value.push(userMessage);
    
    const sentMessage = message.value;
    message.value = '';
    
    if (textarea.value) {
      textarea.value.style.height = 'auto';
    }
    
    isTyping.value = true;
    
    try {
      const response = await axios.post(endpoint, {
        userId: userId,
        message: sentMessage,
      });
      
      isTyping.value = false;
      
      const botMessage = {
        type: 'bot',
        content: response.data.content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      messages.value.push(botMessage);
    } catch (err) {
      console.error(err);
      isTyping.value = false;
      
      messages.value.push({
        type: 'bot',
        content: "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta de nuevo más tarde.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
  }
};
</script>

<style scoped lang="css" src="../../assets/chatbot.css">
</style>