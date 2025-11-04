<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Guest } from '../types/guest'
import { fetchGuests, updateGuestResponse } from '../services/guestService'
import SearchBox from './SearchBox.vue'
import GuestList from './GuestList.vue'
import RsvpConfirmation from './RsvpConfirmation.vue'
import ResponseMessage from './ResponseMessage.vue'

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
  // Only search when 3 or more characters are entered
  if (!query || query.length < 3) return []
  return guestList.value.filter(guest => 
    guest.name?.toLowerCase().includes(query)
  )
})

const showGuestList = ref(true)

// Show guest list when user starts typing
watch(searchQuery, (newValue) => {
  if (newValue.trim()) {
    showGuestList.value = true
  }
})

const handleGuestSelect = (guest: Guest) => {
  selectedGuest.value = guest
  showConfirmation.value = !guest.hasResponded
  showGuestList.value = false // Hide the guest list
  searchQuery.value = '' // Clear the search field
}

const handleRSVP = async (isAttending: boolean) => {
  if (!selectedGuest.value) return

  try {
    isLoading.value = true
    await updateGuestResponse(selectedGuest.value.id, selectedGuest.value.name, isAttending)
    
    // Update local state after successful API call
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
    // Allow the user to change their response
    showConfirmation.value = true
  }
}
</script>

<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="start">
      <v-col>
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

        <!-- Main Card -->
        <v-card class="mx-auto pa-6" elevation="3" min-height="400px">
          <!-- Search Section -->
          <v-card-item>
            <!-- Only show title if no guest is selected -->
            <v-card-title v-if="!selectedGuest" class="text-h3 text-center mb-6">
              Confirme sua Presença
            </v-card-title>
            <v-card-text>
              <!-- Only show search box if no guest is selected -->
              <v-slide-y-transition>
                <div v-if="!selectedGuest">
                  <SearchBox
                    v-model="searchQuery"
                    placeholder="Seu nome aqui..."
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
                          No matching guests found
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
              </v-slide-y-transition>
            </v-card-text>
          </v-card-item>

          <!-- RSVP Confirmation -->
          <v-slide-y-transition>
            <v-card-item v-if="showConfirmation && selectedGuest">
              <RsvpConfirmation
                :guest="selectedGuest"
                @respond="handleRSVP"
              />
            </v-card-item>
          </v-slide-y-transition>

          <!-- Response Message -->
          <v-slide-y-transition>
            <v-card-item v-if="selectedGuest?.hasResponded && !showConfirmation">
              <ResponseMessage
                :guest="selectedGuest"
                @reset="resetSearch"
                @change="handleChangeRSVP"
              />
            </v-card-item>
          </v-slide-y-transition>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.v-container {
  min-height: 100vh;
  padding: 1rem;
}

.v-card {
  width: 100%;
  min-height: 400px;
  margin: 0 auto;
}

.text-h3 {
  font-size: clamp(1.5rem, 5vw, 2.5rem) !important;
  font-weight: 300;
  color: #2c3e50;
  line-height: 1.2;
  padding: 0 0.5rem;
}

.v-alert {
  margin-bottom: 1rem;
}

.v-overlay__content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

:deep(.search-input) {
  width: 100%;
  max-width: none !important;
}

:deep(.v-card-text) {
  position: relative;
  padding: 0.75rem;
}

/* Mobile-specific styles */
@media (max-width: 600px) {
  .v-container {
    padding: 0.5rem;
  }

  .v-card {
    border-radius: 8px;
    min-height: 300px;
  }

  .v-card.pa-6 {
    padding: 1rem !important;
  }

  :deep(.v-card-title) {
    font-size: 1.75rem !important;
    margin-bottom: 1rem !important;
    padding: 0 0.25rem;
  }
  
  :deep(.v-btn) {
    width: 100%;
    margin: 0.25rem 0 !important;
  }

  :deep(.v-alert) {
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
  }

  :deep(.v-overlay__content) {
    padding: 1rem;
  }
}

/* Extra small devices */
@media (max-width: 400px) {
  .v-container {
    padding: 0.25rem;
  }

  .v-card.pa-6 {
    padding: 0.75rem !important;
  }

  :deep(.v-card-title) {
    font-size: 1.5rem !important;
  }
}

/* Landscape mode on mobile */
@media (max-width: 900px) and (max-height: 500px) {
  .v-container {
    padding: 0.5rem;
  }

  .v-card {
    min-height: auto;
  }

  :deep(.v-card-title) {
    font-size: 1.5rem !important;
    margin-bottom: 0.75rem !important;
  }
}
</style>