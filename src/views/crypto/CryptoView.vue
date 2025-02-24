<template>
  <div class="container">
    <div class="header">
      <h2>Precios de Criptomonedas</h2>
      <div class="search-box">
        <input 
          v-model="searchPair"
          placeholder="Buscar par (ej: BTC-USD)"
          class="search-input"
        />
        <button @click="searchCrypto" class="search-button">
          <span class="material-icons">search</span>
        </button>
      </div>
    </div>

    <!-- Resultado de búsqueda con botón de cerrar -->
    <div v-if="showSearchResult && searchResult" class="search-result">
      <div class="result-header">
        <span class="material-icons">trending_up</span>
        <h3>Resultado de búsqueda</h3>
        <button @click="showSearchResult = false" class="close-button">
          <span class="material-icons">close</span>
        </button>
      </div>
      <div class="result-card">
        <img 
          :src="`https://cryptologos.cc/logos/${cryptoNameMap[searchResult?.data.base] || searchResult?.data.base.toLowerCase()}-${searchResult?.data.base.toLowerCase()}-logo.png`"
          :alt="searchResult?.data.base"
          class="crypto-logo"
          @error="handleImageError"
        />
        <div class="result-info">
          <p class="crypto-name">{{ searchResult?.data.base }}</p>
          <p class="crypto-price">${{ searchResult?.data.amount }}</p>
          <p class="crypto-currency">{{ searchResult?.data.currency }}</p>
        </div>
      </div>
    </div>

    <!-- Tabla de criptomonedas -->
    <div class="table-container">
      <table class="crypto-table">
        <thead>
          <tr>
            <th>Activo</th>
            <th>Precio</th>
            <th>Símbolo</th>
            <th>Moneda</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(crp, index) in cryptoList" :key="index">
            <td>
              <div class="crypto-cell">
                <img 
                  :src="`https://cryptologos.cc/logos/${cryptoNameMap[crp?.data.base] || crp?.data.base.toLowerCase()}-${crp?.data.base.toLowerCase()}-logo.png`"
                  :alt="crp?.data.base"
                  class="crypto-logo"
                  @error="handleImageError"
                />
                <span>{{ crp?.data.base }}</span>
              </div>
            </td>
            <td class="price-cell">${{ Number(crp?.data.amount).toLocaleString() }}</td>
            <td>{{ crp?.data.base }}</td>
            <td>{{ crp?.data.currency }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Crypto } from '@/interfaces/crypto.interface';
import axios from 'axios';
import { onMounted, ref } from 'vue';

// Mapeo de nombres de criptomonedas para imágenes correctas
const cryptoNameMap: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  LTC: "litecoin",
  XRP: "ripple",
  BCH: "bitcoin-cash",
  ADA: "cardano",
  DOGE: "dogecoin",
  DOT: "polkadot",
  SOL: "solana",
  AVAX: "avalanche",
  MATIC: "polygon",
  LINK: "chainlink",
  UNI: "uniswap",
  APE: "apecoin",
  SHIB: "shiba-inu"
};
const API_URL = import.meta.env.VITE_API_URL;


// Lista de símbolos de criptomonedas
const cryptoSymbols = [
  "BTC-USD", "ETH-USD", "LTC-USD", "XRP-USD", "BCH-USD",
  "ADA-USD", "DOGE-USD", "DOT-USD", "SOL-USD", "AVAX-USD",
  "MATIC-USD", "LINK-USD", "UNI-USD", "APE-USD", "SHIB-USD"
];

// Variables reactivas
const searchPair = ref('');
const searchResult = ref<Crypto | null>(null);
const cryptoList = ref<Crypto[]>([]);
const showSearchResult = ref(false); // Nueva variable para mostrar/ocultar el popup

// Manejo de error en imágenes
const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = 'src/assets/images/check_small_24dp_000_FILL0_wght400_GRAD0_opsz24.png';
};

// Buscar criptomoneda en el input
const searchCrypto = async () => {
  try {
    if (!searchPair.value) return;
    const response = await axios.get(`${API_URL}/api/crypto/value?pair=${searchPair.value.toUpperCase()}`);
    searchResult.value = response.data;
    showSearchResult.value = true; // Mostrar el resultado de búsqueda
  } catch (error) {
    console.error(error);
  }
};

// Obtener lista de criptos al cargar el componente
const fetchCryptos = async () => {
  try {
    const promises = cryptoSymbols.map(symbol => 
      axios.get(`https://api.coinbase.com/v2/prices/${symbol}/spot`)
    );
    const responses = await Promise.all(promises);
    cryptoList.value = responses.map(response => response.data);
  } catch (error) {
    console.error(error);
  }
};

// Cargar datos al montar el componente
onMounted(async () => {
  await fetchCryptos();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #1a237e;
  margin-left: auto;
}

.close-button:hover {
  color: #0015ff;
}

.container {
  font-family: 'Inter', sans-serif;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header h2 {
  color: black;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.search-box {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  max-width: 400px;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #1a237e;
  outline: none;
  box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
}

.search-button {
  background: rgb(243, 135, 135);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.search-button:hover {
  background: #eb0000;
}

.search-result {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.result-header h3 {
  margin: 0;
  color: #1a237e;
}

.result-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.crypto-name {
  font-weight: 600;
  color: #1a237e;
  margin: 0;
}

.crypto-price {
  font-size: 1.25rem;
  font-weight: 500;
  color: #2e7d32;
  margin: 0;
}

.crypto-currency {
  color: #616161;
  font-size: 0.875rem;
  margin: 0;
}

.table-container {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  width: 100%; /* Asegura que ocupe todo el ancho disponible */
}

.crypto-table {
  width: 100%; /* Asegura que la tabla ocupe el 100% del contenedor */
  border-collapse: collapse;
  font-size: 0.95rem;
}

.crypto-table th {
  text-align: left;
  padding: 1rem;
  background: #f5f5f5;
  color: black;
  font-weight: 600;
}

.crypto-table td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.crypto-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.crypto-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.price-cell {
  font-weight: 500;
  color: #2e7d32;
}

tr:hover {
  background-color: #f5f5f5;
  transition: background-color 0.2s ease;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }
}
</style>
