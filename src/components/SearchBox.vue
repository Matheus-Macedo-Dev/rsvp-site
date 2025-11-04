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
    variant="plain"
    clearable
    hide-details
    class="search-field"
    :loading="disabled"
  />
</template>

<style scoped>
.search-field {
  width: 100%;
}

:deep(.v-field) {
  border-radius: 8px;
  background: transparent;
  border-bottom: 2px solid #e0e0e0;
}

:deep(.v-field__input) {
  padding: 16px 8px;
  min-height: 56px;
  font-size: 16px;
  text-align: center;
  color: #2c3e50;
  font-weight: 500;
}

:deep(.v-field__input)::placeholder {
  color: #555;
  text-align: center;
  font-weight: 400;
}

:deep(.v-field--focused) {
  border-bottom-color: #42b883;
}

:deep(.v-field__clearable) {
  display: none;
}

@media (max-width: 600px) {
  :deep(.v-field__input) {
    padding: 14px 8px;
    min-height: 48px;
    font-size: 16px;
  }
}
</style>