<template>
  <div class="border-b border-gray-200">
    <div class="flex gap-8">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="activeTab = index"
        :class="[
          'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
          activeTab === index
            ? 'text-orange-600 border-orange-600'
            : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
        ]"
      >
        {{ tab }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tabs = [
  'General',
  'Meta Config',
  'OpenAI',
  'Knowledge Base',
  'Logs'
];

const activeTab = ref(0);
</script>