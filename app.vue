<template>
  <UApp>
    <div class="font-sans flex flex-col min-h-svh bg-background-yellow text-text">
      <UContainer class="flex-grow px-0">
        <NuxtPage />
      </UContainer>
      <div class="print:hidden">
        <FooterMain />
      </div>
    </div>
    <!--
    <UNotifications />
    -->
  </UApp>
</template>
