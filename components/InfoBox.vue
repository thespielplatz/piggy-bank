<template>
  <div class="p-2 bg-white shadow-md rounded-md">
    <div class="flex justify-between">
      <UButton
        v-if="hasDepositAvaliable"
        icon="i-heroicons-arrow-down-on-square-20-solid"
        size="sm"
        @click="openPopup()"
      >
        Deposit
      </UButton>
      <UButton
        icon="i-heroicons-arrow-up-tray-20-solid"
        size="sm"
        :class="{ 'ml-auto': !hasDepositAvaliable }"
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
  >
    <InfoBoxPopupContent
      :lnurl="lnurl"
      :address="address"
      @close="closePopup()"
    />
  </UModal>
</template>

<script setup lang="ts">

const isOpen = ref(false)

const { lnurl, address, payment } = defineProps<{
  lnurl: string,
  address: string,
  payment: {
    sats: number,
    comment: string | null,
    time: number
  } | null,
}>()

const hasDepositAvaliable = computed(() => lnurl != '' || address != '')

const emit = defineEmits<{
  logout: []
}>()

const closePopup = () => {
  isOpen.value = false
}

const openPopup = () => {
  isOpen.value = true
}

defineExpose({
  closePopup,
})

</script>
