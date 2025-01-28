<template>
    <div class="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
      <h3 class="text-xl font-semibold text-gray-700 mb-4">Ingresos</h3>
      <div class="chart-container">
        <canvas ref="revenueChartCanvas"></canvas>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch, onUnmounted } from 'vue';
  import { Chart, registerables } from 'chart.js';
  import type { ChartTypeRegistry } from 'chart.js';
  import type { IncomesByUser } from '@/interfaces/incomes.interface';
  
  Chart.register(...registerables);
  
  const props = defineProps({
    incomes: {
      type: Array<IncomesByUser>,
      required: true,
    },
  });
  
  const revenueChartCanvas = ref(null);
  let currentChart: Chart | null = null;
  
  const createChart = (type: keyof ChartTypeRegistry, ctx: any, label: string, data: number[], labels: string[]) => {
    if (currentChart) {
      currentChart.destroy();
    }
  
    // Create new chart
    currentChart = new Chart(ctx, {
      type: type,
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            backgroundColor: ['#F6DED8'],
            borderColor: "#B82132",
            tension: 0.4,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  };
  
  const updateChart = () => {
    const categoryMap = new Map<string, number>();
  
    props.incomes.forEach((income) => {
      const date = new Date(income.date).toISOString().split("T")[0];
      const mount = Number(income.mount);
  
      if (categoryMap.has(date)) {
        categoryMap.set(date, categoryMap.get(date)! + mount);
      } else {
        categoryMap.set(date, mount);
      }
    });
  
    const labels = Array.from(categoryMap.keys());
    const data = Array.from(categoryMap.values());
  
    createChart("line", revenueChartCanvas.value, "Ingresos", data, labels);
  };
  
  onMounted(() => {
    updateChart();
  });
  
  watch(() => props.incomes, () => {
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