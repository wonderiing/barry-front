<template>
    <div class="dashboard">
      <div class="chart-container">
        <IncomesChart :incomes="incomesList"></IncomesChart>
      </div>
        <div class="table-container">
        <h3>Detalles de Ingresos</h3>
        <div class="filter">
          <span>Filtro:</span>
          <input type="date">
        </div>
        <router-link :to="{name: 'add-ingreso'}" class="edit-btn">Registrar un ingreso</router-link>
        <router-link class="delete-btn" :to="{name: 'dashboard'}"> Volver a dashboard </router-link>
        <br>
        <br>        
        <div class="table-wrapper">
          <table class="expense-table">
            <thead>
              <tr>
                <th>Monto</th>
                <th>Descripcion</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="incomes in incomesList" :key="incomes.id">
                <td>{{ incomes.mount  }}</td>
                <td>{{ incomes.description }}</td>
                <td>{{ new Date(incomes.date).toLocaleDateString() }}</td>
                <td>
                  <router-link :to="{name: 'edit-ingreso', params: {id: incomes.id}}" class="edit-btn">Editar</router-link>
                  <button class="delete-btn" @click="deleteIncomes(incomes.id)">Borrar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>


<script setup lang="ts">
import IncomesChart from '@/components/charts/IncomesChart.vue';
import { useFinancialData } from '@/helpers/charts';
import { onMounted, ref } from 'vue';
import axios from '@/helpers/axios'

const {incomesList, incomesByUser} = useFinancialData()

const deleteIncomes = async (id: number) => {
    
    const reponse = await axios.delete(`http://localhost:8000/api/incomes/${id}`)
    incomesList.value = incomesList.value.filter(incomes => incomes.id !== id) 
    alert('Eliminacion correcta')

}

onMounted(async() => {
    await incomesByUser()
})



</script> 