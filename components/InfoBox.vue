<template>
  <div class="p-2 bg-white shadow-md rounded-md">
    <div class="flex justify-between">
      <UModal v-model:open="isOpen">
        <UButton
          v-if="hasDepositAvaliable"
          icon="i-heroicons-arrow-down-on-square-20-solid"
          size="sm"
        >
          Deposit
        </UButton>
        <template #content>
          <InfoBoxPopupContent
            :lnurl="lnurl"
            :address="address"
            :onchain="onchain"
            @close="closePopup()"
          />
        </template>
      </UModal>
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
      <div class="text-center pt-2 pb-4 flex items-center">
        <div class="mr-2 border-t border-gray-300 flex-grow" />
        <div>
          Last
          <UIcon
            name="i-iconamoon-lightning-1-fill"
            class="w-4 h-4 -mb-1"
          />
          Payment
        </div>
        <div class="ml-2 border-t border-gray-300 flex-grow" />
      </div>
      <div class="flex justify-between">
        <div>{{ formatTime(payment?.time) }}</div>
        <div>{{ formatSats(payment?.sats) }} BTC</div>
      </div>
      <div v-if="payment?.comment">
        Message: <span class="font-normal">{{ payment?.comment }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const isOpen = ref(false)
const { lnurl, address, payment, onchain } = defineProps<{
  lnurl: string,
  address: string,
  payment: {
    sats: number,
    comment: string | null,
    time: number
  } | null,
  onchain: { label: string, address: string }[],
}>()

const hasDepositAvaliable = computed(() => lnurl != '' || address != '')

const emit = defineEmits<{
  logout: []
}>()

const closePopup = () => {
  isOpen.value = false
}

defineExpose({
  closePopup,
})

</script>
