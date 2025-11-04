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
    <v-row justify="center" align="start" class="content-row">
      <v-col cols="12" sm="10" md="8" lg="6" xl="5" class="content-col">
        <!-- Loading Overlay -->
        <v-overlay
          :model-value="isLoading"
          class="align-center justify-center"
        >
          <v-progress-circular
            indeterminate
            color="white"
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
          <img src="/wedding-logo.png" alt="AM Logo" class="logo-image" />
        </div>

        <!-- Main Card Wrapper -->
        <div class="card-wrapper">
        <!-- Main Content -->
        <div class="rsvp-content">
          <div class="content-inner">
          <!-- Search Section -->
          <template v-if="!selectedGuest">
            <div class="search-card">
              <div class="rsvp-title">
                Confirme sua presença
              </div>
              <div class="search-area">
                <SearchBox
                  v-model="searchQuery"
                  placeholder="Digite seu nome..."
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
              </div>
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
        </div>
        </div>

        <!-- Bottom Text -->
        <div class="bottom-text">
          Pedimos que confirme o mais rápido que puder, assim que tiver certeza!
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.rsvp-container {
  min-height: 100vh;
  max-height: 100vh;
  padding: 0;
  background: transparent !important;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.content-row {
  flex: 1;
  max-height: 100vh;
}

.content-col {
  display: flex !important;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  padding: 0 !important;
}

:deep(.v-col) {
  background: transparent !important;
}

:deep(.v-row) {
  background: transparent !important;
  flex: 1;
}

.rsvp-container > * {
  position: relative;
  z-index: 1;
  
}

.header-logo {
  text-align: center;
  padding: 0.5rem 1rem 0.25rem;
  background: transparent;
  width: 100%;
  margin: 0;
  flex-shrink: 0;
}

.logo-image {
  max-width: 100px;
  height: auto;
  display: inline-block;
  background: transparent;
}

.card-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.rsvp-content {
  background: transparent;
  width: 100%;
  max-width: 600px;
}

.content-inner {
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}

.search-card {
  background: transparent;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
}

.search-area {
  padding: 1.5rem 1rem;
}

.rsvp-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 400;
  text-align: center;
  color: #2c3e50;
  padding: 1rem 1rem 0.75rem;
}

.bottom-text {
  font-family: 'Silk Serif', serif;
  font-size: 1.25rem;
  font-weight: 400;
  font-style: italic;
  text-align: center;
  color: #757c83;
  padding: 0.75rem 1rem 5rem;
  background: transparent;
  width: 100%;
  margin: 0;
  letter-spacing: 0.02em;
  line-height: 1.5;
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .rsvp-container {
    padding: 0;
  }

  .header-logo {
    padding: 0.5rem 1rem 0.25rem;
  }

  .logo-image {
    max-width: 80px;
  }

  .card-content {
    padding: 0.75rem 0.5rem;
  }

  .rsvp-title {
    font-size: 1.25rem;
    padding: 0.75rem 1rem 0.5rem;
  }

  .bottom-text {
    font-size: 1.125rem;
    padding: 0.5rem 1rem 5rem;
  }
}
</style>