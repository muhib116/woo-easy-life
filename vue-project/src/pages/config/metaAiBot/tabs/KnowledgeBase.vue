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
      <h2 class="text-2xl font-bold text-gray-900">Knowledge Base</h2>
      <p class="text-gray-600 text-sm mt-1">Configure system prompts and product information</p>
    </div>

    <!-- System Prompt -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <label class="block text-sm font-semibold text-gray-900 mb-2">System Prompt</label>
      <p class="text-gray-600 text-sm mb-4">Define how the bot should behave and respond. Include product details, policies, and tone.</p>
      <Textarea.Native
        v-model="form.kb_system_prompt"
        rows="8"
        placeholder="You are a helpful customer support bot for [Company Name]... Describe your products, pricing, shipping, and policies here..."
      />
      <p class="text-gray-500 text-xs mt-2">{{ form.kb_system_prompt.length }} / 5000 characters</p>
    </div>

    <!-- Product Information -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-1">Products</label>
          <p class="text-gray-600 text-sm">Add your products for the bot to reference</p>
        </div>
        <Button.Primary
          @onClick="handleAddProduct"
        >
          + Add Product
        </Button.Primary>
      </div>

      <div class="space-y-4">
        <div 
          v-for="(product, index) in form.kb_products" 
          :key="index"
          class="border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          <div class="flex gap-4 mb-4">
            <div class="flex-1">
              <Input.Primary
                v-model="product.name"
                label="Product Name"
                placeholder="e.g., Premium Package"
                hideMicrophone
              />
            </div>
            <div class="flex-1">
              <Input.Primary
                v-model="product.price"
                label="Price"
                placeholder="e.g., $99.99"
                hideMicrophone
              />
            </div>
            <div class="flex items-end">
              <Button.Primary
                @onClick="() => handleRemoveProduct(index)"
                class="bg-red-600 hover:bg-red-700"
              >
                Remove
              </Button.Primary>
            </div>
          </div>
          <div>
            <Textarea.Native
              v-model="product.description"
              label="Description"
              rows="3"
              placeholder="Describe this product..."
            />
          </div>
        </div>

        <div v-if="form.kb_products.length === 0" class="text-center py-8">
          <p class="text-gray-500 text-sm">No products added yet. Click "Add Product" to get started.</p>
        </div>
      </div>
    </div>

    <!-- Business Hours -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <label class="block text-sm font-semibold text-gray-900 mb-4">Business Hours</label>
      <div class="space-y-3">
        <div 
          v-for="(day, index) in form.kb_business_hours" 
          :key="index"
          class="flex items-center gap-4"
        >
          <div class="w-24">
            <span class="text-sm font-medium text-gray-700">{{ day.day }}</span>
          </div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="day.is_open" class="w-4 h-4 accent-orange-600 rounded" />
            <span class="text-sm text-gray-600">Open</span>
          </label>
          <input 
            v-if="day.is_open"
            v-model="day.open_time"
            type="time"
            class="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <span v-if="day.is_open" class="text-gray-600">to</span>
          <input 
            v-if="day.is_open"
            v-model="day.close_time"
            type="time"
            class="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>
    </div>

    <!-- Frequently Asked Questions -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-1">FAQs</label>
          <p class="text-gray-600 text-sm">Add frequently asked questions</p>
        </div>
        <Button.Primary
          @onClick="handleAddFaq"
        >
          + Add FAQ
        </Button.Primary>
      </div>

      <div class="space-y-4">
        <div 
          v-for="(faq, index) in form.kb_faqs" 
          :key="index"
          class="border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          <div class="flex gap-4 mb-3">
            <Input.Primary
              v-model="faq.question"
              wrapperClass="flex-1"
              placeholder="Enter question..."
              hideMicrophone
            />
            <Button.Primary
              @onClick="() => handleRemoveFaq(index)"
              class="bg-red-600 hover:bg-red-700 self-start mt-6"
            >
              Remove
            </Button.Primary>
          </div>
          <Textarea.Native
            v-model="faq.answer"
            rows="2"
            placeholder="Enter answer..."
          />
        </div>

        <div v-if="form.kb_faqs.length === 0" class="text-center py-8">
          <p class="text-gray-500 text-sm">No FAQs added yet. Click "Add FAQ" to get started.</p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-4 pt-4">
      <Button.Primary
        @onClick="(btn: any) => handleSaveKnowledgeBase(btn, form)"
        class="ml-auto"
      >
        Save Knowledge Base
      </Button.Primary>
      <button 
        @click="handleResetKnowledgeBase"
        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { Button, Input, Textarea, MessageBox, Loader } from '@/components'

const {
    form,
    isLoading,
    alertMessage,
    handleAddProduct,
    handleRemoveProduct,
    handleAddFaq,
    handleRemoveFaq,
    handleSaveKnowledgeBase,
    handleResetKnowledgeBase
} = inject<any>('useMetaAiBot')
</script>