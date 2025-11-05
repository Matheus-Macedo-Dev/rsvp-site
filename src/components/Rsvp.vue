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
      <v-col cols="12" sm="11" md="10" lg="9" xl="8" class="content-col">
        <!-- Loading Overlay -->
        <v-overlay
          :model-value="isLoading"
          class="align-center justify-center"
        >
          <v-progress-circular
            indeterminate
            color="black"
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
        <!-- Main Card -->
        <v-card class="rsvp-card" elevation="0">
          <div class="card-content">
          <!-- Search Section -->
          <template v-if="!selectedGuest">
            <div class="search-card">
              <v-card-title class="rsvp-title">
                Confirme sua presença
              </v-card-title>
              <v-card-text class="search-content">
                <SearchBox
                  v-model="searchQuery"
                  placeholder="Digite seu nome..."
                  :disabled="isLoading"
                />

                <v-slide-y-transition>
                  <template v-if="searchQuery && searchQuery.length >= 3">
                    <div class="guest-list-wrapper">
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
  padding-top: 3rem;
  background: transparent;
  width: 100%;
  margin: 0;
  flex-shrink: 0;
}

.logo-image {
  max-width: 100px;
  height: auto;
  display: inline-block;
}

.card-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.rsvp-card {
  background: transparent;
  border-radius: 0;
  overflow: visible;
  box-shadow: none;
  width: 100%;
}

.card-content {
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}

.search-card {
  background: white;
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.rsvp-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 400;
  text-align: center;
  color: black;
  padding: 1.5rem 1.5rem 1rem;
  display: block;
  visibility: visible;
  white-space: normal;
  word-wrap: break-word;
}

.search-content {
  padding: 1.5rem;
  overflow: hidden;
  box-sizing: border-box;
}

.guest-list-wrapper {
  margin-top: 1rem;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.bottom-text {
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  color: white;
  padding: 0.75rem 1rem 3.5rem;
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
    padding-top: 3rem;
  }

  .logo-image {
    max-width: 100px;
  }

  .card-content {
    padding: 0.75rem 0.5rem;
  }

  .rsvp-title {
    font-size: 1.25rem;
    padding: 0.75rem 1rem 0.5rem;
  }

  .search-content {
    padding: 1rem;
  }

  .guest-list-wrapper {
    margin-top: 0.75rem;
  }

  .bottom-text {
    font-size: 1rem;
    padding: 1rem 2rem 4rem;
  }
}
</style>