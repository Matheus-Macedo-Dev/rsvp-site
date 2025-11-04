<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Guest } from '../types/guest'
import { fetchGuests, updateGuestResponse } from '../services/guestService'
import SearchBox from './SearchBox.vue'
import GuestList from './GuestList.vue'
import RsvpConfirmation from './RsvpConfirmation.vue'
import ResponseMessage from './ResponseMessage.vue'

// Background image path
const backgroundImage = '/wedding-background.jpg'

const guestList = ref<Guest[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const searchQuery = ref('')
const selectedGuest = ref<Guest | null>(null)
const showConfirmation = ref(false)

onMounted(async () => {
  try {
    isLoading.value = true
    guestList.value = await fetchGuests()
  } catch (err) {
    error.value = 'Error ao carregar a lista de convidados. Por favor, tente novamente mais tarde.'
    console.error('Error loading guests:', err)
  } finally {
    isLoading.value = false
  }
})

const filteredGuests = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query || query.length < 3) return []
  return guestList.value.filter(guest => 
    guest.name?.toLowerCase().includes(query)
  )
})

const showGuestList = ref(true)

watch(searchQuery, (newValue) => {
  if (newValue.trim()) {
    showGuestList.value = true
  }
})

const handleGuestSelect = (guest: Guest) => {
  selectedGuest.value = guest
  showConfirmation.value = !guest.hasResponded
  showGuestList.value = false
  searchQuery.value = ''
}

const handleRSVP = async (isAttending: boolean) => {
  if (!selectedGuest.value) return

  try {
    isLoading.value = true
    await updateGuestResponse(selectedGuest.value.id, selectedGuest.value.name, isAttending)
    
    const guest = guestList.value.find(g => g.id === selectedGuest.value?.id)
    if (guest) {
      guest.hasResponded = true
      guest.isAttending = isAttending
      showConfirmation.value = false
    }
  } catch (err) {
    error.value = 'Falha ao Confirmar sua Presença. Por favor, tente novamente.'
    console.error('Error updating RSVP:', err)
    showConfirmation.value = false
  } finally {
    isLoading.value = false
    showConfirmation.value = false
  }
}

const resetSearch = () => {
  searchQuery.value = ''
  selectedGuest.value = null
  showConfirmation.value = false
  error.value = null
  showGuestList.value = true
}

const handleChangeRSVP = () => {
  if (selectedGuest.value) {
    showConfirmation.value = true
  }
}
</script>

<template>
  <v-container fluid class="fill-height rsvp-container">
    <v-row justify="center" align="start">
      <v-col cols="12" sm="10" md="8" lg="6" xl="5">
        <!-- Loading Overlay -->
        <v-overlay
          :model-value="isLoading"
          class="align-center justify-center"
        >
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          />
        </v-overlay>

        <!-- Error Alert -->
        <v-alert
          v-if="error"
          type="error"
          closable
          @click:close="error = null"
          class="mb-4"
        >
          {{ error }}
        </v-alert>

        <!-- Header with Logo -->
        <div class="header-logo">
          <img src="/wedding-logo.jpg" alt="AM Logo" class="logo-image" />
        </div>

        <!-- Main Card -->
        <v-card class="rsvp-card" elevation="0">
          <div class="card-content">
          <!-- Search Section -->
          <template v-if="!selectedGuest">
            <div class="search-card">
              <v-card-title class="rsvp-title">
                Confirme sua presença
              </v-card-title>
              <v-card-text class="pa-6">
                <SearchBox
                  v-model="searchQuery"
                  placeholder="Confirme sua presença"
                  :disabled="isLoading"
                />

                <v-slide-y-transition>
                  <template v-if="searchQuery && searchQuery.length >= 3">
                    <div class="mt-4">
                      <GuestList
                        v-if="filteredGuests.length > 0 && showGuestList"
                        :guests="filteredGuests"
                        @select="handleGuestSelect"
                      />
                      <v-alert
                        v-else
                        type="info"
                        variant="tonal"
                        class="mt-4"
                      >
                        Nenhum convidado encontrado
                      </v-alert>
                    </div>
                  </template>
                  <template v-else-if="searchQuery && searchQuery.length < 3">
                    <v-alert
                      type="info"
                      variant="tonal"
                      class="mt-4"
                    >
                      Digite pelo menos 3 caracteres para buscar
                    </v-alert>
                  </template>
                </v-slide-y-transition>
              </v-card-text>
            </div>
          </template>

          <!-- RSVP Confirmation -->
          <v-slide-y-transition>
            <div v-if="showConfirmation && selectedGuest">
              <RsvpConfirmation
                :guest="selectedGuest"
                @respond="handleRSVP"
              />
            </div>
          </v-slide-y-transition>

          <!-- Response Message -->
          <v-slide-y-transition>
            <div v-if="selectedGuest?.hasResponded && !showConfirmation">
              <ResponseMessage
                :guest="selectedGuest"
                @reset="resetSearch"
                @change="handleChangeRSVP"
              />
            </div>
          </v-slide-y-transition>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.rsvp-container {
  min-height: 100vh;
  padding: 0;
  background: transparent;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.rsvp-container > * {
  position: relative;
  z-index: 1;
}

.header-logo {
  text-align: center;
  padding: 2rem 1rem 1rem;
  background: transparent;
  width: 100%;
  margin: 0;
  flex-shrink: 0;
}

.logo-image {
  max-width: 200px;
  height: auto;
  display: inline-block;
  background: transparent;
}

.rsvp-card {
  background: transparent;
  border-radius: 0;
  overflow: visible;
  box-shadow: none;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-content {
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(100vh - 120px);
}

.search-card {
  background: white;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.rsvp-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 400;
  text-align: center;
  color: #2c3e50;
  padding: 2rem 1rem 1rem;
}

@media (max-width: 600px) {
  .rsvp-container {
    padding: 0;
  }

  .header-logo {
    padding: 1.5rem 1rem;
  }

  .logo-image {
    max-width: 150px;
  }

  .card-content {
    padding: 1rem 0.5rem;
    min-height: calc(100vh - 100px);
  }

  .rsvp-title {
    font-size: 1.5rem;
    padding: 1.5rem 1rem 0.75rem;
  }
}
</style>