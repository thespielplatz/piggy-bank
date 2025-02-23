<template>
  <div class="flex justify-center">
    <div class="flex flex-col items-end">
      <div class="text-3xl font-semibold">
        {{ satsText }}
      </div>
      <div
        v-if="rate"
        class="text-sm font-semibold"
      >
        {{ `1 BTC = ${rate} EUR` }}
      </div>
      <div
        v-if="eur"
        class="text-sm font-semibold"
      >
        {{ `${eur} EUR` }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

let firstTime = true

const satsText = ref('Loading ...')
const satsInternal = ref(-1)

const { sats, eur, rate } = defineProps<{
  sats: number,
  eur: number,
  rate: number,
}>()

watch(() => sats, (newValue: number) => {
  if (firstTime && newValue > 0) {
    countTo({
      ref: satsInternal,
      endValue: newValue,
      duration: calculateDuration(newValue),
    })
    firstTime = false
  } else {
    satsInternal.value = newValue
  }
})

watch(satsInternal, (value) => {
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

const showError = (message: string) => {
  satsText.value = message
}

defineExpose({
  showError,
})

</script>
