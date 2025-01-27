<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar">
      <div class="container">
        <div class="navbar-content">
          <div class="logo-container">
            <span class="logo">Barry</span>
          </div>
          <div class="nav-links">
            <router-link :to="{name: 'login'}" class="btn-primary">Login</router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="hero">
      <div class="container">
        <div class="hero-content">
          <main class="hero-main">
            <div class="hero-text">
              <h1 class="hero-title">
                <span>Toma el control de tus</span>
                <span class="text-primary">finanzas personales</span>
              </h1>
              <p class="hero-description">
                Barry te ayuda a gestionar tus gastos, ahorros e inversiones de manera inteligente con el uso de inteligencia artificial. 
                Todo en una sola aplicación, simple y fácil de usar.
              </p>
              <div class="hero-cta">
                <div class="cta-button-container">
                  <router-link :to="{name: 'register'}" class="btn-primary-large">Registrate</router-link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div class="hero-image-container">
        <img class="hero-image" src="../../assets//images/Barry_(TV_series)-Logo.wine.png" alt="Dashboard de Barry">
      </div>
    </div>

    <div id="features" class="features-section">
      <div class="container">
        <div class="features-header">
          <h2 class="section-title">Todo lo que necesitas para tus finanzas</h2>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">Control de Gastos</h3>
              <p class="feature-description">
                Registra y categoriza tus gastos automáticamente. Obtén insights sobre tus hábitos de consumo.
              </p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">Metas de Ahorro</h3>
              <p class="feature-description">
                Establece objetivos de ahorro y realiza un seguimiento de tu progreso en tiempo real.
              </p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">Reportes Detallados</h3>
              <p class="feature-description">
                Visualiza tu situación financiera con gráficos intuitivos y reportes personalizados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import '@/assets/landing.css'
</script>

