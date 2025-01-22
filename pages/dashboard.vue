<template>
  <div class="flex flex-col items-center justify-center">
    <div class="text-center font-heading font-bold text-6xl pt-10 pb-6">
      Piggy Bank
    </div>
    <div class="relative h-[290px] w-[384px] bg-[url('/assets/img/piggy.png')] bg-cover bg-center">
      <div
        class="absolute top-[135px] w-full flex justify-center -ml-2
       font-numbers text-4xl font-bold"
      >
        {{ satsText }}
      </div>
    </div>
    <div class="mt-2 min-w-96 bg-white shadow-md rounded-md p-2">
      <UButton
      icon="i-heroicons-arrow-up-tray-16-solid"
      size="sm"
      @click="logout"
      >
        Logout
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">

const { $auth } = useNuxtApp()

const satsText = ref('Loading ...')
const sats = ref(0)

onMounted(async () => {
  await $auth.redirectIfLoggedOut()

  const response = await $auth.$fetch('/api/dashboard', {
    method: 'GET',
  })

  countTo({
    ref: sats,
    endValue: response.sats,
    duration: calculateDuration(response.sats),
  })
})

const logout = async () => {
  await $auth.logout()
  await navigateTo('/')
}

watch(sats, (value) => {
  satsText.value = `${formatSats(value)} BTC`
})

const calculateDuration = (endValue: number): number => {
  const minSats = 1000
  const maxSats = 1000000
  const minDuration = 500 // 1 second
  const maxDuration = 2000 // 5 seconds

  if (endValue <= minSats) {
    return minDuration
  } else if (endValue >= maxSats) {
    return maxDuration
  }

  const t = (endValue - minSats) / (maxSats - minSats)
  return minDuration + t * (maxDuration - minDuration)
}

</script>
