<template>
  <UDivider class="mt-auto pt-2" />
  <UContainer class="w-full flex justify-end py-2 gap-">
    <UButton
      v-if="imprintContent != null"
      variant="link"
      color="astronaut-blue"
      @click="isOpen = true"
    >
      Imprint
    </UButton>
    <UDivider
      v-if="imprintContent != null"
      orientation="vertical"
      :ui="{ border: { base: 'border-text' } }"
      class="h-7 mt-1"
    />
    <GithubLink />
    <UDivider
      orientation="vertical"
      :ui="{ border: { base: 'border-text' } }"
      class="h-7 mt-1"
    />
    <VersionBadge />
  </UContainer>
  <UModal v-model="isOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Imprint
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>
      </template>
      <template #default>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="imprintContent" />
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">

const imprintContent = ref<null | string>(null)

const isOpen = ref(false)
onMounted(async () => {
  try {
    const response = await $fetch('/api/content/imprint', {
      method: 'GET',
    })
    imprintContent.value = response
  } catch {
    imprintContent.value = null
  }
})

</script>
