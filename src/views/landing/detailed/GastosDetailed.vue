<template>
  <div class="dashboard">
    <div class="chart-container">
      <ExpensesChart :expenses="filteredExpenses" />
    </div>
    <div class="table-container">
      <h3>Detalles de Gastos</h3>
      <div class="filter">
        <span>Filtro:</span>
        <input 
          type="text" 
          v-model="filterDateInput" 
          @change="handleDateFilter"
          placeholder="MM/DD/YYYY"
        >
        <button 
          class="reset-btn" 
          @click="resetFilter" 
          v-if="filterDateInput"
        >
          Limpiar filtro
        </button>
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
            <tr v-for="expense in filteredExpenses" :key="expense.id">
              <td>{{ expense.Category?.name || 'N/A' }}</td>
              <td>{{ expense.mount }}</td>
              <td>{{ formatDate(expense.date) }}</td>
              <td>{{ expense.description }}</td>
              <td>
                <router-link :to="{name: 'edit-gasto', params: {id: expense.id}}" class="edit-btn">Editar</router-link>
                <button class="delete-btn" @click="deleteExpense(expense.id)" >Borrar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="filteredExpenses.length === 0" class="no-results">
          No hay gastos para la fecha seleccionada
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/gastosDetail.css'
import ExpensesChart from '@/components/charts/ExpensesChart.vue';
import { onMounted, ref, computed } from 'vue';
import { useFinancialData } from '@/helpers/charts';
import axios from '@/helpers/axios';
import { secureAlert } from '@/helpers/succesAlert';
import Swal from 'sweetalert2'

const { expensesList, expensesByUser } = useFinancialData();
const filterDateInput = ref('');
const filterDate = ref<Date | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;


// Parse MM/DD/YYYY format to Date object
const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  
  const month = parseInt(parts[0]) - 1; // Month is 0-indexed in JS Date
  const day = parseInt(parts[1]);
  const year = parseInt(parts[2]);
  
  if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
  
  const date = new Date(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Format date to MM/DD/YYYY - Updated to accept both Date and string
const formatDate = (dateValue: Date | string): string => {
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Computed property to filter expenses by date
const filteredExpenses = computed(() => {
  if (!filterDate.value) {
    return expensesList.value;
  }
  
  const selectedDate = filterDate.value;
  
  return expensesList.value.filter(expense => {
    const expenseDate = new Date(expense.date);
    expenseDate.setHours(0, 0, 0, 0);
    
    return expenseDate.getTime() === selectedDate.getTime();
  });
});

const handleDateFilter = () => {
  filterDate.value = parseDate(filterDateInput.value);
  if (!filterDate.value && filterDateInput.value) {
    alert('Formato de fecha inválido. Por favor use MM/DD/YYYY (e.j. 10/1/2024)');
  }
};

const resetFilter = () => {
  filterDateInput.value = '';
  filterDate.value = null;
};

const deleteExpense = async (id: number) => {
  try {
    const result = await secureAlert("¿Estás seguro de eliminar este gasto?");
    
    if (result.isConfirmed) {
      const endpoint = `${API_URL}/api/expenses/${id}`;
      const response = await axios.delete(endpoint);
      expensesList.value = expensesList.value.filter(expense => expense.id !== id);
      
      Swal.fire("Eliminado!", "El gasto ha sido eliminado correctamente.", "success");
      console.log(response.data);
    } else if (result.isDenied) {
      Swal.fire("Cancelado", "El gasto no fue eliminado.", "info");
    }

  } catch (err) {
    Swal.fire("Error", "Algo falló al eliminar el gasto.", "error");
  }
};

onMounted(async() => {
  await expensesByUser();
});
</script>

<style scoped>
.reset-btn {
  margin-left: 8px;
  padding: 4px 8px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.no-results {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}
</style>