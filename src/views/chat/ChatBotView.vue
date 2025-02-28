<template>
  <div class="chatbot-container">
    <div class="chat-messages">
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
        <button class="attachment-btn">
          <span>📎</span>
        </button>
        
        <textarea
          placeholder="Escribe un mensaje..."
          rows="1" 
          @keyup.enter="sendMessage" 
          v-model="message"
        ></textarea>
        
        <button class="send-btn" @click="sendMessage">
          <span>➤</span>
        </button>
      </div>
      
      <div class="suggestions">
        <button class="suggestion-btn">¿Cómo puedo ayudarte?</button>
        <button class="suggestion-btn">¿Necesitas soporte?</button>
        <button class="suggestion-btn">Ver tutoriales</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from '@/helpers/axios';
import { ref } from 'vue';
import { marked } from 'marked'; // Necesitas instalar esta librería

const message = ref('');
const messages = ref<{ type: string, content: string, time: string }[]>([]);
const isTyping = ref(false);

const API_URL = import.meta.env.VITE_API_URL;
const userId = localStorage.getItem('user_id');
const endpoint = `${API_URL}/api/chatgpt`;

// Función para formatear el contenido Markdown a HTML
const formatMessage = (content: string) => {
  // Convertir markdown a HTML
  return marked(content);
};

const sendMessage = async () => {
  if (message.value.trim()) {
    const userMessage = {
      type: 'user',
      content: message.value,
      time: new Date().toLocaleTimeString().slice(0, 5),
    };
    
    messages.value.push(userMessage);
    
    message.value = '';
    isTyping.value = true;
    
    try {
      const response = await axios.post(endpoint, {
        userId: userId,
        message: userMessage.content,
      });
      
      const botMessage = {
        type: 'bot',
        content: response.data.content,
        time: new Date().toLocaleTimeString().slice(0, 5),
      };
      
      messages.value.push(botMessage);
      
      isTyping.value = false;
    } catch (err) {
      console.error(err);
      isTyping.value = false;
    }
  }
};
</script>

<style scoped lang="css" src="../../assets/chatbot.css"></style>