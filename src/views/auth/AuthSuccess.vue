<template>
  <div class="auth-success">
    <div v-if="loading" class="loading">
      <p>Iniciando sesión...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="redirectToLogin">Volver a intentar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import type { TokenDecoded } from '@/interfaces/token.interface';

// Estado reactivo
const loading = ref(true);
const error = ref('');
const router = useRouter();

const processAuthToken = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
      error.value = 'No se encontró un token de autenticación';
      loading.value = false;
      return;
    }
    
    const decodedToken = jwtDecode<TokenDecoded>(token);
    
    if (decodedToken.userId) {
      localStorage.setItem('user_id', decodedToken.userId.toString());
    }
    
    if (decodedToken.email) {
      localStorage.setItem('userEmail', decodedToken.email);
    }
    
    localStorage.setItem('token', token);
    
    router.push('/dashboard');
  } catch (err) {
    console.error('Error al procesar el token:', err);
    error.value = 'Ocurrió un error al procesar la autenticación';
    loading.value = false;
  }
};

const redirectToLogin = () => {
  router.push('/login');
};

onMounted(() => {
  processAuthToken();
});
</script>

<style scoped>
.auth-success {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}
.loading, .error {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  max-width: 400px;
}
.error {
  color: #721c24;
  background-color: #f8d7da;
}
button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>