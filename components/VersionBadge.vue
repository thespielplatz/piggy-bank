<template>
  <ULink
    :to="tagLink"
    target="_blank"
  >
    <UBadge
      :ui="{ rounded: 'rounded-full' }"
      class="underline"
    >
      {{ version }}
    </UBadge>
  </ULink>
</template>

<script setup lang="ts">

const runtimeConfig = useRuntimeConfig()

const version = ref(runtimeConfig.public.version ? `v${runtimeConfig.public.version}` : 'undefined')
const releasedVersion = ref(runtimeConfig.public.releasedVersion ? `v${runtimeConfig.public.releasedVersion}` : 'undefined')

const tagLink = ref(`${runtimeConfig.public.githubLink}/releases/tag/${releasedVersion.value}`)

</script>
