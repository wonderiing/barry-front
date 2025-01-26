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
    <router-link :to="{name: 'register'}" class="forgot-password">Signup here!</router-link> 

</template>



<script setup lang="ts">
import '@/assets/auth.css'

import { onMounted, onUnmounted, ref } from 'vue';
import axios from 'axios';

const email = ref('');
const password = ref('');
const endpoint = 'http://localhost:8000/api/auth/login';

const login = async () => {
  try {
    const response = await axios.post(endpoint, {
      email: email.value,
      password_hash: password.value, 
    });
    
    const {message, token} = response.data
    
    localStorage.setItem('token', token)

    alert(message)

  } catch (err) {
    alert('Algo fallo')
    console.error(err);
  }
}

onMounted(() => {
  document.body.classList.add("login-view");
});

onUnmounted(() => {
  document.body.classList.remove("login-view");
});
</script>
