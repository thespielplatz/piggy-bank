<template>
  <UCard>
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
          color="neutral"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="emit('close')"
        />
      </div>
    </template>
    <div class="pb-4 flex items-center justify-center">
      <h4 class="font-semibold text-gray-900 dark:text-white text-center">
        {{ tabs && tabs.length > tabIndex ? tabs[tabIndex].title : '' }}
      </h4>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-mdi-clipboard-multiple-outline"
        @click="copyToClipboard(tabs[tabIndex].qrCode || '')"
      />
    </div>
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
      :content="false"
      class="w-full pt-5"
      @update:model-value="onTabChange"
    />
  </UCard>
</template>

<script setup lang="ts">

import QRCode from 'qrcode-svg'

const tabs = ref<{ title: string, label: string, icon: string, qrCode?: string }[]>([])
const tabIndex = ref(0)
const toast = useToast()

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

const onTabChange = (payload: string | number) => {
  tabIndex.value = Number(payload)
}

const emit = defineEmits<{
  close: []
}>()

const createQrCode = (content: string) => {
  return new QRCode({
    content,
    padding: 2,
    width: 200,
    height: 200,
    color: '#000000',
    background: '#ffffff',
  }).svg()
}

const copyToClipboard = async (textToCopy: string) => {
  try {
    await navigator.clipboard.writeText(textToCopy)
    toast.add({
      title: 'Copied to clipboard',
      icon: 'i-heroicons-check-circle-20-solid',
      color: 'success',
      duration: 1500,
      close: false,
    })
  } catch (err) {
    toast.add({
      title: 'Failed to copy',
      icon: 'i-heroicons-x-circle-20-solid',
      color: 'error',
      duration: 1500,
      close: false,
    })
    console.error('Failed to copy: ', err)
  }
}

</script>
