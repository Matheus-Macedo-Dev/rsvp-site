<script setup lang="ts">
import type { Guest } from '../types/guest'

defineProps<{
  guests: Guest[]
}>()

const emit = defineEmits<{
  (e: 'select', guest: Guest): void
}>()
</script>

<template>
  <div class="guest-list-container">
    <!-- Header Row -->
    <div class="guest-list-header">
      <span class="header-label">Nome</span>
      <span class="header-label">Resposta</span>
    </div>

    <!-- Guest List -->
    <v-list class="guest-list">
      <v-list-item
        v-for="guest in guests"
        :key="guest.id"
        :value="guest"
        @click="emit('select', guest)"
        class="guest-item"
      >
        <v-list-item-title class="guest-name">
          {{ guest.name }}
        </v-list-item-title>

        <template v-slot:append>
          <v-icon
            :color="guest.hasResponded ? 'success' : 'primary'"
            size="24"
          >
            {{ guest.hasResponded ? 'mdi-check-circle' : 'mdi-clock-outline' }}
          </v-icon>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<style scoped>
.guest-list-container {
  width: 100%;
}

.guest-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 2px solid #e0e0e0;
}

.header-label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.header-label:last-child {
  width: 40px;
  text-align: center;
}

.guest-list {
  padding: 0;
  background: transparent;
}

.guest-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
}

.guest-item:last-child {
  border-bottom: 1px solid #f0f0f0;
}

.guest-item:hover {
  background-color: #f8f9fa;
}

.guest-name {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
  flex: 1;
  text-align: left;
}

:deep(.v-list-item__append) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  margin-left: 0;
}

@media (max-width: 600px) {
  .guest-list-header {
    padding: 10px 12px;
  }

  .header-label {
    font-size: 0.7rem;
  }

  .guest-item {
    padding: 12px;
  }

  .guest-name {
    font-size: 0.9rem;
  }
}
</style>