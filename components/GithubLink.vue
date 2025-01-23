<template>
  <ULink
    :to="githubLink"
    target="_blank"
    class="flex items-center gap-1"
    inactive-class="underline"
  >
    <UIcon name="i-grommet-icons-github" /> Github
  </ULink>
</template>

<script setup lang="ts">

const runtimeConfig = useRuntimeConfig()
const githubLink = ref(runtimeConfig.public.githubLink)

</script>
