<template>
    <nav class="navbar">
      <div class="logo">Barry</div>
      <ul class="nav-links">
        <li><router-link :to="{name: 'chatbot'}" >Chatbot</router-link></li>
        <li><router-link :to="{name: 'crypto'}" >Crypto</router-link></li>
        <li><router-link :to="{name: 'dashboard'}" >Dashboard</router-link></li>
        <li><router-link :to="{name: 'pdf'}" >Reportes</router-link></li>
        <li><a @click="deleteToken" >Logout</a></li>
      </ul>
    </nav>

    <router-view></router-view>

  </template>
  
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { secureAlert } from '@/helpers/succesAlert';
import Swal from 'sweetalert2';
const router = useRouter()

const deleteToken = async () => {
  try {
    const result = await secureAlert("¿Estás seguro de cerrar sesión?");

    if (result.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('expiresIn');

      Swal.fire("Cierre de sesión", "Has cerrado sesión correctamente.", "success");
      router.replace({ name: 'login' });
    } else if (result.isDenied) {
      Swal.fire("Cancelado", "No se cerró sesión.", "info");
    }

  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Ocurrió un problema al cerrar sesión.", "error");
  }
};


</script>

  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 40px;
    background: #cf4a40;
    color: white;
  }
  
  .logo {
    font-size: 22px;
    font-weight: bold;
    color: white;
  }
  
  .nav-links {
    list-style: none;
    display: flex;
    gap: 20px;
  }
  
  .nav-links li a {
    text-decoration: none;
    color: white;
    font-weight: 500;
  }
  
  .nav-links li a:hover {
    text-decoration: underline;
  }

  .home-button{
    border: none;
    border-radius: 10px;
    padding: 5px;
    box-shadow: 2px 5px 5px rgb(191, 187, 187);
}
.home-icon{
    width: 30px;
}

.notification-button {
    color: transparent;
    border-radius: 10px;
    padding: 5px;
    box-shadow: 2px 5px 5px rgb(191, 187, 187);
    border: none;
}

.notification-icon{
    width: 30px;
}

.perfil-button {
    color: transparent;
    border-radius: 10px;
    padding: 5px;
    box-shadow: 2px 5px 5px rgb(191, 187, 187);
    border: none;
}

.perfil-icon{
    width: 30px;
}
</style>