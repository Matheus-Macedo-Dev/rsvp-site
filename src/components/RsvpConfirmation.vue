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
  <div class="confirmation-container">
    <v-card class="confirmation-card" elevation="0">
      <v-card-text class="text-center pa-6">
        <h2 class="confirmation-title">Olá, {{ guest.name }}!</h2>
        
        <p class="confirmation-question">Você irá comparecer ao evento?</p>
        
        <div class="button-group">
          <v-btn
            class="action-btn btn-yes"
            @click="emit('respond', true, guest.name)"
          >
            Sim, Estarei lá
          </v-btn>
          
          <v-btn
            class="action-btn btn-no"
            @click="emit('respond', false, guest.name)"
          >
            Não Poderei Ir
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.confirmation-container {
  width: 100%;
}

.confirmation-card {
  background: white;
  border-radius: 16px;
}

.confirmation-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 400;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.confirmation-question {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 2rem;
}

.personalized-message {
  text-align: left;
  font-size: 1rem;
  line-height: 1.5;
  margin: 1.5rem 0;
}

.button-group {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
}

.action-btn {
  flex: 1;
  max-width: 180px;
  height: 48px;
  text-transform: none;
  font-size: 1rem;
  letter-spacing: normal;
  border-radius: 8px;
  box-shadow: none;
}

.btn-yes {
  background: #d9f1dd !important;
  color: #00771e !important;
  border: none;
}

.btn-yes:hover {
  background: #c4e7ca !important;
}

.btn-no {
  background: #ffd9d9 !important;
  color: #c41e3a !important;
  border: none;
}

.btn-no:hover {
  background: #ffbfbf !important;
}

@media (max-width: 600px) {
  .confirmation-title {
    font-size: 1.5rem;
  }

  .confirmation-question {
    font-size: 0.95rem;
  }

  .button-group {
    gap: 0.75rem;
  }

  .action-btn {
    max-width: 160px;
    font-size: 0.9rem;
  }
}
</style>