<template>
  <div id="app">
    <!-- Navbar de Bootstrap - ACTUALIZADO con color azul del logo -->
    <nav class="navbar navbar-expand-lg navbar-dark custom-navbar">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src="/logo-full-color.png" alt="Logo" class="main-logo-img" />
        </a>
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Contenido principal -->
    <main class="container-fluid mt-3">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* Navbar personalizada con nueva paleta de colores */
.custom-navbar {
  background: linear-gradient(135deg, #1e4d58 0%, #0d505a 100%) !important;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: white;
}

.logo-text {
  font-size: 24px;
  font-weight: 800;
  background: white;
  color: #0d505a;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-details {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-country {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.logo-company {
  font-size: 12px;
  font-weight: 600;
}

/* Estilos globales */
body {
  background-color: #f8f9fa;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Mejoras visuales para el botón de logout */
.btn-outline-light {
  border-width: 2px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}
.main-logo-img {
  height: 100px;
  width: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(13, 80, 90, 0.10);
  background: white;
  padding: 2px 6px;
  object-fit: contain;
}
/* Ajustes responsivos */
@media (max-width: 768px) {
  .logo-container {
    padding: 6px 8px;
  }
  
  .logo-text {
    font-size: 20px;
    width: 28px;
    height: 28px;
  }
  
  .logo-country {
    font-size: 9px;
  }
  
  .logo-company {
    font-size: 11px;
  }
}
</style>
