<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <div class="logo-container">
          <img src="/logo-full-color.png" alt="Logo 2CRRE" class="logo-img" />
        </div>
        <h1>Crear Cuenta</h1>
        <p>Únete a Tickets 2CRRE</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">
            <i class="fas fa-user"></i>
            Nombre completo
          </label>
          <input 
            id="name"
            v-model="name" 
            type="text" 
            placeholder="Tu nombre completo" 
            required 
            class="form-input"
          />
        </div>
        
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
            placeholder="Crea una contraseña segura" 
            required 
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">
            <i class="fas fa-lock"></i>
            Confirmar Contraseña
          </label>
          <input 
            id="confirmPassword"
            v-model="confirmPassword" 
            type="password" 
            placeholder="Repite tu contraseña" 
            required 
            class="form-input"
          />
        </div>
        
        <button type="submit" :disabled="loading" class="register-button">
          <span v-if="!loading">Crear Cuenta</span>
          <span v-else class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i> Procesando...
          </span>
        </button>
      </form>
      
      <div v-if="errorMessage" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        {{ errorMessage }}
      </div>
      
      <div v-if="successMessage" class="success-message">
        <i class="fas fa-check-circle"></i>
        {{ successMessage }}
      </div>
      
      <div class="register-footer">
        <p>¿Ya tienes una cuenta? 
          <a href="#" @click.prevent="goToLogin" class="footer-link">
            Inicia Sesión
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/authService'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()

const handleRegister = async () => {
  // Validaciones básicas
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const result = await register(name.value, email.value, password.value)
    console.log('Registro exitoso:', result)
    
    // Mostrar mensaje de éxito
    successMessage.value = '¡Cuenta creada exitosamente! Redirigiendo...'
    
    // Redirigir después de 2 segundos
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (error: any) {
    console.error('Error en registro:', error)
    
    if (error.response) {
      // Error del servidor con respuesta
      errorMessage.value = error.response.data?.message || 'Error en el servidor durante el registro'
    } else if (error.request) {
      // Error de conexión (sin respuesta)
      errorMessage.value = 'Error de conexión con el servidor. Verifica que el servidor esté ejecutándose.'
    } else {
      // Otro tipo de error
      errorMessage.value = error.message || 'Error inesperado al crear la cuenta'
    }
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0d505a 0%, #1e4d58 100%);
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.register-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.register-header {
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

.register-header h1 {
  margin: 0 0 8px;
  color: white;
  font-weight: 700;
  font-size: 28px;
}

.register-header p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-weight: 400;
}

.register-form {
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

.register-button {
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

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 80, 90, 0.4);
}

.register-button:active:not(:disabled) {
  transform: translateY(0);
}

.register-button:disabled {
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
  margin: 0 30px 20px;
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

.success-message {
  background-color: #c6f6d5;
  color: #22543d;
  padding: 14px;
  margin: 0 30px 20px;
  border-radius: 8px;
  border-left: 4px solid #38a169;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-message i {
  font-size: 16px;
}

.register-footer {
  padding: 25px 30px 30px;
  text-align: center;
  border-top: 1px solid #e2e8f0;
  background: #f8faf9;
}

.register-footer p {
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
.register-card {
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
  .register-container {
    padding: 15px;
  }
  
  .register-card {
    max-width: 100%;
    border-radius: 12px;
  }
  
  .register-header {
    padding: 25px 20px 20px;
  }
  
  .register-form {
    padding: 20px;
  }
  
  .error-message,
  .success-message {
    margin: 0 20px 15px;
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
  
  .form-group {
    margin-bottom: 20px;
  }
}
</style>