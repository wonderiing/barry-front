<template>
    <div class="dashboard">
      <div class="chart-container">
        <ExpensesChart :expenses="detailedExpensesList" />
      </div>
        <div class="table-container">
        <h3>Detalles de Gastos</h3>
        <div class="filter">
          <span>Filtro:</span>
          <input type="date">
        </div>
        <router-link :to="{name: 'add-expense'}" class="edit-btn">Agregar un Gasto</router-link>
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
              <tr v-for="expense in detailedExpensesList" :key="expense.id">
                <td>{{ expense.Category?.name || 'N/A' }}</td>
                <td>{{ expense.mount }}</td>
                <td>{{ new Date(expense.date).toLocaleDateString() }}</td>
                <td>{{ expense.description }}</td>
                <td>
                  <button class="edit-btn">Editar</button>
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
import type { ExpensesByUser } from '@/interfaces/expenses.interface';
import generalGet from '@/helpers/generalGet';
import axios from '@/helpers/axios';

const detailedExpensesList = ref<ExpensesByUser[]>([])
const user = localStorage.getItem('user_id')

const {expensesList, expensesByUser} = useFinancialData()

const getDetails = async () => {
    const data = await generalGet(`http://localhost:8000/api/expenses/user/${user}`)
    detailedExpensesList.value = data
}

const deleteExpense = async (id: number) => {
    try {
        const endpoint = `http://localhost:8000/api/expenses/${id}`
        const response = await axios.delete(endpoint)
        detailedExpensesList.value = detailedExpensesList.value.filter(expense => expense.id !== id)
        console.log(response.data)
        alert('eliminacion correcta')
    } catch (err) {
        alert('Algo fallo')
    }
}

onMounted(async() => {
await expensesByUser();
await getDetails();
})
</script>

