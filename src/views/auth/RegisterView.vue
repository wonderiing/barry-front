<!-- Register.vue -->
<template>
    <h2>Signup</h2>
    <form @submit.prevent="register">
      <div class="input-container">
        <i class="fas fa-user"></i>
        <input type="text" placeholder="Name" v-model="name" required />
      </div>
      <div class="input-container">
        <i class="fas fa-lock"></i>
        <input type="text" placeholder="Last Name" v-model="lastName" required />
      </div>
      <div class="input-container">
        <i class="fas fa-lock"></i>
        <input type="text" placeholder="Email" v-model="email" required />
      </div>
      <div class="input-container">
        <i class="fas fa-lock"></i>
        <input type="password" placeholder="password" v-model="password" required />
      </div>
      <button type="submit" class="login-button">Signup</button>
      <br>
      <br>
    </form>
    <RouterLink :to="{name: 'login'}" class="forgot-password">Login here!</RouterLink>
</template>

<script setup>
import '@/assets/auth.css'
import axios from 'axios';
import { ref, onMounted, onUnmounted } from 'vue';

const endpoint = 'http://localhost:8000/api/auth/register'
const name = ref('')
const lastName = ref('')
const email = ref('');
const password = ref('');

const register = async () => {

    try {

        const response = await axios.post(endpoint, {
            name: name.value,
            last_name: lastName.value,
            email: email.value,
            password_hash: password.value 
        })

        alert('Registro exitoso!')
        
    } catch (err) {
        alert('Algo fallo')
        console.error(err)
    }
}

onMounted(() => {
  document.body.classList.add("login-view");
});

onUnmounted(() => {
  document.body.classList.remove("login-view");
});
</script>
