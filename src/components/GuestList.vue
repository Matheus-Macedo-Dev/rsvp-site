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

        <v-list-item-title class="text-subtitle-1 guest-name">
          {{ guest.name }}
        </v-list-item-title>
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

.guest-name {
  white-space: normal;
  word-wrap: break-word;
  line-height: 1.3;
  padding-right: 0.5rem;
}

:deep(.v-list-item__content) {
  font-size: 1.1rem;
  overflow: visible !important;
}

/* Mobile-specific styles */
@media (max-width: 600px) {
  .guest-list-card {
    max-height: 200px;
  }

  .guest-item {
    min-height: 56px;
    padding: 0.75rem 0.5rem;
  }

  .guest-name {
    font-size: 0.95rem;
    line-height: 1.3;
  }

  :deep(.v-list-item__content) {
    font-size: 1rem;
    flex: 1;
    min-width: 0;
  }

  :deep(.v-list-item-title) {
    font-size: 0.95rem !important;
  }

  :deep(.v-chip) {
    font-size: 0.75rem;
    height: 24px;
  }

  :deep(.v-icon) {
    font-size: 20px;
  }
}
</style>