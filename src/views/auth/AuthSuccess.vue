<template>
    <h1>Hola</h1>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import type{ TokenDecoded } from '@/interfaces/token.interface';

const router = useRouter();

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:8000/get-token", { 
      withCredentials: true, 
    });
    const token = response.data.token;

    if (token) {
      
      const decodedToken = jwtDecode<TokenDecoded>(token);
      const userId = decodedToken.userId;
      const exp = decodedToken.exp;

      console.log(decodedToken)

      localStorage.setItem('user_id', String(userId));
      localStorage.setItem('token', token);
      localStorage.setItem('expiresIn', String(exp));

      router.replace({ name: 'home' });
    } else {
      alert('No token found');
      router.replace({ name: 'login' });
    }
  } catch (error) {
    console.error("Error al obtener el token:", error);
    alert('Login failed');
    router.replace({ name: 'login' });
  }
});
</script>