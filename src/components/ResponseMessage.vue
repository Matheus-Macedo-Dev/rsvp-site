<script setup lang="ts">
import type { Guest } from '../types/guest'

defineProps<{
  guest: Guest
}>()

const emit = defineEmits<{
  (e: 'reset'): void
  (e: 'change'): void
}>()

const handleImageError = (event: Event) => {
  console.error('Failed to load wedding image:', event)
}
</script>

<template>
  <div class="response-container">
    <!-- Decorative Image -->
    <div class="decorative-image">
      <img 
        :src="guest.isAttending ? '/wedding-attending.png' : '/wedding-not-attending.png'"
        :alt="guest.isAttending ? 'Casal celebrando' : 'Casal triste'"
        class="wedding-image"
        @error="handleImageError"
      />
    </div>

    <!-- Message Card -->
    <v-card class="response-card" elevation="0">
      <v-card-text class="text-center pa-6">
        <h2 class="response-title">Agradecemos sua resposta</h2>
        
        <p class="response-message">
          {{ guest.isAttending 
            ? "Estamos felizes por você participar desta data tão importante para a gente." 
            : "Sentimos muito que você não poderá comparecer. Sabemos que imprevistos acontecem e saiba que você é muito especial para a gente." }}
        </p>

        <!-- Guest Info -->
        <div class="guest-info">
          <div class="info-row">
            <span class="info-label">Nome</span>
            <span class="info-label">Resposta</span>
          </div>
          <div class="info-row">
            <span class="guest-name-text">{{ guest.name }}</span>
            <v-icon
              :color="guest.isAttending ? 'success' : 'warning'"
              size="24"
            >
              {{ guest.isAttending ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="button-group">
          <v-btn
            class="action-btn btn-alterar"
            @click="emit('change')"
          >
            Alterar resposta
          </v-btn>
          
          <v-btn
            class="action-btn btn-buscar"
            @click="emit('reset')"
          >
            Buscar convidado
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.response-container {
  width: 100%;
}

.decorative-image {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.wedding-image {
  width: 100%;
  max-width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.response-card {
  background: white;
  border-radius: 16px;
}

.response-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 400;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.response-message {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 2rem;
}

.guest-info {
  margin: 2rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.info-label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.guest-name-text {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
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
  border-radius: 24px;
  box-shadow: none;
}

.btn-alterar {
  background: rgba(76, 175, 80, 0.15) !important;
  color: #4caf50 !important;
  border: none;
}

.btn-alterar:hover {
  background: rgba(76, 175, 80, 0.25) !important;
}

.btn-buscar {
  background: rgba(66, 184, 131, 0.15) !important;
  color: #42b883 !important;
  border: none;
}

.btn-buscar:hover {
  background: rgba(66, 184, 131, 0.25) !important;
}

@media (max-width: 600px) {
  .wedding-image {
    max-width: 100%;
    height: 160px;
  }

  .response-title {
    font-size: 1.5rem;
  }

  .response-message {
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