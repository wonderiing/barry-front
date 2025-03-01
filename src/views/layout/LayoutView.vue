<template>
  <nav class="navbar">
    <div class="logo">Barry</div>
    
    <!-- Icono del menú para pantallas pequeñas -->
    <span class="menu-icon" @click="toggleMenu">&#9776;</span>

    <ul class="nav-links" :class="{ active: isMenuActive }">
      <li><router-link :to="{name: 'chatbot'}">Chatbot</router-link></li>
      <li><router-link :to="{name: 'crypto'}">Crypto</router-link></li>
      <li><router-link :to="{name: 'dashboard'}">Dashboard</router-link></li>
      <li><router-link :to="{name: 'pdf'}">Reportes</router-link></li>
      <li><router-link :to="{name: 'soporte'}">Soporte</router-link></li>
      <li><a @click="deleteToken">Logout</a></li>
    </ul>
  </nav>

  <router-view></router-view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { secureAlert } from '@/helpers/succesAlert';
import Swal from 'sweetalert2';

const router = useRouter();


const isMenuActive = ref(false);

const toggleMenu = () => {
  isMenuActive.value = !isMenuActive.value;
};

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

/* Estilos para pantallas pequeñas */
@media screen and (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
  }

  .logo {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .nav-links {
    display: none; /* Ocultar los enlaces de navegación en pantallas pequeñas */
    flex-direction: column;
    width: 100%;
  }

  .nav-links.active {
    display: flex; /* Mostrar los enlaces cuando el menú está activado */
  }

  .nav-links li {
    width: 100%;
    padding: 10px 0;
    text-align: center;
  }

  .nav-links li a {
    width: 100%;
    padding: 10px;
  }

  .menu-icon {
    display: block;
    font-size: 30px;
    cursor: pointer;
  }
}

/* Mostrar los enlaces cuando el menú está activo en pantallas pequeñas */
.navbar-toggle {
  display: none;
}

@media screen and (max-width: 768px) {
  .navbar-toggle {
    display: block;
  }
}
</style>
