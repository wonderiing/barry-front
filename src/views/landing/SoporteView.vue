<template>
    <div class="support-page"> <!-- Nuevo contenedor -->
      <div class="support-container">
        <div class="form-box">
          <div class="icon-container">
            <rocket-icon class="icon" />
          </div>
  
          <div class="form-content">
            <h2>Envíanos un Mensaje</h2>
  
            <form @submit.prevent="handleSubmit" class="form-grid">
              <div class="input-group">
                <input type="text" v-model="formData.name" placeholder="Nombre" required />
              </div>
  
              <div class="input-group">
                <select v-model="formData.type" required>
                  <option value="">Selecciona un tipo *</option>
                  <option value="bug">Bug</option>
                  <option value="sugerencia">Sugerencia</option>
                  <option value="duda">Duda</option>
                </select>
              </div>
  
              <div class="textarea-group">
                <textarea v-model="formData.message" placeholder="Mensaje" required></textarea>
              </div>
  
              <div class="input-group">
                <input type="email" v-model="formData.email" placeholder="Email" required />
              </div>
  
              <div class="input-group">
                <input type="tel" v-model="formData.phone" placeholder="Teléfono - Opcional" />
              </div>
  
              <div class="button-group">
                <button type="submit">Enviar Mensaje</button>
                <br />
                <br />
                <button type="button" @click="goBack">Volver</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
<script setup>
import { ref } from 'vue';
import { Rocket as RocketIcon } from 'lucide-vue-next';
const API_URL = import.meta.env.VITE_API_URL;
import { useRouter } from 'vue-router';
import axios from '../../helpers/axios';
import { successAlert } from '@/helpers/succesAlert';

const router = useRouter();

const goBack = () => {
  router.go(-1); 
};

  const formData = ref({
    name: '',
    email: '',
    type: '',
    message: ''
  });
  
  const handleSubmit = async () => {
    try{

        const response = await axios.post(`${API_URL}/api/send-mail`, formData.value)
        console.log(response.data)
        await successAlert("Ticket enviado con exito")
        formData.value = {
        name: '',
        email: '',
        type: '',
        message: ''
      };
    } catch (error) {
        console.error(error)
    }
  }
  </script>
  
  <style scoped>
  /* Estilo para la página de soporte */
  .support-page {
    width: 100%;
    height: 100vh;
    background: linear-gradient(to bottom right, #b91c1c, #dc2626);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Estilos del contenedor principal */
  .support-container {
    width: 100%;
    max-width: 1200px;
    padding: 40px;
    display: flex;
    justify-content: center;
  }
  
  /* Estilos de la caja del formulario */
  .form-box {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 1200px;
    width: 95%;
    padding: 50px;
    position: relative;
  }
  
  /* Estilo del ícono dentro de la caja */
  .icon-container {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: #f15050;
    border-radius: 50%;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  /* Estilos del ícono del contenedor */
  .icon {
    width: 32px;
    height: 32px;
    color: white;
  }
  
  /* Estilos de la parte de contenido del formulario */
  .form-content {
    text-align: center;
    margin-top: 24px;
  }
  
  /* Estilos del encabezado */
  h2 {
    color: #dc2626;
    font-size: 32px;
    margin-bottom: 24px;
  }
  
  /* Estilos para el formulario en grillas */
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  /* Estilos de los grupos de inputs */
  .input-group {
    grid-column: span 1;
    width: 100%;
  }
  
  /* Estilo para el área de texto */
  .textarea-group {
    grid-column: span 2;
    width: 100%;
  }
  
  /* Estilo común para inputs, selects y textarea */
  .input-group input,
  .input-group select,
  .textarea-group textarea {
    width: 100%;
    padding: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 18px;
  }
  
  /* Estilo para el área de texto */
  .textarea-group textarea {
    min-height: 150px;
    resize: vertical;
  }
  
  /* Estilo para los botones */
  .button-group {
    text-align: center;
    grid-column: span 2;
  }
  
  button {
    background: #dc2626;
    color: white;
    font-size: 20px;
    font-weight: bold;
    padding: 16px 32px;
    border: none;
    border-radius: 32px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  /* Efecto de hover para el botón */
  button:hover {
    background: #b91c1c;
  }
  
  /* Estilos responsivos para pantallas medianas */
  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr; 
    }
    .textarea-group, .button-group {
      grid-column: span 1; 
    }
    .form-box {
      padding: 30px; 
    }
    h2 {
      font-size: 28px; 
    }
  }
  
  @media (max-width: 480px) {
    .form-box {
      padding: 20px; 
    }
    h2 {
      font-size: 24px; 
    }
    .input-group input,
    .input-group select,
    .textarea-group textarea {
      padding: 12px; 
      font-size: 16px;
    }
    button {
      font-size: 18px; 
      padding: 12px 24px;
    }
  }
  </style>
  