<template>
    <div class="crypto-table-container">
      <h3>Precios de Criptomonedas</h3>
      <table class="crypto-table">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Valor</th>
            <th>Simbolo</th>
            <th>Precio en</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(crp, index) in cryptoList" :key="index">
            <td>Hola</td>
            <td>{{ crp.data.amount }}</td>
            <td>{{ crp.data.base }}</td>
            <td>{{ crp.data.currency }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  

<script setup lang="ts">

import type { Crypto } from '@/interfaces/crypto.interface';
import axios from 'axios';
import { onMounted, ref } from 'vue';


const cryptoSymbols = [
  "BTC-USD",  
  "ETH-USD",  
  "LTC-USD",  
  "XRP-USD",  
  "BCH-USD",  
  "ADA-USD",  
  "DOGE-USD", 
  "DOT-USD", 
  "SOL-USD",  
  "AVAX-USD", 
  "MATIC-USD", 
  "LINK-USD", 
  "UNI-USD", 
  "APE-USD",  
  "SHIB-USD" 
];


const pair = ref('')

const cryptoList = ref<Crypto[]>([])

const fetchCryptos = async() => {
    
    
    try {
        
        for (const symbol in cryptoSymbols) {
            const endpoint = ref(`https://api.coinbase.com/v2/prices/${cryptoSymbols[symbol]}/spot`)
            const response = await axios.get(endpoint.value)
            cryptoList.value.push(response.data)
        }

    } catch (error) {
        console.error(error)
    }
}

onMounted( async () => {
    await fetchCryptos();
})

</script>

<style scoped>
.crypto-table-container {
  margin: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.crypto-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.crypto-table th, .crypto-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.crypto-table th {
  background-color:red;
  color: white;
}

.crypto-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.crypto-logo {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>