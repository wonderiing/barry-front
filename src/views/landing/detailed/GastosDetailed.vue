<template>
    <div class="dashboard">
      <div class="chart-container">
        <ExpensesChart :expenses="expensesList" />
      </div>
        <div class="table-container">
        <h3>Detalles de Gastos</h3>
        <div class="filter">
          <span>Filtro:</span>
          <input type="date">
        </div>
        <router-link :to="{name: 'add-expense'}" class="edit-btn">Agregar un Gasto</router-link>
        <router-link class="delete-btn" :to="{name: 'dashboard'}"> Volver a dashboard </router-link>
        <br>
        <br>        
        <div class="table-wrapper">
          <table class="expense-table">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Descripcion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="expense in expensesList" :key="expense.id">
                <td>{{ expense.Category?.name || 'N/A' }}</td>
                <td>{{ expense.mount }}</td>
                <td>{{ new Date(expense.date).toLocaleDateString() }}</td>
                <td>{{ expense.description }}</td>
                <td>
                  <router-link :to="{name: 'edit-gasto', params: {id: expense.id}}" class="edit-btn">Editar</router-link>
                  <button class="delete-btn" @click="deleteExpense(expense.id)" >Borrar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import '@/assets/gastosDetail.css'
import ExpensesChart from '@/components/charts/ExpensesChart.vue';
import { onMounted, ref } from 'vue';
import { useFinancialData } from '@/helpers/charts';
import axios from '@/helpers/axios';


const {expensesList, expensesByUser} = useFinancialData()

const deleteExpense = async (id: number) => {
    try {
        const endpoint = `http://localhost:8000/api/expenses/${id}`
        const response = await axios.delete(endpoint)
        expensesList.value = expensesList.value.filter(expense => expense.id !== id)
        console.log(response.data)
        alert('eliminacion correcta')
    } catch (err) {
        alert('Algo fallo')
    }
}

onMounted(async() => {
await expensesByUser();

})
</script>

