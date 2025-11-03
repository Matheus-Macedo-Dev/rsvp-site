<script setup lang="ts">
import type { Guest } from '../types/guest'

defineProps<{
  guests: Guest[]
  hasResponded?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', guest: Guest): void
}>()
</script>

<template>
  <v-card class="guest-list-card mt-2" elevation="2">
    <v-list>
      <v-list-item
        v-for="guest in guests"
        :key="guest.id"
        :value="guest"
        @click="emit('select', guest)"
        :class="{ 'has-responded': guest.hasResponded }"
        class="guest-item"
      >
        <template v-slot:prepend>
          <v-icon :color="guest.hasResponded ? 'success' : 'grey'">
            {{ guest.hasResponded ? 'mdi-check-circle' : 'mdi-account' }}
          </v-icon>
        </template>

        <v-list-item-title class="text-subtitle-1">
          {{ guest.name }}
        </v-list-item-title>

        <template v-slot:append>
          <v-chip
            v-if="guest.hasResponded"
            :color="guest.isAttending ? 'success' : 'error'"
            size="small"
            class="ml-2"
          >
            {{ guest.isAttending ? 'Attending' : 'Not Attending' }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<style scoped>
.guest-list-card {
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
}

.guest-item {
  transition: background-color 0.2s ease;
}

.guest-item:hover {
  background-color: rgb(var(--v-theme-primary), 0.1);
}

.has-responded {
  background-color: rgb(var(--v-theme-surface-variant));
}

:deep(.v-list-item__content) {
  font-size: 1.1rem;
}
</style>