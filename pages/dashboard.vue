<template>
  <div class="flex flex-col items-center justify-center">
    <div class="text-center font-heading font-bold text-6xl pt-10 pb-6">
      <div>{{ title }}</div>
      <div class="flex justify-center">
        <div>
          <UIcon
            name="i-uil-bitcoin"
            class="text-7xl -mb-4 -mr-3"
          />
          Piggy Bank
        </div>
      </div>
    </div>
    <div class="relative h-[290px] w-[384px] bg-[url('/img/piggy.png')] bg-cover bg-center font-numbers ">
      <div class="hidden print:flex absolute top-[65px] w-80 ml-8 justify-center">
        <PiggyQRCode />
      </div>
      <div class="absolute top-[120px] w-80 ml-6 flex flex-col justify-center print:hidden">
        <PiggyValue
          :sats="sats"
          :eur="eur"
          :rate="rate"
        />
      </div>
    </div>
    <div class="mt-2 min-w-80 print:hidden">
      <InfoBox
        ref="infoBoxRef"
        :lnurl="lnurl"
        :address="address"
        :onchain="onchain"
        :payment="payment"
        @logout="logout"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

import type { InfoBox } from '#components'

const POLLING_INTERVAL = 2000

const { $auth } = useNuxtApp()
const toast = useToast()

const infoBoxRef = ref<InstanceType<typeof InfoBox> | null>(null)

const satsText = ref('Loading ...')
const lnurl = ref('')
const address = ref('')
const lastUpdate = ref('')
const onchain = ref<{ label: string, address: string }[]>([])
const sats = ref(0)
const title = ref('')
const rate = ref(0)
const eur = ref(0)

const payment = ref<{ sats: number, comment: string | null, time: number } | null>(null)

let firstTime = true
let lastSatsValue = 0

let intervalId: NodeJS.Timeout | null = null

onMounted(async () => {
  await $auth.redirectIfLoggedOut()
  startPolling()
})

onUnmounted(async () => {
  stopPolling()
})

const startPolling = () => {
  if (!intervalId) {
    intervalId = setInterval(fetchData, POLLING_INTERVAL)
    fetchData()
  }
}

const stopPolling = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const fetchData = async () => {
  let response
  try {
    response = await $auth.$fetch('/api/dashboard', {
      method: 'GET',
    })
  } catch (error) {
    if (firstTime) {
      toast.add({
        title: 'Error',
        description: error.message,
        icon: 'i-heroicons-x-circle-16-solid',
        color: 'red',
        timeout: 0,
        closeButton: false,
      })
      satsText.value = 'Error'
      stopPolling()
      firstTime = false
      return
    }
  }

  title.value = `${response.name}'s`
  lastUpdate.value = formatTime()
  lnurl.value = response.lnurl || ''
  address.value = response.address || ''
  payment.value = response.payment
  onchain.value = response.onchain

  rate.value = response.rate
  eur.value = response.eur
  sats.value = response.sats

  if (firstTime && response.sats > 0) {
    lastSatsValue = response.sats
    firstTime = false
  }

  if (lastSatsValue != response.sats) {
    infoBoxRef.value?.closePopup()
    toast.add({
      title: response.payment?.comment || 'New Payment',
      description: `+${response.payment?.sats} sats`,
      icon: 'i-heroicons-currency-bitcoin-16-solid',
      color: 'green',
      timeout: 2000,
    })
    lastSatsValue = response.sats
  }
}

const logout = async () => {
  await $auth.logout()
  await navigateTo('/')
}

</script>
