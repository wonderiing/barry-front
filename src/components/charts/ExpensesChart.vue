<template>
    <div class="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
      <div class="chart-container">
        <canvas ref="expensesChartCanvas"></canvas>
      </div>
      
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch, onUnmounted } from 'vue';
  import { Chart, registerables } from 'chart.js';
  import type { ChartTypeRegistry } from 'chart.js';
  import type { ExpensesByUser } from '@/interfaces/expenses.interface';
  
  Chart.register(...registerables);
  
  const props = defineProps({
    expenses: {
      type: Array<ExpensesByUser>,
      required: true,
    },
  });
  
  const expensesChartCanvas = ref(null);
  let currentChart: Chart | null = null;
  
  const createChart = (type: keyof ChartTypeRegistry, ctx: any, label: string, data: number[], labels: string[]) => {
    if (currentChart) {
      currentChart.destroy();
    }
  
    currentChart = new Chart(ctx, {
      type: type,
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            backgroundColor: ["#B82132", "#D2665A", "#F2B28C", "#F6DED8", "#A94A4A"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };
  
  const updateChart = () => {
    const categoryMap = new Map<string, number>();
    
    props.expenses.forEach((expense) => {
      const category = expense.Category?.name || "Sin categoría";
      const amount = Number(expense.mount);
      
      if (categoryMap.has(category)) {
        categoryMap.set(category, categoryMap.get(category)! + amount);
      } else {
        categoryMap.set(category, amount);
      }
    });
    
    const labels = Array.from(categoryMap.keys());
    const data = Array.from(categoryMap.values());
    
    createChart("pie", expensesChartCanvas.value, "Gastos", data, labels);
  };
  
  onMounted(() => {
    updateChart();
  });
  
  watch(() => props.expenses, () => {
    updateChart();
  }, { deep: true });
  
  onUnmounted(() => {
    if (currentChart) {
      currentChart.destroy();
    }
  });
  </script>
  
  <style scoped>
  .chart-container {
    position: relative;
    height: 400px;
    width: 100%;
    min-height: 400px;
  }
  
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
  
  @media (min-width: 768px) {
    .chart-container {
      height: 500px;
    }
  }
  
  @media (min-width: 1024px) {
    .chart-container {
      height: 600px;
    }
  }
  </style>