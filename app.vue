<template>
  <div class="font-sans min-h-[var(--app-height)]">
    <UContainer>
      <div class="px-2">
        <NuxtPage />
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">

onMounted(() => {
  document.body.classList.add('bg-background')
  document.body.classList.add('text-text')
})
</script>
