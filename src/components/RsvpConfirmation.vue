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
      
      <v-alert
        v-if="guest.message"
        type="info"
        variant="tonal"
        class="my-4 personalized-message"
        icon="mdi-message-text"
      >
        {{ guest.message }}
      </v-alert>
      
      <p class="text-subtitle-1">Você irá comparecer ao evento?</p>
      
      <v-card-actions class="justify-center mt-4 button-container">
        <v-btn
          color="success"
          variant="elevated"
          size="large"
          prepend-icon="mdi-check"
          class="rsvp-btn mx-2"
          @click="emit('respond', true, guest.name)"
        >
          Sim, Estarei lá
        </v-btn>
        
        <v-btn
          color="error"
          variant="elevated"
          size="large"
          prepend-icon="mdi-close"
          class="rsvp-btn mx-2"
          @click="emit('respond', false, guest.name)"
        >
          Não Poderei Ir
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

.button-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.rsvp-btn {
  min-width: 180px;
  white-space: normal;
  height: auto !important;
  padding: 12px 20px !important;
  line-height: 1.4;
}

.personalized-message {
  text-align: left;
  font-size: 1rem;
  line-height: 1.5;
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

/* Mobile-specific styles */
@media (max-width: 600px) {
  .confirmation-card {
    max-width: 100%;
  }

  :deep(.v-card-text) {
    padding: 1.5rem 1rem !important;
  }

  :deep(.v-avatar) {
    width: 64px !important;
    height: 64px !important;
    margin-bottom: 1rem !important;
  }

  :deep(.v-avatar .v-icon) {
    font-size: 32px !important;
  }

  :deep(.text-h4) {
    font-size: 1.5rem !important;
    margin-bottom: 0.75rem !important;
  }

  :deep(.text-subtitle-1) {
    font-size: 1rem !important;
  }

  :deep(.v-card-actions) {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0 !important;
  }

  .rsvp-btn,
  :deep(.v-btn) {
    width: 100%;
    min-height: 56px;
    margin: 0 !important;
    font-size: 0.95rem;
    padding: 14px 16px !important;
    white-space: normal;
    height: auto !important;
  }

  :deep(.v-btn .v-icon) {
    font-size: 20px;
  }
}
</style>