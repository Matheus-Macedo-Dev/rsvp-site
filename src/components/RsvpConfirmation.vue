<script setup lang="ts">
import type { Guest } from '../types/guest'

defineProps<{
  guest: Guest
}>()

const emit = defineEmits<{
  (e: 'respond', isAttending: boolean, name: string): void
}>()
</script>

<template>
  <v-card class="mx-auto confirmation-card" max-width="600">
    <v-card-text class="text-center py-4">
      <v-avatar size="80" color="primary" class="mb-4">
        <v-icon size="40" color="white">mdi-account</v-icon>
      </v-avatar>
      <h2 class="text-h4 mb-2">Olá, {{ guest.name }}!</h2>
      <p class="text-subtitle-1">Você irá comparecer ao evento?</p>
      
      <v-card-actions class="justify-center mt-4">
        <v-btn
          color="success"
          variant="elevated"
          size="large"
          prepend-icon="mdi-check"
          class="mx-2"
          @click="emit('respond', true, guest.name)"
        >
          Sim, Estarei lá.
        </v-btn>
        
        <v-btn
          color="error"
          variant="elevated"
          size="large"
          prepend-icon="mdi-close"
          class="mx-2"
          @click="emit('respond', false, guest.name)"
        >
          Sinto Muito, Não Poderei Ir.
        </v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.confirmation-section {
  text-align: center;
  margin: 2rem 0;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.1s ease;
}

.btn:active {
  transform: scale(0.98);
}

.btn-accept {
  background-color: #42b883;
  color: white;
}

.btn-decline {
  background-color: #dc3545;
  color: white;
}
</style>