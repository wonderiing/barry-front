<template>
  <div class="flex flex-col items-center gap-6 p-6 bg-gray-100 min-h-screen">
    <br>
    <h2 class="text-3xl font-bold text-gray-800 mb-4">DASHBOARD</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 w-full max-w-5xl">
      <ExpensesChart :expenses="expensesList" />
      <IncomesChart :incomes="incomesList" />
    </div>
    
    <div class="buttons-container">
      <router-link :to="{name: 'gastos'}" class="btn-red">Ver Gastos</router-link>

      <router-link :to="{name: 'ganancias'}" class="btn-red">Ver Ganancias</router-link>
    </div>
  </div>
</template>


  <script setup lang="ts">
  import { onMounted } from 'vue';
  import ExpensesChart from '@/components/charts/ExpensesChart.vue';
  import IncomesChart from '@/components/charts/IncomesChart.vue';
  import { useFinancialData } from '@/helpers/charts';

  const {expensesList, incomesList, expensesByUser, incomesByUser} = useFinancialData();

  onMounted(async () => {
    await expensesByUser();
    await incomesByUser();
  });
  </script>
  
  <style scoped>

.buttons-container {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.btn-red {
  background-color: #ef4444; /* Rojo */
  color: white;
  font-weight: 600; /* Texto un poco más delgado */
  font-size: 1.125rem; /* Tamaño de fuente más pequeño que "xl" */
  padding: 12px 24px; /* Tamaño de padding ajustado */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.btn-red:hover {
  background-color: #dc2626; /* Rojo más oscuro */
  transform: scale(1.05); /* Un poco de zoom al pasar el mouse */
}

.btn-red:active {
  transform: scale(1);
}

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
  