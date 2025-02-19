<template>
    <nav class="navbar">
      <div class="logo">Barry</div>
      <ul class="nav-links">
        <li><router-link :to="{name: 'chatbot'}" >Chatbot</router-link></li>
        <li><button @click="deleteToken" >Logout</button></li>
        <router-link class="home-button" :to="{name: 'dashboard'}" id="homeButton">
                <img src="../../assets/images/846449.png" alt="" class="home-icon">
        </router-link>
        <button class="notification-button" id="notificationButton">
                <img src="/src/assets/images/notification.png" alt="" class="notification-icon">
            </button>
            <button class="perfil-button" id="perfilButton"> 
                <img src="/src/assets/images/profile.png" alt="" class="perfil-icon">
            </button>
      </ul>
    </nav>

    <router-view></router-view>

  </template>
  
<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()

const deleteToken = () => {

  try {

    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('expiresIn')
  
    router.replace({name: 'login'})
  } catch (err) {
    console.error(err)
  }

}

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