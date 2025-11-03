<script setup lang="ts">
import type { Guest } from '../types/guest'

defineProps<{
  guest: Guest
}>()

const emit = defineEmits<{
  (e: 'reset'): void
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
      
      <v-btn
        color="primary"
        variant="elevated"
        prepend-icon="mdi-refresh"
        @click="emit('reset')"
      >
        Buscar outro convidado
      </v-btn>
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
</style>