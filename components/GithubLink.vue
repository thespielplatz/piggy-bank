<template>
  <UButton
    variant="link"
    :to="githubLink"
    target="_blank"
    class="flex items-center gap-1"
  >
    <UIcon name="i-grommet-icons-github" /> Github
  </UButton>
</template>

<script setup lang="ts">

const runtimeConfig = useRuntimeConfig()
const githubLink = ref(runtimeConfig.public.githubLink)

</script>
