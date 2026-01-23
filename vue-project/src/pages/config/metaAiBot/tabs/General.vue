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
      <h2 class="text-2xl font-bold text-gray-900">General Settings</h2>
      <p class="text-gray-600 text-sm mt-1">Configure basic Meta AI Bot settings</p>
    </div>

    <!-- Enable Bot Toggle -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Enable Meta AI Bot</h3>
          <p class="text-gray-600 text-sm mt-1">Activate or deactivate the bot</p>
        </div>
        <Switch v-model="form.is_enabled" />
      </div>
    </div>

    <!-- Webhook URL -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <label class="block text-sm font-semibold text-gray-900 mb-2">Webhook URL</label>
      <p class="text-gray-600 text-sm mb-4">Use this URL in Meta for Developers webhook configuration</p>
      <div class="flex gap-2">
        <Input.Primary
            wrapperClass="w-full flex-1"
            type="text" 
            v-model="form.webhook_url"
            readonly
            hideMicrophone
        />
        <Button.Primary 
          @onClick="(btn: any) => handleCopyToClipboard(form.webhook_url, btn)"
        >
          Copy
        </Button.Primary>
      </div>
    </div>

    <!-- Verify Token -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <label class="block text-sm font-semibold text-gray-900 mb-2">Verify Token</label>
      <p class="text-gray-600 text-sm mb-4">Create a secure token for webhook verification</p>
      <div class="flex gap-2">
        <Input.Primary
          :type="showToken ? 'text' : 'password'"
          v-model="form.verify_token"
          wrapperClass="w-full flex-1"
          placeholder="Enter or generate a token"
          hideMicrophone
        />
        <Button.Primary
          @onClick="(btn) => handleGenerateToken(btn)"
        >
          Generate
        </Button.Primary>
        <Button.Primary
          @onClick="showToken = !showToken"
        >
          {{ showToken ? 'Hide' : 'Show' }}
        </Button.Primary>
      </div>
    </div>

    <!-- Bot Name -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <Input.Primary
        v-model="form.bot_name"
        placeholder="e.g., Customer Support Bot"
        label="Bot Name"
        hideMicrophone
      />
    </div>

    <!-- Default Response -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <label class="block text-sm font-semibold text-gray-900 mb-2">Default Response</label>
      <Textarea.Native
        v-model="form.default_response"
        rows="4"
        placeholder="Enter default response message"
      />
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-4 pt-4">
      <Button.Primary
        @onClick="(btn) => handleSaveSettings(btn, form)"
        class="ml-auto"
      >
        Save Settings
      </Button.Primary>
      <button 
        @click="handleResetSettings"
        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { Input, Switch, Button, Textarea, MessageBox, Loader } from '@/components'

const showToken = ref(false)

const {
    form,
    isLoading,
    alertMessage,
    handleSaveSettings,
    handleResetSettings,
    handleCopyToClipboard,
    handleGenerateToken
} = inject<any>('useMetaAiBot')
</script>