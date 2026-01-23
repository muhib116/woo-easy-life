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
      <h2 class="text-2xl font-bold text-gray-900">Meta Configuration</h2>
      <p class="text-gray-600 text-sm mt-1">Configure your Meta (Facebook) app settings</p>
    </div>

    <!-- Meta App ID -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <Input.Primary
        v-model="form.meta_app_id"
        label="Meta App ID"
        placeholder="e.g., 1234567890"
        hideMicrophone
      />
      <p class="text-gray-600 text-sm mt-2">Find this in Meta for Developers dashboard</p>
    </div>

    <!-- Meta App Secret -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <label class="block text-sm font-semibold text-gray-900 mb-2">Meta App Secret</label>
      <p class="text-gray-600 text-sm mb-4">Keep this secret and secure</p>
      <div class="flex gap-2">
        <Input.Primary
          :type="showAppSecret ? 'text' : 'password'"
          v-model="form.meta_app_secret"
          wrapperClass="w-full flex-1"
          placeholder="Your app secret key"
          hideMicrophone
        />
        <Button.Primary
          @onClick="showAppSecret = !showAppSecret"
        >
          {{ showAppSecret ? 'Hide' : 'Show' }}
        </Button.Primary>
      </div>
    </div>

    <!-- Page Access Token -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <label class="block text-sm font-semibold text-gray-900 mb-2">Page Access Token</label>
      <p class="text-gray-600 text-sm mb-4">Generated from your Facebook page settings</p>
      <div class="flex gap-2">
        <Input.Primary
          :type="showPageToken ? 'text' : 'password'"
          v-model="form.page_access_token"
          wrapperClass="w-full flex-1"
          placeholder="Your page access token"
          hideMicrophone
        />
        <Button.Primary
          @onClick="showPageToken = !showPageToken"
        >
          {{ showPageToken ? 'Hide' : 'Show' }}
        </Button.Primary>
      </div>
    </div>

    <!-- Business Account ID -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <Input.Primary
        v-model="form.business_account_id"
        label="Business Account ID"
        placeholder="e.g., 1234567890"
        hideMicrophone
      />
      <p class="text-gray-600 text-sm mt-2">Optional: For advanced features</p>
    </div>

    <!-- Page ID -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <Input.Primary
        v-model="form.page_id"
        label="Facebook Page ID"
        placeholder="e.g., 1234567890"
        hideMicrophone
      />
      <p class="text-gray-600 text-sm mt-2">The ID of your Facebook business page</p>
    </div>

    <!-- Webhook Events -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <label class="block text-sm font-semibold text-gray-900 mb-3">Webhook Events</label>
      <p class="text-gray-600 text-sm mb-4">Select events to subscribe to</p>
      <div class="space-y-3">
        <label class="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" v-model="form.events_messages" class="w-4 h-4 accent-orange-600 rounded" />
          <span class="text-gray-700 text-sm">Messages</span>
        </label>
        <label class="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" v-model="form.events_messaging_postbacks" class="w-4 h-4 accent-orange-600 rounded" />
          <span class="text-gray-700 text-sm">Messaging Postbacks</span>
        </label>
        <label class="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" v-model="form.events_messaging_optins" class="w-4 h-4 accent-orange-600 rounded" />
          <span class="text-gray-700 text-sm">Messaging Opt-ins</span>
        </label>
        <label class="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" v-model="form.events_messaging_optouts" class="w-4 h-4 accent-orange-600 rounded" />
          <span class="text-gray-700 text-sm">Messaging Opt-outs</span>
        </label>
      </div>
    </div>

    <!-- Connection Status -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div class="flex items-start gap-3">
        <div class="w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
        <div>
          <h4 class="font-semibold text-blue-900">Test Connection</h4>
          <p class="text-blue-700 text-sm mt-1">Click the button below to verify your Meta configuration</p>
        </div>
      </div>
      <Button.Primary
        @onClick="(btn: any) => handleTestConnection(btn, form)"
        class="mt-4 bg-blue-600 hover:bg-blue-700"
      >
        Test Connection
      </Button.Primary>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-4 pt-4">
      <Button.Primary
        @onClick="(btn: any) => handleSaveMetaConfig(btn, form)"
        class="ml-auto"
      >
        Save Configuration
      </Button.Primary>
      <button 
        @click="handleResetMetaConfig"
        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { Button, Input, MessageBox, Loader } from '@/components'

const showAppSecret = ref(false)
const showPageToken = ref(false)

const {
    form,
    isLoading,
    alertMessage,
    handleSaveMetaConfig,
    handleResetMetaConfig,
    handleTestConnection
} = inject<any>('useMetaAiBot')
</script>