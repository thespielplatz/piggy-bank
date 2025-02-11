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
    <div v-if="tabIndex === 0">
      <h4 class="pb-4 font-semibold text-gray-900 dark:text-white text-center">
        {{ address }}
      </h4>
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="flex justify-center"
        v-html="addressQrCode"
      />
      <!-- eslint-enable vue/no-v-html -->
    </div>
    <div v-if="tabIndex === 1">
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="flex justify-center"
        v-html="lnurlQrCode"
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

const tabs = ref<{ label: string, slot: string, icon: string }[]>([])
const addressQrCode = ref('')
const lnurlQrCode = ref('')
const tabIndex = ref(0)

const { lnurl, address } = defineProps<{
  lnurl: string,
  address: string,
}>()

onMounted(() => {
  if (address) {
    tabs.value.push({
      label: 'Address',
      slot: 'address',
      icon: 'i-heroicons-at-symbol-16-solid',
    })
    addressQrCode.value = new QRCode({
      content: address,
      padding: 0,
      width: 200,
      height: 200,
      color: '#000000',
      background: '#ffffff',
    }).svg()
  }
  if (lnurl) {
    tabs.value.push({
      label: 'LNURL',
      slot: 'lnurl',
      icon: 'i-heroicons-qr-code',
    })
    lnurlQrCode.value = new QRCode({
      content: lnurl,
      padding: 0,
      width: 200,
      height: 200,
      color: '#000000',
      background: '#ffffff',
    }).svg()
  }
})

const onTabChange = (index: number) => {
  tabIndex.value = index
}

const emit = defineEmits<{
  close: []
}>()

</script>
