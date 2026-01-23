<template>
  <div class="space-y-6">
    <MessageBox
        :title="alertMessage.message"
        :type="alertMessage.type"
    />
    <Loader
        class="absolute inset-1/2 z-20"
        :active="isLoading"
    />

    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900">OpenAI Configuration</h2>
      <p class="text-gray-600 text-sm mt-1">Configure your OpenAI API settings and model preferences</p>
    </div>

    <!-- API Key -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <label class="block text-sm font-semibold text-gray-900 mb-2">OpenAI API Key</label>
      <p class="text-gray-600 text-sm mb-4">Get your API key from OpenAI platform</p>
      <div class="flex gap-2">
        <Input.Primary
          :type="showApiKey ? 'text' : 'password'"
          v-model="form.openai_api_key"
          wrapperClass="w-full flex-1"
          placeholder="sk-..."
          hideMicrophone
        />
        <Button.Primary
          @onClick="showApiKey = !showApiKey"
        >
          {{ showApiKey ? 'Hide' : 'Show' }}
        </Button.Primary>
      </div>
    </div>

    <!-- Model Selection -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <Select.Primary
        label="AI Model"
        :options="modelOptions"
        itemKey="slug"
        v-model="form.openai_model"
      />
      <p class="text-gray-600 text-sm mt-2">Select the model for processing conversations</p>
    </div>

    <!-- Temperature -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <label class="block text-sm font-semibold text-gray-900 mb-2">Temperature</label>
      <p class="text-gray-600 text-sm mb-4">Controls randomness (0 = deterministic, 2 = creative)</p>
      <div class="flex items-center gap-4">
        <input 
          type="range"
          v-model.number="form.openai_temperature"
          min="0"
          max="2"
          step="0.1"
          class="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-600"
        />
        <div class="text-lg font-semibold text-orange-600 min-w-[50px]">
          {{ Number(form.openai_temperature).toFixed(1) }}
        </div>
      </div>
    </div>

    <!-- Max Tokens -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <Input.Primary
        v-model.number="form.openai_max_tokens"
        type="number"
        label="Max Tokens"
        placeholder="e.g., 2048"
        hideMicrophone
      />
      <p class="text-gray-600 text-sm mt-2">Maximum response length</p>
    </div>

    <!-- Top P -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <label class="block text-sm font-semibold text-gray-900 mb-2">Top P</label>
      <p class="text-gray-600 text-sm mb-4">Nucleus sampling parameter (0 to 1)</p>
      <div class="flex items-center gap-4">
        <input 
          type="range"
          v-model.number="form.openai_top_p"
          min="0"
          max="1"
          step="0.1"
          class="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-600"
        />
        <div class="text-lg font-semibold text-orange-600 min-w-[50px]">
          {{ Number(form.openai_top_p).toFixed(1) }}
        </div>
      </div>
    </div>

    <!-- Frequency Penalty -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <label class="block text-sm font-semibold text-gray-900 mb-2">Frequency Penalty</label>
      <p class="text-gray-600 text-sm mb-4">Reduce repetition (-2 to 2)</p>
      <div class="flex items-center gap-4">
        <input 
          type="range"
          v-model.number="form.openai_frequency_penalty"
          min="-2"
          max="2"
          step="0.1"
          class="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-600"
        />
        <div class="text-lg font-semibold text-orange-600 min-w-[50px]">
          {{ Number(form.openai_frequency_penalty).toFixed(1) }}
        </div>
      </div>
    </div>

    <!-- Presence Penalty -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <label class="block text-sm font-semibold text-gray-900 mb-2">Presence Penalty</label>
      <p class="text-gray-600 text-sm mb-4">Encourage new topics (-2 to 2)</p>
      <div class="flex items-center gap-4">
        <input 
          type="range"
          v-model.number="form.openai_presence_penalty"
          min="-2"
          max="2"
          step="0.1"
          class="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-600"
        />
        <div class="text-lg font-semibold text-orange-600 min-w-[50px]">
          {{ Number(form.openai_presence_penalty).toFixed(1) }}
        </div>
      </div>
    </div>

    <!-- Organization ID (Optional) -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <Input.Primary
        v-model="form.openai_organization_id"
        label="Organization ID"
        placeholder="org-..."
        hideMicrophone
      />
      <p class="text-gray-600 text-sm mt-2">Optional: For multi-org accounts</p>
    </div>

    <!-- Connection Status -->
    <div class="bg-green-50 border border-green-200 rounded-lg p-6">
      <div class="flex items-start gap-3">
        <div class="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
        <div>
          <h4 class="font-semibold text-green-900">Test API Connection</h4>
          <p class="text-green-700 text-sm mt-1">Verify your OpenAI API key and settings</p>
        </div>
      </div>
      <Button.Primary
        @onClick="(btn: any) => handleTestOpenAiConnection(btn, form)"
        class="mt-4 bg-green-600 hover:bg-green-700"
      >
        Test Connection
      </Button.Primary>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-4 pt-4">
      <Button.Primary
        @onClick="(btn: any) => handleSaveOpenAiConfig(btn, form)"
        class="ml-auto"
      >
        Save Configuration
      </Button.Primary>
      <button 
        @click="handleResetOpenAiConfig"
        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { Button, Input, Select, MessageBox, Loader } from '@/components'

const showApiKey = ref(false)

const modelOptions = [
    { title: 'GPT-4o (Recommended)', slug: 'gpt-4o' },
    { title: 'GPT-4 Turbo', slug: 'gpt-4-turbo' },
    { title: 'GPT-4', slug: 'gpt-4' },
    { title: 'GPT-3.5 Turbo', slug: 'gpt-3.5-turbo' }
]

const {
    form,
    isLoading,
    alertMessage,
    handleSaveOpenAiConfig,
    handleResetOpenAiConfig,
    handleTestOpenAiConnection
} = inject<any>('useMetaAiBot')
</script>