<template>
  <div class="dashboard">
    <div class="chart-container">
      <IncomesChart :incomes="filteredIncomes"></IncomesChart>
    </div>
    <div class="table-container">
      <h3>Detalles de Ingresos</h3>
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
            <tr v-for="income in filteredIncomes" :key="income.id">
              <td>{{ income.mount }}</td>
              <td>{{ income.description }}</td>
              <td>{{ formatDate(income.date) }}</td>
              <td>
                <router-link :to="{name: 'edit-ingreso', params: {id: income.id}}" class="edit-btn">Editar</router-link>
                <button class="delete-btn" @click="deleteIncomes(income.id)">Borrar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="filteredIncomes.length === 0" class="no-results">
          No hay ingresos para la fecha seleccionada
        </p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import '@/assets/gastosDetail.css'
import IncomesChart from '@/components/charts/IncomesChart.vue';
import { useFinancialData } from '@/helpers/charts';
import { onMounted, ref, computed } from 'vue';
import axios from '@/helpers/axios'

const {incomesList, incomesByUser} = useFinancialData()
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

// Format date to MM/DD/YYYY - Updated to accept Date or string
const formatDate = (dateValue: Date | string): string => {
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Computed property to filter incomes by date
const filteredIncomes = computed(() => {
  if (!filterDate.value) {
    return incomesList.value;
  }
  
  const selectedDate = filterDate.value;
  
  return incomesList.value.filter(income => {
    const incomeDate = new Date(income.date);
    incomeDate.setHours(0, 0, 0, 0);
    
    return incomeDate.getTime() === selectedDate.getTime();
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

const deleteIncomes = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/api/incomes/${id}`);
    incomesList.value = incomesList.value.filter(income => income.id !== id);
    alert('Eliminacion correcta');
  } catch (err) {
    alert('Algo falló al eliminar el ingreso');
  }
}

onMounted(async() => {
  await incomesByUser();
})
</script>