<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div class="text-center font-heading font-bold text-6xl">
      Piggy Bank
    </div>
    <div class="h-4"></div>
    <UButton
      icon="i-heroicons-arrow-up-tray-16-solid"
      size="sm"
      @click="logout"      
    >Logout</UButton>
    <div class="relative h-[500px] w-[600px] bg-[url('/assets/img/piggy.png')] bg-cover bg-center">
      <div class="absolute top-[190px] w-96 h-36 rounded-2xl left-1/2 transform -translate-x-1/2 bg-dodger-blue-500 shadow-md text-white p-4 text-center content-center">
        {{ sats }}
      </div>
  </div>  
</div>  
</template>

<script setup lang="ts">

const { $auth } = useNuxtApp()

const sats = ref('Loading piggy bank ...')

onMounted(async () => {
  await $auth.redirectIfLoggedOut()
  /*
  list.value = await $auth.$fetch('/api/dashboard', {
    method: 'GET',
  })*/
})

const logout = async () => {
  await $auth.logout()
  await navigateTo('/')
}

</script>
