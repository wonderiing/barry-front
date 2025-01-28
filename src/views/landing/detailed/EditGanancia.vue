<template>
    <br>
    <div class="form-container">
      <h2>Editar un Ingreso</h2>
      <form @submit.prevent="editExpense" >
        <div class="form-group">
          <label for="name" >Mount</label>
          <input type="number" id="name" required step="any" v-model="mount">
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
import generalGet from '@/helpers/generalGet';
import {onMounted, ref} from 'vue'
import type { IncomesByUser } from '@/interfaces/incomes.interface';
import { useRoute } from 'vue-router';
import axios  from '@/helpers/axios';
import { useRouter } from 'vue-router';

const mount = ref()
const description = ref()
const router = useRoute()
const incomes = ref<IncomesByUser>()
const endpoint = `http://localhost:8000/api/incomes/${router.params.id}`

const backTo = useRouter()

const getIncomes = async () => {
    if(router.params.id) {

        const response = await generalGet(endpoint)
        incomes.value = response
        mount.value = incomes.value?.mount
        description.value = incomes.value?.description
    }
}

const editExpense = async() => {
    if (router.params.id) {
        const response = await axios.put(endpoint, {
            mount: mount.value,
            description: description.value,
        })
        console.log(response.data)
        alert('Edicion exitosa')
        backTo.replace({name : 'ganancias'})

    }
}

onMounted(async()=> {
    await getIncomes();
})

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