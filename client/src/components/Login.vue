<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-container">
          <img src="/logo-full-color.png" alt="Logo 2CRRE" class="logo-img" />
        </div>
        <h1>Iniciar Sesión</h1>
        <p>Accede a tu cuenta de Tickets 2CRRE</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">
            <i class="fas fa-envelope"></i>
            Correo electrónico
          </label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            placeholder="tu.correo@ejemplo.com" 
            required 
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="password">
            <i class="fas fa-lock"></i>
            Contraseña
          </label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            placeholder="Ingresa tu contraseña" 
            required 
            class="form-input"
          />
        </div>
        
        <button type="submit" :disabled="loading" class="login-button">
          <span v-if="!loading">Iniciar Sesión</span>
          <span v-else class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i> Procesando...
          </span>
        </button>
      </form>
      
      <div v-if="errorMessage" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        {{ errorMessage }}
      </div>
      
      <div class="login-footer">
        <p>¿No tienes una cuenta? 
          <a href="#" @click.prevent="goToRegister" class="footer-link">
            Regístrate ahora
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/authService'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const usuario = await login(email.value, password.value)
    console.log('Login exitoso:', usuario)
    
    // Redirigir al dashboard después de login exitoso
    router.push('/dashboard')
  } catch (error: any) {
    console.error('Error en login:', error)
    
    if (error.response) {
      // Error del servidor con respuesta
      errorMessage.value = error.response.data.message || 'Error en el servidor'
    } else if (error.request) {
      // Error de conexión (sin respuesta)
      errorMessage.value = 'Error de conexión con el servidor'
    } else {
      // Otro tipo de error
      errorMessage.value = 'Error inesperado'
    }
  } finally {
    loading.value = false
  }
}

// Función para redirigir a la página de registro
const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0d505a 0%, #1e4d58 100%);
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 450px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-header {
  padding: 35px 30px 25px;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #1e4d58 0%, #0d505a 100%);
  color: white;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.logo-img {
  max-width: 120px;
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

.login-header h1 {
  margin: 0 0 8px;
  color: white;
  font-weight: 700;
  font-size: 28px;
}

.login-header p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-weight: 400;
}

.login-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #1e4d58;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group label i {
  color: #0d505a;
  width: 16px;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background: #f8fafc;
}

.form-input:focus {
  outline: none;
  border-color: #0d505a;
  box-shadow: 0 0 0 3px rgba(13, 80, 90, 0.1);
  background: white;
}

.form-input::placeholder {
  color: #a0aec0;
}

.login-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #1e4d58 0%, #0d505a 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(13, 80, 90, 0.3);
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 80, 90, 0.4);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.error-message {
  background-color: #fed7d7;
  color: #c53030;
  padding: 14px;
  margin: 0 30px;
  border-radius: 8px;
  border-left: 4px solid #c53030;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-message i {
  font-size: 16px;
}

.login-footer {
  padding: 25px 30px 30px;
  text-align: center;
  border-top: 1px solid #e2e8f0;
  background: #f8faf9;
}

.login-footer p {
  margin: 0;
  color: #838383;
  font-size: 14px;
}

.footer-link {
  color: #0d505a;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #1e4d58;
  text-decoration: underline;
}

/* Efectos de animación */
.login-card {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 480px) {
  .login-container {
    padding: 15px;
  }
  
  .login-card {
    max-width: 100%;
    border-radius: 12px;
  }
  
  .login-header {
    padding: 25px 20px 20px;
  }
  
  .login-form {
    padding: 20px;
  }
  
  .error-message {
    margin: 0 20px;
  }
  
  .logo-container {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  
  .logo-text {
    width: 35px;
    height: 35px;
    font-size: 24px;
  }
}
</style>