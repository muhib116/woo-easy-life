<template>
    <Card.Native class="relative min-h-[200px] px-0 md:px-6 shadow-none md:shadow-md">
        <Loader
            :active="isLoading"
            class="absolute inset-x-1/2 top-[15px] -translate-x-1/2 z-20"
        />
        <MessageBox
            :title="alertMessage.message"
            :type="alertMessage.type"
        />
        <div class="mb-2 flex items-center justify-between">
            <h3 class="font-semibold text-gray-900 text-xl">
                Blacklisted Data
            </h3>

            <div class="flex flex-col md:flex-row md:items-center gap-4">
                <div class="mr-4 flex items-center gap-3">
                    <input
                        v-model="searchQuery"
                        @input="handleSearch(searchQuery)"
                        type="text"
                        placeholder="Search content..."
                        class="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span class="text-sm text-gray-600">
                        Total: {{ totalEntries }}
                    </span>
                </div>
                <div class="flex gap-2 items-center">
                    <Button.Native
                        v-if="blackListData?.length"
                        @onClick="handleExport"
                        class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        <Icon name="PhDownload" size="16" class="mr-1" />
                        Export
                    </Button.Native>
                    <Button.Native
                        @onClick="handleImport"
                        class="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                        <Icon name="PhUpload" size="16" class="mr-1" />
                        Import
                    </Button.Native>
                    <Button.Native
                        v-if="hasSelectedItems()"
                        @onClick="handleBulkDelete"
                        class="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                        <Icon name="PhX" size="16" class="mr-1" />
                        Remove Selected Items
                    </Button.Native>
                </div>
            </div>
        </div>


        <Table.Table
            class="whitespace-nowrap"
            v-if="blackListData?.length"
        >
            <Table.THead>
                <Table.Th class="w-8">
                    <label class="flex gap-2">
                        <input
                            type="checkbox"
                            v-model="selectAll"
                            @change="toggleSelectAll"
                            title="Click here to select all items"
                        />
                    </label>
                </Table.Th>
                <Table.Th>#sl</Table.Th>
                <Table.Th>Content</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Blocked At</Table.Th>
                <Table.Th class="text-right">Action</Table.Th>
            </Table.THead>
            <Table.TBody>
                <TableTrow
                    v-for="(item, index) in blackListData"
                    :key="index"
                    :index="index"
                    :item="item"
                />
            </Table.TBody>
        </Table.Table>
        <MessageBox
            title="No entries found in the blacklist."
            type="info"
            v-else-if="!isLoading"
        />

        <!-- Pagination Section -->
        <div v-if="blackListData?.length" class="mt-6 flex items-center justify-between px-4 py-4 border-t border-gray-200">
            <!-- Left: Items Per Page -->
            <div class="flex items-center gap-2">
                <label for="perPage" class="text-sm font-medium text-gray-700">Items per page:</label>
                <input
                    id="perPage"
                    type="number"
                    :value="perPage"
                    @change="changePerPage(Number($event.target.value))"
                    min="1"
                    max="100"
                    class="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                />
            </div>

            <!-- Center: Page Info -->
            <div class="text-sm text-gray-600">
                Page {{ currentPage }} of {{ totalPages }} ({{ totalEntries }} total)
            </div>

            <!-- Right: Pagination Buttons -->
            <div class="flex items-center gap-2">
                <Button.Native
                    :disabled="currentPage <= 1 || isLoading"
                    @onClick="prevPage"
                    class="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                    ← Previous
                </Button.Native>
                <Button.Native
                    :disabled="currentPage >= totalPages || isLoading"
                    @onClick="nextPage"
                    class="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                    Next →
                </Button.Native>
            </div>
        </div>
    </Card.Native>
</template>


<script setup>
    import { Table, MessageBox, Loader, Card, Button, Icon } from '@/components'
    import { useBlackList } from './useBlackList'
    import { provide } from 'vue'
    import TableTrow from './fragment/TableRow.vue'

    const _useBlackList = useBlackList()
    const {
        isLoading,
        selectAll,
        blackListData,
        alertMessage,
        currentPage,
        perPage,
        totalEntries,
        totalPages,
        searchQuery,
        handleBulkDelete,
        toggleSelectAll,
        hasSelectedItems,
        handleExport,
        handleImport,
        nextPage,
        prevPage,
        changePerPage,
        handleSearch
    } = _useBlackList

    provide('useBlackList', _useBlackList)
</script>