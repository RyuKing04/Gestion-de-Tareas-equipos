<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1>Crear Cuenta</h1>
        <p>Únete a Encoding example.com</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Nombre completo</label>
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
            placeholder="Crea una contraseña segura" 
            required 
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
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
          <span v-else class="loading-spinner">Procesando...</span>
        </button>
      </form>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      
      <div class="register-footer">
        <p>¿Ya tienes una cuenta? <a href="#" @click.prevent="goToLogin" class="footer-link">Inicia Sesión</a></p>
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
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.register-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  overflow: hidden;
}

.register-header {
  padding: 30px 30px 20px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.register-header h1 {
  margin: 0 0 10px;
  color: #333;
  font-weight: 600;
  font-size: 28px;
}

.register-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.register-form {
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

.register-button {
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

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.register-button:disabled {
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

.success-message {
  background-color: #efe;
  color: #363;
  padding: 12px;
  margin: 0 30px;
  border-radius: 6px;
  border-left: 4px solid #363;
  font-size: 14px;
}

.register-footer {
  padding: 20px 30px 30px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

.register-footer p {
  margin: 10px 0;
  color: #666;
  font-size: 14px;
}

.footer-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.footer-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-card {
    max-width: 100%;
  }
  
  .register-form {
    padding: 20px;
  }
  
  .error-message, .success-message {
    margin: 0 20px;
  }
}
</style>