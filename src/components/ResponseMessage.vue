<script setup lang="ts">
import type { Guest } from '../types/guest'

defineProps<{
  guest: Guest
}>()

const emit = defineEmits<{
  (e: 'reset'): void
  (e: 'change'): void
}>()
</script>

<template>
  <v-card class="mx-auto response-card" max-width="600">
    <v-card-text class="text-center py-4">
      <v-icon
        :color="guest.isAttending ? 'success' : 'error'"
        size="64"
        class="mb-4"
      >
        {{ guest.isAttending ? 'mdi-check-circle' : 'mdi-information' }}
      </v-icon>
      
      <h2 class="text-h4 mb-2">Obrigado pela sua resposta!</h2>
      <p class="text-subtitle-1 mb-6">
        {{ guest.isAttending 
          ? "Estámos muito felizes com sua presença!" 
          : "Estámos muito tristes que não poderá ir." }}
      </p>
      
      <div class="button-group">
        <v-btn
          color="warning"
          variant="elevated"
          prepend-icon="mdi-pencil"
          @click="emit('change')"
          class="mb-2 change-btn"
        >
          Mudar Resposta
        </v-btn>
        
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-magnify"
          @click="emit('reset')"
          class="search-btn"
        >
          Buscar Convidado
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.response-message {
  text-align: center;
  margin: 2rem 0;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.change-btn :deep(.v-icon) {
  font-size: 18px;
}

.search-btn :deep(.v-icon) {
  font-size: 18px;
}

.btn-reset {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.1s ease;
  background-color: #6c757d;
  color: white;
}

.btn-reset:active {
  transform: scale(0.98);
}

/* Mobile-specific styles */
@media (max-width: 600px) {
  .response-card {
    max-width: 100%;
  }

  :deep(.v-card-text) {
    padding: 1.5rem 1rem !important;
  }

  :deep(.v-icon) {
    font-size: 48px !important;
    margin-bottom: 1rem !important;
  }

  :deep(.text-h4) {
    font-size: 1.5rem !important;
    margin-bottom: 0.75rem !important;
  }

  :deep(.text-subtitle-1) {
    font-size: 1rem !important;
    margin-bottom: 1.5rem !important;
  }

  :deep(.v-btn) {
    width: 100%;
    min-height: 48px;
    font-size: 1rem;
  }

  .change-btn :deep(.v-icon),
  .search-btn :deep(.v-icon) {
    font-size: 18px;
  }
}
</style>