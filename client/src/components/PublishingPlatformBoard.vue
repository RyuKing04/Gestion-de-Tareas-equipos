<template>
  <div class="tickets-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-title">
          <h1><i class="fas fa-ticket-alt"></i> Gestión de Tickets</h1>
          <p>Sistema de seguimiento de solicitudes</p>
        </div>
        <div class="header-actions">
          <button @click="showCreateModal = true" class="btn-primary">
            <i class="fas fa-plus"></i> Nuevo Ticket
          </button>
          <button @click="loadBoards" class="btn-secondary">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filters-section">
      <div class="filters-content">
        <div class="filter-group">
          <span class="filter-label">Filtrar por estado:</span>
          <div class="filter-buttons">
            <button
              @click="filterState = ''"
              :class="{ active: filterState === '' }"
              class="filter-btn"
            >
              <i class="fas fa-layer-group"></i> Todos
            </button>
            <button
              @click="filterState = 'nuevo'"
              :class="{ active: filterState === 'nuevo' }"
              class="filter-btn filter-new"
            >
              <i class="fas fa-star"></i> Nuevos
              <span class="count-badge">{{ stateCounts.nuevo }}</span>
            </button>
            <button
              @click="filterState = 'pendiente'"
              :class="{ active: filterState === 'pendiente' }"
              class="filter-btn filter-pending"
            >
              <i class="fas fa-clock"></i> Pendientes
              <span class="count-badge">{{ stateCounts.pendiente }}</span>
            </button>
            <button
              @click="filterState = 'completado'"
              :class="{ active: filterState === 'completado' }"
              class="filter-btn filter-completed"
            >
              <i class="fas fa-check-circle"></i> Completados
              <span class="count-badge">{{ stateCounts.completado }}</span>
            </button>
          </div>
        </div>

        <div class="stats">
          <div class="stat-item">
            <span class="stat-number">{{ boards.length }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stateCounts.nuevo }}</span>
            <span class="stat-label">Por atender</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear ticket - ACTUALIZADO CON SELECTOR DE MIEMBROS -->
    <div
      v-if="showCreateModal"
      class="modal-overlay"
      @click.self="showCreateModal = false"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h2>
            <i class="fas fa-plus-circle"></i>
            Crear Nuevo Ticket
          </h2>
          <button @click="showCreateModal = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label for="ticket-title">
              <i class="fas fa-heading"></i>
              Título del Ticket *
            </label>
            <input
              id="ticket-title"
              v-model="newBoardName"
              type="text"
              placeholder="Ej: Solicitud de acceso al sistema"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label for="ticket-description">
              <i class="fas fa-align-left"></i>
              Descripción
            </label>
            <textarea
              id="ticket-description"
              v-model="newBoardDescription"
              placeholder="Describe detalladamente tu solicitud..."
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>

          <!-- Selector de miembros - NUEVO -->
          <div class="form-group">
            <label>
              <i class="fas fa-users"></i>
              Asignar a miembros
            </label>
            <div class="members-selector">
              <select v-model="selectedMember" class="form-input">
                <option value="">Seleccionar miembro...</option>
                <option
                  v-for="user in availableUsers"
                  :key="user._id"
                  :value="user"
                  :disabled="selectedMembers.some((m) => m._id === user._id)"
                >
                  {{ user.nombre }} - {{ user.email }}
                </option>
              </select>
              <button
                type="button"
                @click="addMember"
                class="add-member-btn"
                :disabled="!selectedMember"
              >
                <i class="fas fa-plus"></i> Agregar
              </button>
            </div>

            <div v-if="selectedMembers.length > 0" class="selected-members">
              <div class="selected-members-header">
                <span>Miembros asignados:</span>
                <span class="members-count">{{ selectedMembers.length }}</span>
              </div>
              <div class="members-list">
                <div
                  v-for="member in selectedMembers"
                  :key="member._id"
                  class="member-tag"
                >
                  <span>{{ member.nombre }}</span>
                  <button
                    type="button"
                    @click="removeMember(member._id)"
                    class="remove-member-btn"
                    title="Quitar miembro"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="ticket-priority">
                <i class="fas fa-flag"></i>
                Prioridad
              </label>
              <select v-model="newBoardPriority" class="form-select">
                <option value="baja">🟢 Baja</option>
                <option value="media">🟡 Media</option>
                <option value="alta">🔴 Alta</option>
              </select>
            </div>

            <div class="form-group">
              <label for="ticket-deadline">
                <i class="fas fa-calendar"></i>
                Fecha Límite
              </label>
              <input
                id="ticket-deadline"
                v-model="newBoardDeadline"
                type="date"
                class="form-input"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showCreateModal = false" class="btn-outline">
            Cancelar
          </button>
          <button
            @click="createBoard"
            :disabled="!newBoardName || loading"
            class="btn-primary"
          >
            <i class="fas fa-check"></i>
            {{ loading ? "Creando..." : "Crear Ticket" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="dashboard-content">
      <!-- Loading -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando tickets...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredBoards.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-inbox"></i>
        </div>
        <h3>No hay tickets</h3>
        <p v-if="filterState">No hay tickets en estado "{{ filterState }}"</p>
        <p v-else>Comienza creando tu primer ticket</p>
        <button @click="showCreateModal = true" class="btn-primary">
          <i class="fas fa-plus"></i> Crear Primer Ticket
        </button>
      </div>

      <!-- Grid de tickets - ACTUALIZADO PARA MOSTRAR MIEMBROS -->
      <div v-else class="tickets-grid">
        <div
          v-for="board in filteredBoards"
          :key="board._id"
          class="ticket-card"
          :class="'priority-' + board.prioridad"
        >
          <div class="ticket-header">
            <div class="ticket-status" :class="'status-' + board.estado">
              <i class="status-icon" :class="getStatusIcon(board.estado)"></i>
              {{ board.estado }}
            </div>
            <div class="ticket-actions">
              <select
                v-model="board.estado"
                @change="updateBoardStatus(board._id, board.estado)"
                class="status-select"
                :class="'status-' + board.estado"
              >
                <option value="nuevo">🆕 Nuevo</option>
                <option value="pendiente">⏳ Pendiente</option>
                <option value="completado">✅ Completado</option>
              </select>
              <button
                @click="deleteBoard(board._id)"
                class="btn-icon btn-delete"
                title="Eliminar"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <div class="ticket-body">
            <h3 class="ticket-title">{{ board.nombre }}</h3>

            <p v-if="board.descripcion" class="ticket-description">
              {{ board.descripcion }}
            </p>

            <div class="ticket-meta">
              <div class="meta-item">
                <i
                  class="fas fa-flag"
                  :class="'priority-icon priority-' + board.prioridad"
                ></i>
                <span class="meta-label">Prioridad {{ board.prioridad }}</span>
              </div>

              <div class="meta-item">
                <i class="fas fa-user"></i>
                <span class="meta-label">Por: {{ board.creador?.nombre || 'Usuario desconocido' }}</span>
              </div>

              <!-- Miembros asignados - NUEVO -->
              <div
                v-if="board.miembros && board.miembros.length > 0"
                class="meta-item"
              >
                <i class="fas fa-users"></i>
                <div class="members-preview">
                  <span class="meta-label">Asignado a: </span>
                  <div class="member-chips">
                    <span
                      v-for="member in board.miembros.slice(0, 3)"
                      :key="member._id"
                      class="member-chip"
                      :title="member.nombre || 'Sin nombre'"
                    >
                      {{
                        member && member.nombre
                          ? member.nombre.split(" ")[0]
                          : "Sin nombre"
                      }}
                    </span>
                    <span
                      v-if="board.miembros.length > 3"
                      class="member-chip more-members"
                      :title="`+${board.miembros.length - 3} más`"
                    >
                      +{{ board.miembros.length - 3 }}
                    </span>
                  </div>
                </div>
              </div>

              <div v-if="board.fecha_limite" class="meta-item">
                <i class="fas fa-calendar"></i>
                <span class="meta-label"
                  >Vence: {{ formatDate(board.fecha_limite) }}</span
                >
              </div>

              <div class="meta-item">
                <i class="fas fa-clock"></i>
                <span class="meta-label"
                  >Creado: {{ formatDate(board.fecha_creacion) }}</span
                >
              </div>
            </div>
          </div>

          <div class="ticket-footer">
            <span class="ticket-id">#{{ board._id.slice(-6) }}</span>
            <div class="ticket-badges">
              <span
                class="badge"
                :class="'priority-badge priority-' + board.prioridad"
              >
                {{ board.prioridad }}
              </span>
              <span
                v-if="board.miembros && board.miembros.length > 0"
                class="badge members-badge"
              >
                <i class="fas fa-users"></i> {{ board.miembros.length }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón de logout -->
    <button @click="handleLogout" class="logout-btn">
      <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

interface User {
  _id: string;
  nombre: string;
  email: string;
}

interface Board {
  _id: string;
  nombre: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  creador: User;
  miembros: User[];
  fecha_limite?: string;
  fecha_creacion: string;
}

const router = useRouter();
const boards = ref<Board[]>([]);
const availableUsers = ref<User[]>([]);
const loading = ref(false);
const showCreateModal = ref(false);
const newBoardName = ref("");
const newBoardDescription = ref("");
const newBoardPriority = ref("media");
const newBoardDeadline = ref("");
const filterState = ref("");
const selectedMember = ref<User | null>(null);
const selectedMembers = ref<User[]>([]);

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Computed properties
const filteredBoards = computed(() => {
  if (!filterState.value) return boards.value;
  return boards.value.filter((board) => board.estado === filterState.value);
});

const stateCounts = computed(() => {
  return {
    nuevo: boards.value.filter((b) => b.estado === "nuevo").length,
    pendiente: boards.value.filter((b) => b.estado === "pendiente").length,
    completado: boards.value.filter((b) => b.estado === "completado").length,
  };
});

// Methods
const getStatusIcon = (estado: string) => {
  const icons = {
    nuevo: "fa-star",
    pendiente: "fa-clock",
    completado: "fa-check-circle",
  };
  return icons[estado] || "fa-ticket-alt";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const loadBoards = async () => {
  loading.value = true;
  try {
    const response = await api.get("/boards");
    boards.value = response.data;
  } catch (error: any) {
    console.error("Error loading boards:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  } finally {
    loading.value = false;
  }
};

// NUEVOS MÉTODOS PARA GESTIÓN DE MIEMBROS
const loadUsers = async () => {
  try {
    const response = await api.get("/users");
    availableUsers.value = response.data;
  } catch (error: any) {
    console.error("Error loading users:", error);
  }
};

const addMember = () => {
  if (
    selectedMember.value &&
    !selectedMembers.value.some((m) => m._id === selectedMember.value!._id)
  ) {
    selectedMembers.value.push(selectedMember.value);
    selectedMember.value = null;
  }
};

const removeMember = (memberId: string) => {
  selectedMembers.value = selectedMembers.value.filter(
    (m) => m._id !== memberId
  );
};

const resetForm = () => {
  newBoardName.value = "";
  newBoardDescription.value = "";
  newBoardPriority.value = "media";
  newBoardDeadline.value = "";
  selectedMembers.value = [];
  selectedMember.value = null;
};

const createBoard = async () => {
  if (!newBoardName.value.trim()) return

  loading.value = true
  try {
    const memberIds = selectedMembers.value.map(m => m._id)
    
    const ticketData: any = {
      nombre: newBoardName.value.trim(),
      descripcion: newBoardDescription.value,
      prioridad: newBoardPriority.value,
      miembros: memberIds // Enviar IDs de miembros seleccionados
    }

    if (newBoardDeadline.value) {
      ticketData.fecha_limite = newBoardDeadline.value
    }

    const response = await api.post('/boards', ticketData)
    
    // Asegurar que la respuesta tenga la estructura correcta
    const newBoard = {
      ...response.data,
      miembros: Array.isArray(response.data.miembros) ? response.data.miembros : []
    }
    
    boards.value.push(newBoard)
    
    // Reset form
    resetForm()
    showCreateModal.value = false
  } catch (error: any) {
    console.error('Error creating board:', error)
    alert('Error al crear el ticket: ' + (error.response?.data?.message || error.message))
  } finally {
    loading.value = false
  }
}
const getSafeNombre = (user: any) => {
  if (!user) return 'Sin nombre'
  // Verificar si es un objeto de usuario o solo un string/ID
  if (typeof user === 'object' && user !== null) {
    return user.nombre || user.email || 'Usuario sin nombre'
  }
  return 'Usuario sin nombre'
}

const getFirstName = (user: any) => {
  const nombre = getSafeNombre(user)
  return nombre.split(' ')[0]
}

const updateBoardStatus = async (boardId: string, newStatus: string) => {
  try {
    const response = await api.patch(`/boards/${boardId}/estado`, {
      estado: newStatus,
    });

    const index = boards.value.findIndex((b) => b._id === boardId);
    if (index !== -1) {
      boards.value[index] = response.data;
    }
  } catch (error: any) {
    console.error("Error updating board status:", error);
  }
};

const deleteBoard = async (boardId: string) => {
  if (!confirm("¿Estás seguro de que quieres eliminar este ticket?")) return;

  try {
    await api.delete(`/boards/${boardId}`);
    boards.value = boards.value.filter((board) => board._id !== boardId);
  } catch (error: any) {
    console.error("Error deleting board:", error);
  }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

// Lifecycle
onMounted(() => {
  loadBoards();
  loadUsers(); // Cargar usuarios disponibles
});
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.tickets-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #0d7c58 0%, #1e4d2b 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 20px;
}

/* Header - Nuevo diseño con logo */
.dashboard-header {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-left: 5px solid #0d7c58;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #0d7c58 0%, #1e4d2b 100%);
  border-radius: 12px;
  color: white;
}

.logo-text {
  font-size: 32px;
  font-weight: 800;
  background: white;
  color: #0d7c58;
  width: 40px;
  height: 40px;
  border-radius: 8px;
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
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.logo-company {
  font-size: 14px;
  font-weight: 600;
}

.header-title h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1e4d2b;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title h1 i {
  color: #0d7c58;
}

.header-title p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* Buttons - Nueva paleta */
.btn-primary {
  background: linear-gradient(135deg, #0d7c58 0%, #1e4d2b 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(13, 124, 88, 0.4);
}

.btn-secondary {
  background: #e8f5f0;
  border: 2px solid #0d7c58;
  color: #0d7c58;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #0d7c58;
  color: white;
  transform: rotate(180deg);
}

.btn-outline {
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #718096;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  border-color: #cbd5e0;
  color: #4a5568;
}

/* Filters */
.filters-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #1e4d2b;
}

.filters-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filter-label {
  font-weight: 600;
  color: #1e4d2b;
  font-size: 14px;
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 14px;
}

.filter-btn:hover {
  border-color: #cbd5e0;
}

.filter-btn.active {
  font-weight: 600;
  background: #e8f5f0;
  border-color: #0d7c58;
  color: #1e4d2b;
}

.filter-new.active {
  background: #ebf8ff;
  border-color: #90cdf4;
  color: #2b6cb0;
}

.filter-pending.active {
  background: #fffaf0;
  border-color: #faf089;
  color: #d69e2e;
}

.filter-completed.active {
  background: #f0fff4;
  border-color: #9ae6b4;
  color: #38a169;
}

.count-badge {
  background: #0d7c58;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.filter-btn.active .count-badge {
  background: currentColor;
}

/* Stats */
.stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 0 16px;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #0d7c58;
}

.stat-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  border-top: 4px solid #0d7c58;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  color: #1e4d2b;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #718096;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f7fafc;
  color: #4a5568;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #1e4d2b;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  outline: none;
  border-color: #0d7c58;
  box-shadow: 0 0 0 3px rgba(13, 124, 88, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.modal-footer {
  padding: 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* NUEVOS ESTILOS PARA SELECTOR DE MIEMBROS */
.members-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.members-selector select {
  flex: 1;
}

.add-member-btn {
  padding: 12px 16px;
  background: #0d7c58;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;
}

.add-member-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-member-btn:hover:not(:disabled) {
  background: #1e4d2b;
}

.selected-members {
  margin-top: 15px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  background: #f8faf9;
}

.selected-members-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 600;
  color: #1e4d2b;
}

.members-count {
  background: #0d7c58;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.member-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 6px 12px;
  border: 1px solid #0d7c58;
  border-radius: 20px;
  font-size: 14px;
  background: #e8f5f0;
}

.remove-member-btn {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 12px;
}

.remove-member-btn:hover {
  background: #fed7d7;
  color: #c53030;
}

/* Tickets Grid */
.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.ticket-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.ticket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f7fafc;
}

.ticket-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-nuevo {
  background: #ebf8ff;
  color: #2b6cb0;
}

.status-pendiente {
  background: #fffaf0;
  color: #d69e2e;
}

.status-completado {
  background: #f0fff4;
  color: #38a169;
}

.status-icon {
  font-size: 10px;
}

.ticket-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.status-select {
  padding: 4px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  font-weight: 500;
}

.status-select.status-nuevo {
  background: #ebf8ff;
  color: #2b6cb0;
}

.status-select.status-pendiente {
  background: #fffaf0;
  color: #d69e2e;
}

.status-select.status-completado {
  background: #f0fff4;
  color: #38a169;
}

.btn-icon {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #718096;
}

.btn-icon:hover {
  background: #edf2f7;
  color: #4a5568;
}

.btn-delete:hover {
  background: #fed7d7;
  color: #c53030;
  border-color: #feb2b2;
}

.ticket-body {
  padding: 20px;
}

.ticket-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e4d2b;
  margin-bottom: 12px;
  line-height: 1.4;
}

.ticket-description {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
}

.ticket-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.meta-label {
  font-weight: 500;
}

.priority-icon {
  font-size: 12px;
}

.priority-icon.priority-alta {
  color: #e53e3e;
}

.priority-icon.priority-media {
  color: #d69e2e;
}

.priority-icon.priority-baja {
  color: #0d7c58;
}

/* Estilos para mostrar miembros en los tickets */
.members-preview {
  display: flex;
  align-items: center;
  gap: 8px;
}

.member-chips {
  display: flex;
  gap: 4px;
}

.member-chip {
  background: #0d7c58;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.more-members {
  background: #718096;
}

.ticket-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid #f7fafc;
  background: #f8faf9;
}

.ticket-id {
  font-size: 11px;
  color: #666;
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.ticket-badges {
  display: flex;
  gap: 6px;
}

.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-badge.priority-alta {
  background: #fed7d7;
  color: #c53030;
}

.priority-badge.priority-media {
  background: #faf089;
  color: #744210;
}

.priority-badge.priority-baja {
  background: #e8f5f0;
  color: #0d7c58;
}

.members-badge {
  background: #e8f5f0;
  color: #0d7c58;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Priority borders */
.ticket-card.priority-alta {
  border-left: 4px solid #e53e3e;
}

.ticket-card.priority-media {
  border-left: 4px solid #d69e2e;
}

.ticket-card.priority-baja {
  border-left: 4px solid #0d7c58;
}

/* Loading and empty states */
.loading-container, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: white;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.8;
}

.empty-state h3 {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
}

.empty-state p {
  margin: 0 0 24px 0;
  opacity: 0.9;
  font-size: 16px;
}

/* Logout button */
.logout-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #e53e3e;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 8px;
}

.logout-btn:hover {
  background: #c53030;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .tickets-dashboard {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .header-title {
    flex-direction: column;
    text-align: center;
  }

  .filters-content {
    flex-direction: column;
    gap: 16px;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .tickets-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }
}

@media (max-width: 480px) {
  .header-title h1 {
    font-size: 24px;
  }

  .filter-btn {
    padding: 8px 12px;
    font-size: 12px;
  }

  .stats {
    flex-direction: column;
    gap: 12px;
  }
}
</style>