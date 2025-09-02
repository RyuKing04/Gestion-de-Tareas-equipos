<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Iniciar Sesión</h1>
        <p>Ingresa a tu cuenta de Encoding example.com</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Correo electrónico</label>
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
          <label for="password">Contraseña</label>
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
          <span v-else class="loading-spinner">Procesando...</span>
        </button>
      </form>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div class="login-footer">
        <p>¿Olvidaste tu contraseña? <a href="#" class="footer-link">Recupérala aquí</a></p>
        <p>¿No tienes una cuenta? <a href="#" class="footer-link">Regístrate ahora</a></p>
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
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  overflow: hidden;
}

.login-header {
  padding: 30px 30px 20px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.login-header h1 {
  margin: 0 0 10px;
  color: #333;
  font-weight: 600;
  font-size: 28px;
}

.login-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.login-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #444;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.login-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px;
  margin: 0 30px;
  border-radius: 6px;
  border-left: 4px solid #c33;
  font-size: 14px;
}

.login-footer {
  padding: 20px 30px 30px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

.login-footer p {
  margin: 10px 0;
  color: #666;
  font-size: 14px;
}

.footer-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.footer-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    max-width: 100%;
  }
  
  .login-form {
    padding: 20px;
  }
  
  .error-message {
    margin: 0 20px;
  }
}
</style>