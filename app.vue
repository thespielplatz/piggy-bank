<template>
  <div class="font-sans flex flex-col min-h-svh">
    <UContainer class="flex-grow px-0">
      <NuxtPage />
    </UContainer>
    <div class="print:hidden">
      <TheFooter />
    </div>
  </div>
  <UNotifications />
</template>

<script setup lang="ts">

onMounted(() => {
  document.body.classList.add('bg-background')
  document.body.classList.add('text-text')
})

</script>
