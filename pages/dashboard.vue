<template>
  <div class="flex flex-col items-center justify-center">
    <div class="text-center font-heading font-bold text-6xl pt-10 pb-6">
      {{ title }}
    </div>
    <div class="relative h-[290px] w-[384px] bg-[url('/assets/img/piggy.png')] bg-cover bg-center font-numbers ">
      <div class="absolute top-[120px] w-full -ml-2 flex flex-col justify-center">
        <div class="text-4xl font-black flex justify-center">
          {{ satsText }}
        </div>
        <div class="text-l font-bold flex justify-between px-12">
          <div>{{ rateText }}</div>
          <div>{{ eurText }}</div>
        </div>
      </div>
    </div>
    <div class="mt-2 min-w-80 bg-white shadow-md rounded-md p-2 flex justify-between">
      <UButton
        icon="i-heroicons-arrow-up-tray-20-solid"
        size="sm"
        @click="logout"
      >
        Logout
      </UButton>
      <UButton
        v-if="address != null"
        icon="i-heroicons-at-symbol-16-solid"
        size="sm"
        @click="openPopup(address, address)"
      >
        Address
      </UButton>
      <UButton
        v-if="lnurl != null"
        icon="i-heroicons-arrow-down-on-square-20-solid"
        size="sm"
        @click="openPopup('LNURLp', lnurl)"
      >
        LNURLp
      </UButton>
    </div>
  </div>
  <UModal v-model="isOpen" :ui="{ width: '' }">
    <UCard
      :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
          base: '',
        },
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ popupTitle }}
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
      <!-- // eslint-disable-next-line vue/no-v-html -->
      <div v-html="popupQrCode" class="flex justify-center" />
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import QRCode from 'qrcode-svg'

const { $auth } = useNuxtApp()
const isOpen = ref(false)

const satsText = ref('Loading ...')
const eurText = ref('')
const rateText = ref('')
const lnurl = ref<string | null>()
const address = ref<string | null>()
const lastUpdate = ref('')
const sats = ref(0)
const title = ref('Piggy Bank')
const popupTitle = ref('')
const popupQrCode = ref('')

onMounted(async () => {
  await $auth.redirectIfLoggedOut()

  const response = await $auth.$fetch('/api/dashboard', {
    method: 'GET',
  })

  title.value = `${response.name}'s Piggy Bank`
  eurText.value = `${response.eur} EUR`
  rateText.value = `1 BTC = ${response.rate} EUR`
  lastUpdate.value = getCurrentTime()
  lnurl.value = response.lnurl
  address.value = response.address

  countTo({
    ref: sats,
    endValue: response.sats,
    duration: calculateDuration(response.sats),
  })
})

const openPopup = (title: string, lnurl: string) => {
  popupTitle.value = title
  popupQrCode.value = new QRCode({
    content: lnurl,
    padding: 0,
    width: 200,
    height: 200,
    color: '#000000',
    background: '#ffffff',
  }).svg()
  isOpen.value = true
}

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
