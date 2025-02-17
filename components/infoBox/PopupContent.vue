<template>
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
        <h3 class="font-semibold text-2xl text-gray-900 dark:text-white">
          Deposit
          <UIcon
            name="i-uil-bitcoin"
            class="-mb-1 text-2xl"
          />itcoin
        </h3>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="emit('close')"
        />
      </div>
    </template>
    <h4 class="pb-4 font-semibold text-gray-900 dark:text-white text-center">
      {{ tabs && tabs.length > tabIndex ? tabs[tabIndex].title : '' }}
    </h4>
    <div v-if="tabs && tabs.length > tabIndex ? tabs[tabIndex].qrCode : ''">
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="flex justify-center"
        v-html="createQrCode(tabs[tabIndex].qrCode || '')"
      />
      <!-- eslint-enable vue/no-v-html -->
    </div>
    <UTabs
      :items="tabs"
      class="w-full pt-5"
      @change="onTabChange"
    />
  </UCard>
</template>

<script setup lang="ts">

import QRCode from 'qrcode-svg'

const tabs = ref<{ title: string, label: string, icon: string, qrCode?: string }[]>([])
const tabIndex = ref(0)

const { lnurl, address, onchain } = defineProps<{
  lnurl: string,
  address: string,
  onchain: { label: string, address: string }[],
}>()

onMounted(() => {
  if (address) {
    tabs.value.push({
      title: address,
      label: 'Address',
      icon: 'i-heroicons-at-symbol-16-solid',
      qrCode: address,
    })
  }
  if (lnurl) {
    tabs.value.push({
      title: 'LNURL Pay',
      label: 'LNURLp',
      icon: 'i-heroicons-qr-code',
      qrCode: lnurl,
    })
  }
  onchain.forEach((chain) => {
    tabs.value.push({
      title: chain.label,
      label: chain.label,
      icon: 'i-akar-icons-link-chain',
      qrCode: chain.address,
    })
  })
})

const onTabChange = (index: number) => {
  tabIndex.value = index
}

const emit = defineEmits<{
  close: []
}>()

const createQrCode = (content: string) => {
  return new QRCode({
    content,
    padding: 0,
    width: 200,
    height: 200,
    color: '#000000',
    background: '#ffffff',
  }).svg()
}

</script>
