<template>
  <div class="p-2 bg-white shadow-md rounded-md">
    <div class="flex justify-between">
      <UButton
        v-if="lnurl != null"
        icon="i-heroicons-arrow-down-on-square-20-solid"
        size="sm"
        @click="openPopup('LNURLp', lnurl)"
      >
        Deposit
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
        icon="i-heroicons-arrow-up-tray-20-solid"
        size="sm"
        @click="emit('logout')"
      >
        Logout
      </UButton>
    </div>
    <div
      v-if="payment"
      class="pt-1 text-xs font-bold"
    >
      <UDivider label="Last Payment" />
      <div class="flex justify-between">
        <div>{{ formatTime(payment?.time) }}</div>
        <div>{{ formatSats(payment?.sats) }} BTC</div>
      </div>
      <div v-if="payment?.comment">
        Message: <span class="font-normal">{{ payment?.comment }}</span>
      </div>
    </div>
  </div>
  <UModal
    v-model="isOpen"
    :ui="{ width: '' }"
  >
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
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="flex justify-center"
        v-html="popupQrCode"
      />
      <!-- eslint-enable vue/no-v-html -->
    </UCard>
  </UModal>
</template>

<script setup lang="ts">

import QRCode from 'qrcode-svg'

const popupTitle = ref('')
const popupQrCode = ref('')
const isOpen = ref(false)

const { lnurl, address, payment } = defineProps<{
  lnurl: string,
  address: string,
  payment?: {
    time: number,
    sats: number,
    comment: string,
  },
}>()

const emit = defineEmits<{
  logout: []
}>()

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

const closePopup = () => {
  isOpen.value = false
}

defineExpose({
  closePopup,
})

</script>
