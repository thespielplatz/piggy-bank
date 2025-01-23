<template>
  <div class="font-sans flex flex-col min-h-svh">
    <UContainer class="flex-grow px-0">
      <NuxtPage />
    </UContainer>
    <UDivider class="mt-auto pt-2" />
    <UContainer class="w-full flex justify-end py-2 gap-1">
      <GithubLink />
      <div>|</div>
      <VersionBadge />
    </UContainer>
  </div>
  <UNotifications />
</template>

<script setup lang="ts">

onMounted(() => {
  document.body.classList.add('bg-background')
  document.body.classList.add('text-text')
})
</script>
