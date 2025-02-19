<template>
  <div class="dashboard-container">
    <!-- Encabezado -->
    <div class="header">
      <h2 class="title">Performance Report</h2>
      <button class="add-chart-btn">+ Add Chart</button>
    </div>

    <!-- Métricas Principales -->
    <div class="metrics-container">
      <div class="metric-box">
        <h3>Gastos Totales</h3>
        <p class="metric-value">{{ expenseMountPerMonth }}</p>
        <span class="positive">+3.5%</span>
      </div>

      <div class="metric-box">
        <h3>Ingresos Totales</h3>
        <p class="metric-value">{{ incomesMountPerMonth }}</p>
        <span class="negative">-15%</span>
      </div>

      <div class="metric-box">
        <h3>Total Applications</h3>
        <p class="metric-value">120</p>
      </div>

      <div class="metric-box">
        <h3>Total Sales</h3>
        <p class="metric-value">$18,000</p>
        <span class="positive">+2%</span>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="charts-container">
      <div class="chart-box">
        <h3>Gastos</h3>
        <ExpensesChart :expenses="expensesList" />
      </div>

      <div class="chart-box">
        <h3>Ganancias</h3>
        <IncomesChart :incomes="incomesList" />
      </div>
    </div>

    <!-- Botones de Navegación -->
    <div class="buttons-container">
      <router-link :to="{ name: 'gastos' }" class="btn red">Ver Gastos</router-link>
      <router-link :to="{ name: 'ganancias' }" class="btn blue">Ver Ganancias</router-link>
    </div>
  </div>
</template>




<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ExpensesChart from '@/components/charts/ExpensesChart.vue';
import IncomesChart from '@/components/charts/IncomesChart.vue';
import { useFinancialData } from '@/helpers/charts';
import '@/assets/dashboard.css'
import axios from '@/helpers/axios'

const router = useRouter();
const { expensesList, incomesList, expensesByUser, incomesByUser } = useFinancialData();

const expensesMountPerMonthEp = 'http://localhost:8000/api/expenses/month'
const incomesMountPerMonthEp = 'http://localhost:8000/api/incomes/month'

const expenseMountPerMonth = ref()
const incomesMountPerMonth = ref()

const infoByMonth = async () => {

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear()
  const userId = localStorage.getItem('user_id')
  
  try {

    const expenseRequest = await axios.post(expensesMountPerMonthEp, {
      year: currentYear,
      month: currentMonth,
      userId: userId
    })
    const incomesRequest = await axios.post(incomesMountPerMonthEp, {
      year: currentYear,
      month: currentMonth,
      userId: userId
    })

    axios.all([expenseRequest, incomesRequest])
    .then(axios.spread((expenseResponse, incomesResponse) => {
      expenseMountPerMonth.value = expenseResponse.data.TotalExpenesPerMonth
      incomesMountPerMonth.value = incomesResponse.data.TotalIncomesPerMonth
    }))
   

  } catch (err) {
    console.error(err)
  }

}




onMounted(async () => {
  await expensesByUser();
  await incomesByUser();
  await infoByMonth();
});
</script>

