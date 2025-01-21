<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="grid grid-cols-3 gap-4 p-4 bg-white shadow-md rounded-md">
      <UButton v-for="data in keys" :key="data.key" :disabled="data.type === 'empty'">
        <UIcon v-if="data.type === 'enter'" name="i-heroicons-arrow-left-start-on-rectangle-16-solid" class="w-8 h-8" />
        <div class="text-4xl font-bold">{{ data.key }}</div>
        <div>{{ data.chars }}</div>
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">

const keys = [
  { key: '1', chars: '', type: 'key' },
  { key: '2', chars: 'A B C', type: 'key' },
  { key: '3', chars: 'D E F', type: 'key' },
  { key: '4', chars: 'G H I', type: 'key' },
  { key: '5', chars: 'J K L', type: 'key' },
  { key: '6', chars: 'M N O', type: 'key' },
  { key: '7', chars: 'P Q R S', type: 'key' },
  { key: '8', chars: 'T U V', type: 'key' },
  { key: '9', chars: 'W X Y Z', type: 'key' },
  { key: '', chars: '', type: 'empty' },
  { key: '0', chars: '', type: 'key' },
  { key: '', chars: 'Enter', type: 'enter' },
];

const handleKeyPress = (key: string): void => {
  console.log(`Key pressed: ${key}`);
};

</script>
