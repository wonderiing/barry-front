<template>
    <br>
    <br>
    <div class="pdf-report-container">
      <h2 class="report-title">Reporte Financiero</h2>
      
      <div class="report-actions">
        <button 
          @click="generateReport" 
          :disabled="isLoading" 
          class="generate-btn"
          :class="{ 'loading': isLoading }"
        >
          <span v-if="!isLoading">Generar Reporte PDF</span>
          <span v-else class="loading-text">
            <span class="loading-dot"></span>
            <span class="loading-dot"></span>
            <span class="loading-dot"></span>
            Generando
          </span>
        </button>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
      
      <!-- Opción 1: Descarga directa sin iframe -->
      <div v-if="pdfBlob" class="pdf-actions">
        <button @click="downloadPdf" class="download-btn">
          <span class="btn-icon">↓</span> Descargar PDF
        </button>
        <button @click="openPdfInNewTab" class="view-btn">
          <span class="btn-icon">↗</span> Abrir en nueva ventana
        </button>
      </div>
      
      <!-- Opción 2: Vista previa (usar solo si el iframe funciona en tu entorno) -->
      <div v-if="showPreview && pdfUrl" class="pdf-viewer">
        <h3>Vista previa del reporte:</h3>
        <div class="iframe-container">
          <object 
            :data="pdfUrl" 
            type="application/pdf" 
            width="100%" 
            height="800px"
            class="pdf-object"
          >
            <p>Tu navegador no puede mostrar PDFs. 
              <a :href="pdfUrl" target="_blank">Haz clic aquí para descargar el PDF</a>
            </p>
          </object>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import axios from 'axios';
  
  // Estado
  const isLoading = ref(false);
  const errorMessage = ref('');
  const pdfUrl = ref<string | null>(null);
  const pdfBlob = ref<Blob | null>(null);
  const showPreview = ref(false); // Controla si mostrar la vista previa
  const userStore = localStorage.getItem("user_id")
  const token = localStorage.getItem("token")
  const API_URL = import.meta.env.VITE_API_URL;
  
  // Función para generar el reporte
  const generateReport = async () => {
    if (isLoading.value) return;
    
    isLoading.value = true;
    errorMessage.value = '';
    pdfUrl.value = null;
    pdfBlob.value = null;
    
    try {
      // Obtener el ID del usuario del store
      const userId = userStore
      
      if (!userId) {
        throw new Error('Usuario no autenticado');
      }
      
      console.log('Solicitando PDF...');
      
      // Hacer la solicitud al endpoint
      const response = await axios({
        method: 'GET',
        url: `${API_URL}/reportes/pdf/user/${userId}`,
        responseType: 'blob', // Importante para recibir datos binarios
        headers: {
          'Authorization': `Bearer ${token}` // Si usas token de autenticación
        }
      });
      
      console.log('Respuesta recibida:', response.status, response.headers);
      
      // Verificar que la respuesta sea válida
      if (response.status !== 200) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      
      // Verificar si el tipo de contenido es PDF
      const contentType = response.headers['content-type'];
      if (contentType && !contentType.includes('application/pdf')) {
        console.warn(`Tipo de contenido inesperado: ${contentType}`);
      }
      
      // Crear blob del PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Verificar el tamaño del blob
      if (blob.size === 0) {
        throw new Error('El PDF generado está vacío');
      }
      
      pdfBlob.value = blob;
      pdfUrl.value = URL.createObjectURL(blob);
      console.log('PDF URL creada:', pdfUrl.value);
      
      // Solo mostrar vista previa si estamos seguros que funciona en el entorno
      showPreview.value = true;
      
    } catch (error: any) {
      console.error('Error al generar el reporte:', error);
      
      // Manejo detallado de errores
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // El servidor respondió con un error
          errorMessage.value = `Error del servidor: ${error.response.status} - ${error.response.statusText}`;
        } else if (error.request) {
          // La solicitud se realizó pero no se recibió respuesta
          errorMessage.value = 'No se recibió respuesta del servidor. Verifique su conexión.';
        } else {
          // Error en la configuración de la solicitud
          errorMessage.value = `Error de configuración: ${error.message}`;
        }
      } else {
        errorMessage.value = error.message || 'Error al generar el reporte. Intente nuevamente.';
      }
    } finally {
      isLoading.value = false;
    }
  };
  
  // Función para descargar el PDF directamente
  const downloadPdf = () => {
    if (!pdfBlob.value || !pdfUrl.value) return;
    
    // Crear un elemento <a> temporal
    const link = document.createElement('a');
    link.href = pdfUrl.value;
    link.download = `reporte-financiero-${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Función para abrir el PDF en una nueva pestaña
  const openPdfInNewTab = () => {
    if (!pdfUrl.value) return;
    
    window.open(pdfUrl.value, '_blank');
  };
  
  // Limpiar URL del objeto al desmontar el componente
  onUnmounted(() => {
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value);
    }
  });
  </script>
  
  <style scoped>
  .pdf-report-container {
    padding: 2rem;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0 4px 20px rgba(220, 20, 60, 0.15);
    max-width: 1000px; /* Aumentado de 800px a 1000px */
    margin: 0 auto;
    border-top: 4px solid #c10016;
  }
  
  .report-title {
    color: #c10016;
    margin-bottom: 2rem;
    text-align: center;
    font-size: 1.8rem;
    font-weight: 700;
    letter-spacing: -0.5px;
  }
  
  .report-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .generate-btn {
    padding: 0.85rem 2rem;
    background-color: #e60023;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(230, 0, 35, 0.3);
    min-width: 220px;
  }
  
  .generate-btn:hover {
    background-color: #c10016;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(230, 0, 35, 0.4);
  }
  
  .generate-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(230, 0, 35, 0.3);
  }
  
  .generate-btn:disabled {
    background-color: #ff8080;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .generate-btn.loading {
    opacity: 0.8;
    background-color: #ff4d4d;
  }
  
  .loading-text {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .loading-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: white;
    border-radius: 50%;
    animation: pulse 1.5s infinite ease-in-out;
  }
  
  .loading-dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .loading-dot:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  
  .error-message {
    color: #c10016;
    margin-top: 1.2rem;
    padding: 0.8rem 1.2rem;
    background-color: #fff0f0;
    border-radius: 8px;
    font-size: 0.9rem;
    text-align: center;
    width: 100%;
    border-left: 4px solid #c10016;
  }
  
  .pdf-viewer {
    margin-top: 2.5rem;
    border: 1px solid #ffcccc;
    border-radius: 8px;
    padding: 1.5rem;
    background-color: #fff9f9;
    width: 100%;
  }
  
  .pdf-viewer h3 {
    color: #c10016;
    margin-bottom: 1.2rem;
    font-weight: 600;
  }
  
  .iframe-container {
    border: 1px solid #ffdddd;
    min-height: 800px; /* Aumentado de 500px a 800px */
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(193, 0, 22, 0.1);
  }
  
  .pdf-object {
    width: 100%;
    height: 800px; /* Aumentado de 500px a 800px */
  }
  
  .pdf-actions {
    display: flex;
    justify-content: center;
    gap: 1.2rem;
    margin-top: 1.5rem;
  }
  
  .view-btn, .download-btn {
    padding: 0.7rem 1.2rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .btn-icon {
    font-size: 1.1rem;
  }
  
  .view-btn {
    background-color: #f8f8f8;
    color: #c10016;
    border: 1px solid #ffcccc;
  }
  
  .download-btn {
    background-color: #c10016;
    color: white;
    box-shadow: 0 4px 12px rgba(193, 0, 22, 0.2);
  }
  
  .view-btn:hover {
    background-color: #fff0f0;
    transform: translateY(-2px);
  }
  
  .download-btn:hover {
    background-color: #a10012;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(193, 0, 22, 0.3);
  }
  
  .view-btn:active, .download-btn:active {
    transform: translateY(0);
  }
  
  @media (max-width: 640px) {
    .pdf-report-container {
      padding: 1.5rem;
      border-radius: 8px;
    }
    
    .pdf-actions {
      flex-direction: column;
      width: 100%;
    }
    
    .view-btn, .download-btn {
      width: 100%;
      justify-content: center;
    }
    
    .iframe-container, .pdf-object {
      height: 600px; /* Altura reducida para móviles pero aún mayor que la original */
    }
  }
  
  /* Para pantallas muy grandes, permitir que el visualizador sea aún más alto */
  @media (min-width: 1200px) {
    .pdf-report-container {
      max-width: 1200px;
    }
    
    .iframe-container, .pdf-object {
      height: 900px;
    }
  }
  </style>