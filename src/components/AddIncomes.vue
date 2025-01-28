<template>
    <br>
    <div class="form-container">
      <h2>Registrar un Ingreso</h2>
      <form @submit.prevent="submitIncome">
        <div class="form-group">
          <label for="name">Monto: </label>
          <input type="number" id="name" v-model="mount" required step="any">
        </div>
        
        <div class="form-group">
          <label for="message">Descripcion:</label>
          <textarea id="message"  rows="4" required v-model="description"></textarea>
        </div>
        <button type="submit">Registrar</button>
        <br>
        <router-link :to="{name: 'ganancias'}">Volver</router-link>
        
      </form>

    </div>
  </template>

<script setup lang="ts">
import axios from '../helpers/axios';
import {ref} from 'vue'
import {useRouter} from 'vue-router'

const mount = ref()
const description = ref('')
const userId = localStorage.getItem('user_id')
const router = useRouter()


const submitIncome = async() => {
  try{  const endpoint = 'http://localhost:8000/api/incomes'
    const response = await axios.post(endpoint, {
        mount: mount.value,
        description: description.value,
        user_id: userId,
    })
    alert('Registro Exitoso')
    router.replace({name: 'ganancias'})
    } catch(err) {
        alert('algo fallo')
    }
} 

</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

input[type="text"],
input[type="number"],
input[type="email"],
select,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

select {
  height: 40px;
}

textarea {
  resize: vertical;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

input[type="checkbox"] {
  margin-right: 10px;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: rgb(228, 82, 82);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}

@media (max-width: 600px) {
  .form-container {
    width: 100%;
    padding: 10px;
  }
}
</style>