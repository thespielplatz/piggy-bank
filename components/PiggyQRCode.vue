<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-html="printQrCode"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>

<script setup lang="ts">

import QRCode from 'qrcode-svg'

const printQrCode = ref('')

onMounted(async () => {
  printQrCode.value = new QRCode({
    content: window.location.origin,
    padding: 0,
    width: 175,
    height: 175,
    color: '#f8a394',
    background: '#1e4563',
  }).svg()
})

</script>
