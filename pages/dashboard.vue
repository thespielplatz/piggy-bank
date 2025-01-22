<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div class="text-center font-heading font-bold text-6xl">
      Piggy Bank
    </div>
    <div class="h-4"></div>
    <UButton
      icon="i-heroicons-arrow-up-tray-16-solid"
      size="sm"
      @click="logout"      
    >Logout</UButton>
    <div class="relative h-[500px] w-[600px] bg-[url('/assets/img/piggy.png')] bg-cover bg-center">
      <div class="absolute top-[240px] rounded-2xl left-1/2 w-full transform -translate-x-1/2 flex items-center justify-center text-center
       font-numbers text-4xl font-bold">
        {{ satsText }}
      </div>
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
