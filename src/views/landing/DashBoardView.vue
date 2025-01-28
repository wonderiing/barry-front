<template>
    <div class="flex flex-col items-center gap-6 p-6 bg-gray-100 min-h-screen">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Dashboard de Finanzas</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 w-full max-w-5xl">
        <ExpensesChart :expenses="expensesList" />
        <IncomesChart :incomes="incomesList" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import ExpensesChart from '@/components/charts/ExpensesChart.vue';
  import IncomesChart from '@/components/charts/IncomesChart.vue';
  import generalGet from '@/helpers/generalGet';
  import type { ExpensesByUser } from '@/interfaces/expenses.interface';
  import type { IncomesByUser } from '@/interfaces/incomes.interface';
  
  const expensesList = ref<ExpensesByUser[]>([]);
  const incomesList = ref<IncomesByUser[]>([]);
  
  const userId = localStorage.getItem('user_id');
  
  const expensesByUser = async () => {
    const response = await generalGet(`http://localhost:8000/api/expenses/user/${userId}`);
    expensesList.value = response;
  };
  
  const incomesByUser = async () => {
    const response = await generalGet(`http://localhost:8000/api/incomes/user/${userId}`);
    incomesList.value = response;
  };
  
  onMounted(async () => {
    await expensesByUser();
    await incomesByUser();
  });
  </script>
  
  <style scoped>
  body {
    background-color: #f8fafc;
  }
  
  .bg-white {
    background-color: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease-in-out;
  }
  
  .bg-white:hover {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
  
  h2, h3 {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  h2 {
    font-weight: 700;
  }
  
  h3 {
    font-weight: 600;
    color: #2d3748;
  }
  
  canvas {
  max-width: 100% ;
  height: 100%; 
}
  </style>
  