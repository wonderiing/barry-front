<template>
    <form class="login-form" @submit.prevent="login" >
      <h2>Login</h2>
      <div class="input-container">
        <i class="fas fa-user"></i>
        <input type="text" placeholder="Email" required v-model="email">
      </div>
      <div class="input-container">
        <i class="fas fa-lock"></i>
        <input type="password" placeholder="Password" required v-model="password">
      </div>
      <button type="submit" class="login-button">Login</button>
      <br>
    </form>
    <button class="login-button" @click="loginWithGoogle">Login With Google!</button> 
    <router-link :to="{name: 'register'}" class="forgot-password">Signup here!</router-link> 
</template>



<script setup lang="ts">
import '@/assets/auth.css'
import { onMounted, onUnmounted, ref } from 'vue';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useRouter } from 'vue-router';
import type { TokenDecoded } from '@/interfaces/token.interface';

const router = useRouter()
const email = ref('');
const password = ref('');
const API_URL = import.meta.env.VITE_API_URL;

const endpoint = `${API_URL}/api/auth/login`;
const endpointGoogle = `${API_URL}/auth/google`

const loginWithGoogle = async () => {

  window.location.href = endpointGoogle;

}

const login = async () => {
  try {
    const response = await axios.post(endpoint, {
      email: email.value,
      password_hash: password.value, 
    });
    
    const {message, token} = response.data
    
    const decodedToken = jwtDecode<TokenDecoded>(token) 
    console.log(decodedToken)
    const userId =  decodedToken.userId
    const exp =  decodedToken.exp


    localStorage.setItem('user_id', String(userId))
    localStorage.setItem('token', token)
    localStorage.setItem('expiresIn', String(exp))

    alert(message)
    checkTokenValidity(exp)
    router.replace({name: 'home'})
  } catch (err) {
    alert('Algo fallo')
    console.error(err);
  }
}

const checkTokenValidity = (exp: number) => {

  const expiration = exp * 1000 - Date.now();

  if (expiration > 0 ) {
  setTimeout(() => {

    localStorage.removeItem('token')
    localStorage.removeItem('exp')
    localStorage.removeItem('user_id')
    router.replace({name: 'login'})
  }, expiration
  );
  }

}

onMounted(async () => {
  document.body.classList.add("login-view");
});

onUnmounted(() => {
  document.body.classList.remove("login-view");
});
</script>
