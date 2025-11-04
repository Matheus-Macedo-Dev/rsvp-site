<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const handleClear = () => {
  emit('update:modelValue', '')
}
</script>

<template>
  <v-text-field
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @click:clear="handleClear"
    :placeholder="placeholder"
    :disabled="disabled"
    variant="outlined"
    clearable
    prepend-inner-icon="mdi-magnify"
    :loading="disabled"
  />
</template>

<style scoped>
.search-input {
  max-width: 600px;
  margin: 0 auto;
}

:deep(.v-field) {
  border-radius: 12px !important;
  font-size: 1.2rem;
}

:deep(.v-field__input) {
  padding: 12px !important;
  min-height: 56px !important;
  font-size: 16px !important; /* Prevents iOS auto-zoom */
}

/* Mobile-specific styles */
@media (max-width: 600px) {
  .search-input {
    max-width: 100%;
  }

  :deep(.v-field) {
    font-size: 1rem;
  }

  :deep(.v-field__input) {
    padding: 14px !important;
    min-height: 48px !important;
    font-size: 16px !important; /* Critical for iOS */
  }

  :deep(.v-icon) {
    font-size: 24px;
  }
}
</style>