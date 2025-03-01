<template>
  <div class="dashboard-container">
    <!-- Encabezado -->
    <div class="header">
      <h2 class="title">Dashboard Financiero</h2>
      <div class="date-selector">
        <select v-model="selectedMonth" @change="updateData">
          <option v-for="(month, index) in months" :key="index" :value="index + 1">{{ month }}</option>
        </select>
        <select v-model="selectedYear" @change="updateData">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
    </div>
    
    <!-- Resumen Financiero -->
    <div class="metrics-container">
      <div class="metric-box">
        <div class="metric-icon expense-icon">💸</div>
        <div class="metric-content">
          <h3>Gastos Mensuales</h3>
          <p class="metric-value" :class="{'negative': expenseMountPerMonth > 0}">
            $ {{ formatNumber(expenseMountPerMonth) }}
          </p>
        </div>
      </div>
      
      <div class="metric-box">
        <div class="metric-icon income-icon">💰</div>
        <div class="metric-content">
          <h3>Ingresos Mensuales</h3>
          <p class="metric-value" :class="{'positive': incomesMountPerMonth > 0}">
            $ {{ formatNumber(incomesMountPerMonth) }}
          </p>
        </div>
      </div>
      
      <div class="metric-box">
        <div class="metric-icon" :class="{ 'positive-icon': balanceNeto >= 0, 'negative-icon': balanceNeto < 0 }">
          {{ balanceNeto >= 0 ? '📈' : '📉' }}
        </div>
        <div class="metric-content">
          <h3>Balance Neto</h3>
          <p class="metric-value" :class="{ 'positive': balanceNeto >= 0, 'negative': balanceNeto < 0 }">
            $ {{ formatNumber(balanceNeto) }}
          </p>
          <p class="metric-trend" v-if="balanceNeto !== 0">
            {{ balanceNeto >= 0 ? '+' : '' }}{{ ((balanceNeto / incomesMountPerMonth) * 100).toFixed(1) }}% de ingresos
          </p>
        </div>
      </div>
      
      <div class="metric-box pdf-box">
        <div class="metric-icon pdf-icon">🧾</div>
        <div class="metric-content">
          <h3>Reporte Financiero</h3>
          <router-link :to="{name: 'pdf'}" class="btn pdf-btn">
            Ir
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- Gráficos -->
    <div class="charts-container">
      <div class="chart-box">
        <div class="chart-header">
          <h3>Análisis de Gastos</h3>
          <div class="chart-actions">
            <button class="btn-icon" @click="refreshCharts"><span>🔄</span></button>
          </div>
        </div>
        <ExpensesChart :expenses="expensesList" />
      </div>
      
      <div class="chart-box">
        <div class="chart-header">
          <h3>Análisis de Ingresos</h3>
          <div class="chart-actions">
            <button class="btn-icon" @click="refreshCharts"><span>🔄</span></button>
          </div>
        </div>
        <IncomesChart :incomes="incomesList" />
      </div>
    </div>
    
    <!-- Botones de Navegación -->
    <div class="buttons-container">
      <router-link :to="{ name: 'gastos' }" class="action-btn expense-btn">
        <span class="btn-icon">💸</span>
        <span class="btn-text">Gestionar Gastos</span>
      </router-link>
      <router-link :to="{ name: 'ganancias' }" class="action-btn income-btn">
        <span class="btn-icon">💰</span>
        <span class="btn-text">Gestionar Ingresos</span>
      </router-link>
    </div>
    
    <!-- Notificación de actualización -->
    <div class="notification" v-if="showNotification">
      <p>{{ notificationMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ExpensesChart from '@/components/charts/ExpensesChart.vue';
import IncomesChart from '@/components/charts/IncomesChart.vue';
import { useFinancialData } from '@/helpers/charts';
import axios from '@/helpers/axios';
import '@/assets/dashboard.css'

const API_URL = import.meta.env.VITE_API_URL;
const router = useRouter();
const { expensesList, incomesList, expensesByUser, incomesByUser } = useFinancialData();

// Endpoints
const expensesMountPerMonthEp = `${API_URL}/api/expenses/month`;
const incomesMountPerMonthEp = `${API_URL}/api/incomes/month`;

// Datos reactivos
const expenseMountPerMonth = ref(0);
const incomesMountPerMonth = ref(0);
const balanceNeto = ref(0);
const showNotification = ref(false);
const notificationMessage = ref('');

// Selector de fechas
const currentDate = new Date();
const selectedMonth = ref(currentDate.getMonth() + 1);
const selectedYear = ref(currentDate.getFullYear());

// Opciones para fechas
const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const years = computed(() => {
  const currentYear = currentDate.getFullYear();
  return [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
});

const formatNumber = (value) => {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value).replace(',', '.');
};


const showNotificationMessage = (message) => {
  notificationMessage.value = message;
  showNotification.value = true;
  
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

const infoByMonth = async () => {
  const userId = localStorage.getItem('user_id');
  
  try {
    const expenseRequest = axios.post(expensesMountPerMonthEp, {
      year: selectedYear.value,
      month: selectedMonth.value,
      userId: userId
    });
    
    const incomesRequest = axios.post(incomesMountPerMonthEp, {
      year: selectedYear.value,
      month: selectedMonth.value,
      userId: userId
    });
    
    const [expenseResponse, incomesResponse] = await Promise.all([
      expenseRequest, incomesRequest
    ]);
    
    expenseMountPerMonth.value = expenseResponse.data.TotalExpenesPerMonth || 0;
    incomesMountPerMonth.value = incomesResponse.data.TotalIncomesPerMonth || 0;
    calculateBalance();
    
  } catch (err) {
    console.error('Error al cargar datos financieros:', err);
    showNotificationMessage('Error al cargar los datos. Intente nuevamente.');
  }
};

const calculateBalance = () => {
  const incomes = Number(incomesMountPerMonth.value);
  const expenses = Number(expenseMountPerMonth.value);
  
  if (isNaN(incomes) || isNaN(expenses)) {
    console.error("Valores no válidos para el cálculo:", incomes, expenses);
    balanceNeto.value = 0;
  } else {
    balanceNeto.value = parseFloat((incomes - expenses).toFixed(2));
  }
};

const updateData = async () => {
  await infoByMonth();
  await expensesByUser();
  await incomesByUser();
  showNotificationMessage(`Datos actualizados para ${months[selectedMonth.value - 1]} ${selectedYear.value}`);
};

const refreshCharts = async () => {
  await expensesByUser();
  await incomesByUser();
  showNotificationMessage('Gráficos actualizados');
};

onMounted(async () => {
  await expensesByUser();
  await incomesByUser();
  await infoByMonth();
});
</script>