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
      <span class="header-label header-nome">Nome</span>
      <span class="header-label header-resposta">Resposta</span>
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
            :color="guest.hasResponded ? 'success' : '#007aff'"
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
  overflow-x: hidden;
  max-width: 100%;
  margin: 0 auto;
}

.guest-list-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 2px solid #e0e0e0;
  width: 100%;
  box-sizing: border-box;
}

.header-label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  white-space: nowrap;
}

.header-nome {
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-resposta {
  text-align: right;
  min-width: 80px;
}

.guest-list {
  padding: 0;
  background: transparent;
  width: 100%;
  max-width: 100%;
}

.guest-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
  min-height: unset !important;
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
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.v-list-item__content) {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

:deep(.v-list-item__append) {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  min-width: 50px;
  margin-left: 16px;
}

@media (max-width: 600px) {
  .guest-list-header {
    padding: 10px 12px;
    gap: 12px;
  }

  .header-label {
    font-size: 0.65rem;
  }

  .header-resposta {
    min-width: 60px;
  }

  .guest-item {
    padding: 12px;
  }

  .guest-name {
    font-size: 0.85rem;
  }

  :deep(.v-list-item__append) {
    min-width: 40px;
    margin-left: 12px;
  }
}
</style>