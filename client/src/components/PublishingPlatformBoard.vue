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
   <!-- Modal para crear ticket -->
<div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
  <div class="modal-content">
    <div class="modal-header">
      <h2><i class="fas fa-plus-circle"></i> Crear Nuevo Ticket</h2>
      <button @click="showCreateModal = false" class="close-btn">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- CONTENIDO CON SCROLL -->
    <div class="modal-body-scrollable">
      <div class="modal-body-content">
        <!-- Título -->
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

        <!-- Descripción -->
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
            rows="3"
          ></textarea>
        </div>

        <!-- Selector de miembros -->
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

        <!-- Prioridad y Fecha Límite -->
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
    </div>

    <!-- FOOTER FIJO CON BOTONES -->
    <div class="modal-footer">
      <!-- Botón de email -->
      <div class="email-section">
        <button 
          type="button" 
          @click="sendEmailNotification" 
          class="btn-email"
          :disabled="!newBoardName"
        >
          <i class="fas fa-envelope"></i> Enviar notificación por email
        </button>
        <small class="email-note">
          * Se abrirá Gmail con correo a: support@lwolf.com, technology@2costaricarealestate.com
        </small>
      </div>

      <!-- Botones de acción -->
      <div class="action-buttons">
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
</div>
    <!-- Modal para editar ticket - NUEVO -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
  <div class="modal-content">
    <div class="modal-header">
      <h2>
        <i class="fas fa-edit"></i>
        Editar Ticket
      </h2>
      <button @click="showEditModal = false" class="close-btn">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- CONTENIDO CON SCROLL -->
    <div class="modal-body-scrollable">
      <div class="modal-body-content">
        <div class="form-group">
          <label for="edit-ticket-title">
            <i class="fas fa-heading"></i>
            Título del Ticket *
          </label>
          <input
            id="edit-ticket-title"
            v-model="editBoardData.nombre"
            type="text"
            placeholder="Ej: Solicitud de acceso al sistema"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="edit-ticket-description">
            <i class="fas fa-align-left"></i>
            Descripción
          </label>
          <textarea
            id="edit-ticket-description"
            v-model="editBoardData.descripcion"
            placeholder="Describe detalladamente tu solicitud..."
            class="form-textarea"
            rows="3"
          ></textarea>
        </div>

        <!-- Selector de miembros para edición -->
        <div class="form-group">
          <label>
            <i class="fas fa-users"></i>
            Asignar a miembros
          </label>
          <div class="members-selector">
            <select v-model="selectedEditMember" class="form-input">
              <option value="">Seleccionar miembro...</option>
              <option
                v-for="user in availableUsers"
                :key="user._id"
                :value="user"
                :disabled="editBoardData.miembros.some((m) => m._id === user._id)"
              >
                {{ user.nombre }} - {{ user.email }}
              </option>
            </select>
            <button
              type="button"
              @click="addEditMember"
              class="add-member-btn"
              :disabled="!selectedEditMember"
            >
              <i class="fas fa-plus"></i> Agregar
            </button>
          </div>

          <div v-if="editBoardData.miembros.length > 0" class="selected-members">
            <div class="selected-members-header">
              <span>Miembros asignados:</span>
              <span class="members-count">{{ editBoardData.miembros.length }}</span>
            </div>
            <div class="members-list">
              <div
                v-for="member in editBoardData.miembros"
                :key="member._id"
                class="member-tag"
              >
                <span>{{ member.nombre }}</span>
                <button
                  type="button"
                  @click="removeEditMember(member._id)"
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
            <label for="edit-ticket-priority">
              <i class="fas fa-flag"></i>
              Prioridad
            </label>
            <select v-model="editBoardData.prioridad" class="form-select">
              <option value="baja">🟢 Baja</option>
              <option value="media">🟡 Media</option>
              <option value="alta">🔴 Alta</option>
            </select>
          </div>

          <div class="form-group">
            <label for="edit-ticket-deadline">
              <i class="fas fa-calendar"></i>
              Fecha Límite
            </label>
            <input
              id="edit-ticket-deadline"
              v-model="editBoardData.fecha_limite"
              type="date"
              class="form-input"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER FIJO CON BOTONES -->
    <div class="modal-footer">
      <!-- Botón de email para edición -->
      <div class="email-section">
        <button 
          type="button" 
          @click="sendEditEmailNotification" 
          class="btn-email"
          :disabled="!editBoardData.nombre"
        >
          <i class="fas fa-envelope"></i> Enviar notificación por email
        </button>
        <small class="email-note">
          * Se abrirá Gmail con correo a: support@lwolf.com, technology@2costaricarealestate.com
        </small>
      </div>

      <!-- Botones de acción -->
      <div class="action-buttons">
        <button @click="showEditModal = false" class="btn-outline">
          Cancelar
        </button>
        <button
          @click="updateBoard"
          :disabled="!editBoardData.nombre || loading"
          class="btn-primary"
        >
          <i class="fas fa-save"></i>
          {{ loading ? "Guardando..." : "Guardar Cambios" }}
        </button>
      </div>
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

              <!-- Botón de editar - NUEVO -->
              <button
                @click="editBoard(board)"
                class="btn-icon btn-edit"
                title="Editar"
              >
                <i class="fas fa-edit"></i>
              </button>

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
                <span class="meta-label"
                  >Por:
                  {{ board.creador?.nombre || "Usuario desconocido" }}</span
                >
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
const showEditModal = ref(false);
const editBoardData = ref({
  _id: "",
  nombre: "",
  descripcion: "",
  prioridad: "media",
  fecha_limite: "",
  miembros: [] as User[],
});
const selectedEditMember = ref<User | null>(null);
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
  if (!newBoardName.value.trim()) return;

  loading.value = true;
  try {
    const memberIds = selectedMembers.value.map((m) => m._id);

    const ticketData: any = {
      nombre: newBoardName.value.trim(),
      descripcion: newBoardDescription.value,
      prioridad: newBoardPriority.value,
      miembros: memberIds, // Enviar IDs de miembros seleccionados
    };

    if (newBoardDeadline.value) {
      ticketData.fecha_limite = newBoardDeadline.value;
    }

    const response = await api.post("/boards", ticketData);

    // Asegurar que la respuesta tenga la estructura correcta
    const newBoard = {
      ...response.data,
      miembros: Array.isArray(response.data.miembros)
        ? response.data.miembros
        : [],
    };

    boards.value.push(newBoard);

    // Reset form
    resetForm();
    showCreateModal.value = false;
  } catch (error: any) {
    console.error("Error creating board:", error);
    alert(
      "Error al crear el ticket: " +
        (error.response?.data?.message || error.message)
    );
  } finally {
    loading.value = false;
  }
};
const getSafeNombre = (user: any) => {
  if (!user) return "Sin nombre";
  // Verificar si es un objeto de usuario o solo un string/ID
  if (typeof user === "object" && user !== null) {
    return user.nombre || user.email || "Usuario sin nombre";
  }
  return "Usuario sin nombre";
};

const getFirstName = (user: any) => {
  const nombre = getSafeNombre(user);
  return nombre.split(" ")[0];
};

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
const editBoard = (board: Board) => {
  editBoardData.value = {
    _id: board._id,
    nombre: board.nombre,
    descripcion: board.descripcion || "",
    prioridad: board.prioridad,
    fecha_limite: board.fecha_limite ? board.fecha_limite.split("T")[0] : "",
    miembros: [...board.miembros],
  };
  selectedEditMember.value = null;
  showEditModal.value = true;
};

const addEditMember = () => {
  if (
    selectedEditMember.value &&
    !editBoardData.value.miembros.some(
      (m) => m._id === selectedEditMember.value!._id
    )
  ) {
    editBoardData.value.miembros.push(selectedEditMember.value);
    selectedEditMember.value = null;
  }
};

const removeEditMember = (memberId: string) => {
  editBoardData.value.miembros = editBoardData.value.miembros.filter(
    (m) => m._id !== memberId
  );
};

const updateBoard = async () => {
  if (!editBoardData.value.nombre.trim()) return;

  loading.value = true;
  try {
    const memberIds = editBoardData.value.miembros.map((m) => m._id);

    const updateData: any = {
      nombre: editBoardData.value.nombre.trim(),
      descripcion: editBoardData.value.descripcion,
      prioridad: editBoardData.value.prioridad,
      miembros: memberIds,
    };

    if (editBoardData.value.fecha_limite) {
      updateData.fecha_limite = editBoardData.value.fecha_limite;
    }

    const response = await api.put(
      `/boards/${editBoardData.value._id}`,
      updateData
    );

    // Actualizar el board en la lista
    const index = boards.value.findIndex(
      (b) => b._id === editBoardData.value._id
    );
    if (index !== -1) {
      boards.value[index] = response.data;
    }

    showEditModal.value = false;
  } catch (error: any) {
    console.error("Error updating board:", error);
    alert(
      "Error al actualizar el ticket: " +
        (error.response?.data?.message || error.message)
    );
  } finally {
    loading.value = false;
  }
};
// Notificacion de email
const sendEmailNotification = () => {
  const emails = ",technology@2costaricarealestate.com";
  const subject = `New Ticket: ${newBoardName.value}`;

  const body = `

Description: ${newBoardDescription.value}



Assigned members:
${
  selectedMembers.value.map((m) => `- ${m.nombre} (${m.email})`).join("\n") ||
  "No member assigned"
}

This is an automated message from the ticket system.
  `.trim();

  // Codificar para URL
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  // Abrir Gmail con múltiples destinatarios
  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&to=${emails}&su=${encodedSubject}&body=${encodedBody}`,
    "_blank"
  );
};
// Método para edición
const sendEditEmailNotification = () => {
  const emails = "support@lwolf.com,technology@2costaricarealestate.com";
  const subject = `${editBoardData.value.nombre}`;

  const body = `

Description: ${editBoardData.value.descripcion}


Assigned members:
${
  editBoardData.value.miembros
    .map((m) => `- ${m.nombre} (${m.email})`)
    .join("\n") || "No member assigned"
}

This is an automated message from the ticket system.
  `.trim();

  // Codificar para URL
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  // Abrir Gmail con múltiples destinatarios
  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&to=${emails}&su=${encodedSubject}&body=${encodedBody}`,
    "_blank"
  );
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
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.tickets-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #0d505a 0%, #1e4d58 100%);
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 30px 20px;
}

/* Header - Mejor espaciado */
.dashboard-header {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-left: 5px solid #0d505a;
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
  padding: 12px 18px;
  background: linear-gradient(135deg, #0d505a 0%, #1e4d58 100%);
  border-radius: 12px;
  color: white;
}

.logo-text {
  font-size: 32px;
  font-weight: 800;
  background: white;
  color: #0d505a;
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
  line-height: 1.3;
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
  color: #1e4d58;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title h1 i {
  color: #0d505a;
}

.header-title p {
  color: #838383;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  gap: 15px;
}

/* Buttons - Mejor espaciado */
.btn-primary {
  background: linear-gradient(135deg, #0d505a 0%, #1e4d58 100%);
  color: white;
  border: none;
  padding: 14px 26px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(13, 80, 90, 0.4);
}

.btn-secondary {
  background: #e8f5f0;
  border: 2px solid #0d505a;
  color: #0d505a;
  padding: 12px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-secondary:hover {
  background: #0d505a;
  color: white;
  transform: rotate(180deg);
}

.btn-outline {
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #6f9096;
  padding: 12px 22px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  border-color: #cbd5e0;
  color: #4a5568;
}

/* Filters - Mejor espaciado */
.filters-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #1e4d58;
}

.filters-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 18px;
}

.filter-label {
  font-weight: 600;
  color: #1e4d58;
  font-size: 15px;
}

.filter-buttons {
  display: flex;
  gap: 12px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
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
  border-color: #0d505a;
  color: #1e4d58;
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
  background: #0d505a;
  color: white;
  padding: 3px 9px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.filter-btn.active .count-badge {
  background: currentColor;
}

/* Stats - Mejor espaciado */
.stats {
  display: flex;
  gap: 25px;
}

.stat-item {
  text-align: center;
  padding: 0 18px;
}

.stat-number {
  display: block;
  font-size: 26px;
  font-weight: 700;
  color: #0d505a;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 13px;
  color: #838383;
  text-transform: uppercase;
  font-weight: 600;
}

/* Modal - Mejor espaciado */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 650px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  border-top: 5px solid #0d505a;
  display: flex;
  flex-direction: column;
  animation: modalAppear 0.3s ease-out;
}
@keyframes modalAppear {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 32px 20px;
  border-bottom: 1px solid #e8f5f0;
  flex-shrink: 0;
  background: linear-gradient(to right, #f8faf9, #ffffff);
}

.modal-body-scrollable {
  flex: 1;
  overflow-y: auto;
  max-height: calc(90vh - 180px);
  padding: 5px;
}
.modal-body {
  padding: 30px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.modal-header h2 {
  margin: 0;
  color: #1e4d58;
  font-size: 26px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
}

.close-btn {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  font-size: 20px;
  cursor: pointer;
  color: #6f9096;
  padding: 10px;
  border-radius: 10px;
  transition: all 0.3s ease;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #edf2f7;
  color: #4a5568;
  transform: rotate(90deg);
}

.modal-body {
  padding: 28px;
}

.form-group {
  margin-bottom: 22px;
    position: relative;

}

.form-group label {
  display: block;
  margin-bottom: 10px;
  color: #1e4d58;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  font-family: inherit;
}
.form-group label i {
  color: #0d505a;
  font-size: 18px;
  width: 24px;
  text-align: center;
}
.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  font-family: inherit;
  background: #f8faf9;
}
.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #0d505a;
  box-shadow: 0 0 0 4px rgba(13, 80, 90, 0.15);
  background: white;
}
.form-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}
.example-text {
  display: block;
  font-size: 13px;
  color: #6f9096;
  margin-top: 8px;
  font-style: italic;
  padding-left: 34px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.footer-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 25px;
}

.modal-footer {
  padding: 28px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* NUEVOS ESTILOS PARA SELECTOR DE MIEMBROS - Mejor espaciado */
.members-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
  align-items: center;
}

.members-selector select {
  flex: 1;
  padding: 12px 16px;
}

.add-member-btn {
  padding: 12px 18px;
  background: #0d505a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;
  font-size: 14px;
}

.add-member-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-member-btn:hover:not(:disabled) {
  background: #1e4d58;
}

.selected-members {
  margin-top: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px;
  background: #f8faf9;
}

.selected-members-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-weight: 600;
  color: #1e4d58;
  font-size: 15px;
}

.members-count {
  background: #0d505a;
  color: white;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.member-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 8px 14px;
  border: 1px solid #0d505a;
  border-radius: 20px;
  font-size: 14px;
  background: #e8f5f0;
}

.remove-member-btn {
  background: none;
  border: none;
  color: #6f9096;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 12px;
}

.remove-member-btn:hover {
  background: #fed7d7;
  color: #c53030;
}

/* Tickets Grid - Mejor espaciado */
.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
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
  padding: 20px;
  border-bottom: 1px solid #f7fafc;
}

.ticket-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
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
  font-size: 12px;
}

.ticket-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.status-select {
  padding: 6px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
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
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6f9096;
  font-size: 14px;
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
  padding: 25px;
}

.ticket-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e4d58;
  margin-bottom: 15px;
  line-height: 1.5;
}

.ticket-description {
  color: #838383;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.ticket-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #838383;
}

.meta-label {
  font-weight: 500;
}

.priority-icon {
  font-size: 14px;
}

.priority-icon.priority-alta {
  color: #e53e3e;
}

.priority-icon.priority-media {
  color: #d69e2e;
}

.priority-icon.priority-baja {
  color: #0d505a;
}

/* Estilos para mostrar miembros en los tickets */
.members-preview {
  display: flex;
  align-items: center;
  gap: 10px;
}

.member-chips {
  display: flex;
  gap: 6px;
}

.member-chip {
  background: #0d505a;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.more-members {
  background: #6f9096;
}

.ticket-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #f7fafc;
  background: #f8faf9;
}

.ticket-id {
  font-size: 12px;
  color: #838383;
  font-family: "Courier New", monospace;
  font-weight: 600;
}

.ticket-badges {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 12px;
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
  color: #0d505a;
}

.members-badge {
  background: #e8f5f0;
  color: #0d505a;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
}

/* Priority borders */
.ticket-card.priority-alta {
  border-left: 4px solid #e53e3e;
}

.ticket-card.priority-media {
  border-left: 4px solid #d69e2e;
}

.ticket-card.priority-baja {
  border-left: 4px solid #0d505a;
}

/* Loading and empty states */
.loading-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 70px 30px;
  color: white;
  text-align: center;
}

.spinner {
  width: 45px;
  height: 45px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.empty-icon {
  font-size: 70px;
  margin-bottom: 25px;
  opacity: 0.8;
}

.empty-state h3 {
  margin: 0 0 15px 0;
  font-size: 26px;
  font-weight: 600;
}

.empty-state p {
  margin: 0 0 30px 0;
  opacity: 0.9;
  font-size: 17px;
  line-height: 1.6;
}

/* Logout button */
.logout-btn {
  position: fixed;
  bottom: 25px;
  right: 25px;
  background: #e53e3e;
  color: white;
  border: none;
  padding: 14px 26px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
}

.logout-btn:hover {
  background: #c53030;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Agregar estos estilos */
.email-section {
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 25px;
}

.btn-email {
  background: linear-gradient(135deg, #0d505a 0%, #1e4d58 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
}

.btn-email:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 80, 90, 0.3);
}

.btn-email:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.email-note {
  color: #6f9096;
  font-size: 13px;
  display: block;
  margin-top: 10px;
  line-height: 1.4;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .tickets-dashboard {
    padding: 20px 15px;
  }

  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .header-title {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .filters-content {
    flex-direction: column;
    gap: 20px;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .filter-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .tickets-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .modal-content {
    max-height: 90vh;
    overflow-y: auto;
    width: 95%;
    margin: 20px;
  }

  .btn-edit {
    color: #0d505a;
  }

  .btn-edit:hover {
    background: #e8f5f0;
    border-color: #0d505a;
    color: #1e4d58;
  }

  .footer-buttons {
    flex-direction: column;
  }
  
  .footer-buttons button {
    width: 100%;
  }
  
  .email-section {
    padding: 15px;
  }

  .modal-header,
  .modal-body-content,
  .modal-footer {
    padding: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .header-title h1 {
    font-size: 24px;
  }

  .filter-btn {
    padding: 10px 14px;
    font-size: 13px;
  }

  .stats {
    flex-direction: column;
    gap: 15px;
  }

  .modal-body-scrollable {
    max-height: calc(90vh - 180px);
  }
  
  .members-selector {
    flex-direction: column;
  }
  
  .add-member-btn {
    margin-top: 10px;
  }
  
  .btn-primary, .btn-secondary, .btn-outline {
    padding: 12px 18px;
    font-size: 14px;
  }
}
</style>