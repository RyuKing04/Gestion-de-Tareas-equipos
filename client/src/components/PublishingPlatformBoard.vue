<template>
  <div class="publishing-platform-board">
    <!-- Header -->
    <div class="board-header">
      <h1>Publishing Platform (planning)</h1>
    </div>

    <div class="board-content">
      <!-- Proposed stories section -->
      <div class="board-section">
        <div class="section-header">
          <h2>Proposed stories</h2>
          <span class="badge">4 cards</span>
        </div>
        <div class="cards-container">
          <div class="card-item">
            <span class="card-id">#404</span> Card Template
          </div>
          <div class="card-item">
            <span class="card-id">#430</span> Test benchmarks as part of CI
          </div>
          
          <div class="level-section">
            <h3 class="level-title">Level 1:</h3>
            <div class="card-item">
              <span class="card-id">#426</span> SLI Measurement
              <div class="checkbox">
                <input type="checkbox" id="checkbox-426">
                <label for="checkbox-426">07</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Support section -->
      <div class="board-section">
        <div class="section-header">
          <h2>Support</h2>
          <span class="badge">26 cards</span>
        </div>
        <div class="cards-container">
          <div class="level-section">
            <h3 class="level-title">Level 2:</h3>
            <div class="card-item">
              <span class="card-id">#417</span> Since ChangelHistory is associated with a content_id it should be associated with a locale
            </div>
          </div>
          
          <div class="level-section">
            <h3 class="level-title">Level 3:</h3>
            <div class="card-item">
              <span class="card-id">#412</span> data migrations
              <div class="checkbox">
                <input type="checkbox" id="checkbox-412" checked>
                <label for="checkbox-412">1</label>
              </div>
            </div>
          </div>
          
          <!-- Log Info section -->
          <div class="sub-section">
            <h3 class="sub-title">Log Info</h3>
            <div class="card-item">
              <span class="card-id">#410</span> Sort out the JSON description field on edition
            </div>
          </div>
          
          <div class="level-section">
            <h3 class="level-title">Level 4:</h3>
            <div class="card-item">
              <span class="card-id">#437</span> Separate integration tests from unit tests for valid schemas
            </div>
          </div>
          
          <div class="level-section">
            <h3 class="level-title">Level 5:</h3>
            <div class="card-item">
              <span class="card-id">#433</span> Resolve inconsistent documents
              <div class="checkbox">
                <input type="checkbox" id="checkbox-433" checked>
                <label for="checkbox-433">1</label>
              </div>
            </div>
          </div>
          
          <!-- High Info section -->
          <div class="sub-section">
            <h3 class="sub-title">High Info</h3>
            <div class="card-item">
              <span class="card-id">#434</span> Create alert for new Add a card...
            </div>
          </div>
        </div>
      </div>

      <!-- Mission work section -->
      <div class="board-section">
        <div class="section-header">
          <h2>Mission work</h2>
          <span class="badge">11 cards</span>
        </div>
        <div class="cards-container">
          <div class="level-section">
            <h3 class="level-title">Level 6:</h3>
            <div class="card-item">
              <span class="card-id">#429</span> Create Integration test for randomly generated editions
            </div>
          </div>
          
          <div class="level-section">
            <h3 class="level-title">Level 7:</h3>
            <div class="card-item">
              <span class="card-id">#431</span> Investigate Performance Issues in End to End tests
              <div class="checkbox">
                <input type="checkbox" id="checkbox-431">
                <label for="checkbox-431"></label>
              </div>
            </div>
          </div>
          
          <!-- Mission Tests sections -->
          <div class="sub-section">
            <h3 class="sub-title">Mission Tests and Tests</h3>
            <div class="card-item">
              End to End Tests
              <div class="checkbox">
                <input type="checkbox" id="checkbox-e2e-1">
                <label for="checkbox-e2e-1"></label>
              </div>
            </div>
          </div>
          
          <div class="sub-section">
            <h3 class="sub-title">Mission Tests and Tests</h3>
            <div class="card-item">
              End to End Tests
              <div class="checkbox">
                <input type="checkbox" id="checkbox-e2e-2">
                <label for="checkbox-e2e-2"></label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- New batch section -->
      <div class="board-section">
        <div class="section-header">
          <h2>New batch for planning</h2>
          <span class="badge">2 cards</span>
        </div>
        <div class="cards-container">
          <div class="level-section">
            <h3 class="level-title">Level 8:</h3>
            <div class="card-item">
              <span class="card-id">#415</span> use dependency resolution to update travel advice index
              <div class="checkbox">
                <input type="checkbox" id="checkbox-415">
                <label for="checkbox-415"></label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mission Highlights section -->
      <div class="board-section">
        <div class="section-header">
          <h2>Mission Highlights</h2>
        </div>
        <div class="cards-container">
          <div class="card-item">
            <span class="card-id">44.16</span> Separate TAP from the shared database
            <div class="checkbox">
              <input type="checkbox" id="checkbox-4416">
              <label for="checkbox-4416"></label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button @click="handleLogout" class="logout-btn">
      Cerrar Sesión
    </button>
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

<style scoped>
.publishing-platform-board {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.board-header {
  margin-bottom: 30px;
}

.board-header h1 {
  color: #333;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.board-content {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 20px;
}

.board-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  max-width: 350px;
}

.section-header {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.badge {
  background: #e0e0e0;
  color: #666;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.cards-container {
  padding: 15px;
}

.card-item {
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.4;
}

.card-id {
  color: #666;
  font-weight: 500;
  margin-right: 5px;
}

.level-section {
  margin-top: 15px;
}

.level-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin: 0 0 8px 0;
  text-transform: uppercase;
}

.sub-section {
  margin-top: 15px;
  padding-left: 12px;
  border-left: 3px solid #f0f0f0;
}

.sub-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin: 0 0 8px 0;
}

.checkbox {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.checkbox input {
  margin-right: 6px;
}

.checkbox label {
  color: #666;
  font-size: 12px;
}

.logout-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.logout-btn:hover {
  background: #c82333;
}

/* Scrollbar styling */
.board-content::-webkit-scrollbar {
  height: 8px;
}

.board-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.board-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.board-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>