<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Activity Logs</h2>
      <p class="text-gray-600 text-sm mt-1">Monitor bot activities and conversation history</p>
    </div>

    <!-- Filters Section -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-4">Filters</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Log Type Filter -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-2">Log Type</label>
          <select 
            v-model="filters.logType"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Types</option>
            <option value="message">Messages</option>
            <option value="error">Errors</option>
            <option value="webhook">Webhooks</option>
            <option value="api">API Calls</option>
          </select>
        </div>

        <!-- Date Range Filter -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-2">From Date</label>
          <input 
            v-model="filters.fromDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-2">To Date</label>
          <input 
            v-model="filters.toDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <!-- Search -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-2">Search</label>
          <input 
            v-model="filters.search"
            type="text"
            placeholder="Search logs..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div class="flex gap-2 mt-4">
        <button 
          @click="applyFilters"
          class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
        >
          Apply Filters
        </button>
        <button 
          @click="clearFilters"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
        <p class="text-blue-600 text-xs font-semibold uppercase tracking-wide">Total Messages</p>
        <p class="text-3xl font-bold text-blue-900 mt-2">{{ stats.totalMessages }}</p>
      </div>
      <div class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
        <p class="text-green-600 text-xs font-semibold uppercase tracking-wide">Success Rate</p>
        <p class="text-3xl font-bold text-green-900 mt-2">{{ stats.successRate }}%</p>
      </div>
      <div class="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
        <p class="text-red-600 text-xs font-semibold uppercase tracking-wide">Total Errors</p>
        <p class="text-3xl font-bold text-red-900 mt-2">{{ stats.totalErrors }}</p>
      </div>
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
        <p class="text-purple-600 text-xs font-semibold uppercase tracking-wide">Avg. Response Time</p>
        <p class="text-3xl font-bold text-purple-900 mt-2">{{ stats.avgResponseTime }}ms</p>
      </div>
    </div>

    <!-- Logs Table -->
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Timestamp</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Type</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">User/Event</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Status</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Message</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr 
              v-for="(log, index) in paginatedLogs" 
              :key="index"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 text-sm text-gray-900">{{ formatDate(log.timestamp) }}</td>
              <td class="px-6 py-4 text-sm">
                <span :class="getLogTypeClass(log.type)" class="px-3 py-1 rounded-full text-xs font-semibold">
                  {{ log.type }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ log.user }}</td>
              <td class="px-6 py-4 text-sm">
                <span :class="getStatusClass(log.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                  {{ log.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                <span class="truncate block max-w-xs">{{ log.message }}</span>
              </td>
              <td class="px-6 py-4 text-sm">
                <button 
                  @click="viewLogDetails(log)"
                  class="text-orange-600 hover:text-orange-700 font-medium"
                >
                  View
                </button>
              </td>
            </tr>

            <tr v-if="paginatedLogs.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                No logs found. Try adjusting your filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
        <p class="text-sm text-gray-600">
          Showing <span class="font-semibold">{{ startIndex + 1 }}</span> to 
          <span class="font-semibold">{{ Math.min(startIndex + pageSize, logs.length) }}</span> of 
          <span class="font-semibold">{{ logs.length }}</span> logs
        </p>
        <div class="flex gap-2">
          <button 
            @click="previousPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Previous
          </button>
          <button 
            @click="nextPage"
            :disabled="currentPage >= totalPages"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Export Section -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-4">Export Logs</h3>
      <div class="flex gap-4">
        <button 
          @click="exportAsCSV"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Export as CSV
        </button>
        <button 
          @click="exportAsJSON"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          Export as JSON
        </button>
        <button 
          @click="clearLogs"
          class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Clear All Logs
        </button>
      </div>
    </div>

    <!-- Log Details Modal -->
    <div v-if="selectedLog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h3 class="text-lg font-bold text-gray-900">Log Details</h3>
          <button 
            @click="selectedLog = null"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <p class="text-xs font-semibold text-gray-700 uppercase">Timestamp</p>
            <p class="text-gray-900 mt-1">{{ formatDate(selectedLog.timestamp) }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-700 uppercase">Type</p>
            <p class="text-gray-900 mt-1">{{ selectedLog.type }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-700 uppercase">User</p>
            <p class="text-gray-900 mt-1">{{ selectedLog.user }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-700 uppercase">Status</p>
            <p class="text-gray-900 mt-1">{{ selectedLog.status }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-700 uppercase">Message</p>
            <p class="text-gray-900 mt-1 font-mono text-sm bg-gray-50 p-3 rounded">{{ selectedLog.message }}</p>
          </div>
          <div v-if="selectedLog.details">
            <p class="text-xs font-semibold text-gray-700 uppercase">Details</p>
            <pre class="text-gray-900 mt-1 font-mono text-xs bg-gray-50 p-3 rounded overflow-x-auto">{{ JSON.stringify(selectedLog.details, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { inject } from 'vue'

const useMetaAiBot = inject('useMetaAiBot')

const currentPage = ref(1)
const pageSize = 10
const selectedLog = ref(null)

const filters = reactive({
  logType: '',
  fromDate: '',
  toDate: '',
  search: ''
})

const stats = reactive({
  totalMessages: 1247,
  successRate: 98.5,
  totalErrors: 19,
  avgResponseTime: 245
})

// Sample logs data
const logs = ref([
  { timestamp: new Date('2024-01-24 10:30:00'), type: 'Message', user: 'User #12345', status: 'Success', message: 'Customer inquiry about product pricing' },
  { timestamp: new Date('2024-01-24 10:25:00'), type: 'API', user: 'OpenAI API', status: 'Success', message: 'GPT-4o response generated' },
  { timestamp: new Date('2024-01-24 10:20:00'), type: 'Webhook', user: 'Meta Webhook', status: 'Success', message: 'Message received from Facebook' },
  { timestamp: new Date('2024-01-24 10:15:00'), type: 'Message', user: 'User #12346', status: 'Success', message: 'Order tracking inquiry' },
  { timestamp: new Date('2024-01-24 10:10:00'), type: 'Error', user: 'System', status: 'Failed', message: 'Connection timeout to OpenAI API' },
  { timestamp: new Date('2024-01-24 10:05:00'), type: 'Message', user: 'User #12347', status: 'Success', message: 'Product recommendation request' },
  { timestamp: new Date('2024-01-24 10:00:00'), type: 'Webhook', user: 'Meta Webhook', status: 'Success', message: 'Webhook verification successful' },
  { timestamp: new Date('2024-01-24 09:55:00'), type: 'Message', user: 'User #12348', status: 'Success', message: 'General customer support question' },
])

const totalPages = computed(() => Math.ceil(logs.value.length / pageSize))
const startIndex = computed(() => (currentPage.value - 1) * pageSize)
const paginatedLogs = computed(() => logs.value.slice(startIndex.value, startIndex.value + pageSize))

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

const getLogTypeClass = (type) => {
  const classes = {
    'Message': 'bg-blue-100 text-blue-800',
    'Error': 'bg-red-100 text-red-800',
    'Webhook': 'bg-purple-100 text-purple-800',
    'API': 'bg-green-100 text-green-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status) => {
  return status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
}

const applyFilters = () => {
  currentPage.value = 1
  console.log('Applying filters:', filters)
}

const clearFilters = () => {
  filters.logType = ''
  filters.fromDate = ''
  filters.toDate = ''
  filters.search = ''
  currentPage.value = 1
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const viewLogDetails = (log) => {
  selectedLog.value = log
}

const exportAsCSV = () => {
  console.log('Exporting as CSV...')
  alert('Logs exported as CSV!')
}

const exportAsJSON = () => {
  console.log('Exporting as JSON...')
  alert('Logs exported as JSON!')
}

const clearLogs = () => {
  if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
    logs.value = []
    alert('All logs have been cleared!')
  }
}
</script>