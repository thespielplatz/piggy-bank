<template>
  <div class="flex flex-col items-center justify-center">
    <div class="text-center font-heading font-bold text-6xl py-10">
      Piggy Bank
    </div>
    <div class="h-4" />
    <div class="bg-white min-w-96 h-14 pt-2 shadow-md rounded-md text-center font-bold font-mono text-4xl">
      {{ status }}
    </div>
    <div class="h-4" />
    <div class="grid grid-cols-3 gap-4 p-4 bg-white shadow-md rounded-md">
      <UButton
        v-for="data in keys"
        :key="data.key"
        :disabled="['enter', 'delete'].includes(data.type) && code.length === 0"
        @click="handleKeyPress(data)"
      >
        <UIcon
          v-if="data.type === 'enter'"
          name="i-heroicons-arrow-turn-down-left-16-solid"
          class="w-8 h-8"
        />
        <UIcon
          v-if="data.type === 'delete'"
          name="i-heroicons-backspace-16-solid"
          class="w-8 h-8"
        />
        <div
          v-if="data.type === 'key'"
          class="text-4xl font-bold"
        >
          {{ data.key }}
        </div>
        <div>{{ data.chars }}</div>
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">

const { $auth } = useNuxtApp()
const toast = useToast()

const status = ref('')
const code = ref('')

const keys = [
  { key: '1', chars: '', type: 'key' },
  { key: '2', chars: 'A B C', type: 'key' },
  { key: '3', chars: 'D E F', type: 'key' },
  { key: '4', chars: 'G H I', type: 'key' },
  { key: '5', chars: 'J K L', type: 'key' },
  { key: '6', chars: 'M N O', type: 'key' },
  { key: '7', chars: 'P Q R S', type: 'key' },
  { key: '8', chars: 'T U V', type: 'key' },
  { key: '9', chars: 'W X Y Z', type: 'key' },
  { key: '', chars: 'DEL', type: 'delete' },
  { key: '0', chars: '', type: 'key' },
  { key: '', chars: 'Enter', type: 'enter' },
]

const handleKeyPress = (data: { key: string, type: string }): void => {
  switch (data.type) {
    case 'delete':
      code.value = code.value.slice(0, -1)
      break

    default:
      code.value += data.key
  }

  if (data.type === 'enter') {
    login()
    return
  }
  status.value = '* '.repeat(Math.min(code.value.length, 9)).trim()
}

const login = async () => {
  const success = await $auth.loginWithAccessKey(code.value)
  code.value = ''
  status.value = ''
  if (success) {
    await navigateTo('/dashboard')
  } else {
    toast.add({
      title: 'Code not valid',
      icon: 'i-heroicons-x-circle-16-solid',
      color: 'red',
      timeout: 1500,
      pauseTimeoutOnHover: false,
      closeButton: false,
    })
  }
}

onMounted(async () => {
  await $auth.redirectIfLoggedIn()
})

</script>
