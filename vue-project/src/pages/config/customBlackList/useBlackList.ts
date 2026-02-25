import { getBlockListData, deleteBlockListData, exportBlockListData, importBlockListData } from "@/api"
import { onMounted, ref } from "vue"

export const useBlackList = () => {

    const isLoading = ref(false)

    const selectAll = ref(false)
    const alertMessage = ref({
        message: '',
        type: ''
    })
    const blackListData = ref<any[]>([])

    // Pagination state
    const currentPage = ref(1)
    const perPage = ref(20)
    const totalEntries = ref(0)
    const totalPages = ref(0)

    const loadBlackListData = async (page: number = 1, itemsPerPage: number = 20) => {
        try {
            isLoading.value = true
            const response = await getBlockListData({
                page,
                per_page: itemsPerPage
            })
            blackListData.value = response.data || []

            // Update pagination info
            if (response.pagination) {
                currentPage.value = response.pagination.current_page
                perPage.value = response.pagination.per_page
                totalEntries.value = response.pagination.total
                totalPages.value = response.pagination.total_pages
            }
        } finally {
            isLoading.value = false
        }
    }

    const removeFromBlacklist = async (id: string | number, btn: any) => {
        if (!confirm("Are you sure to remove?")) return
        try {
            isLoading.value = true
            btn.isLoading = true
            await deleteBlockListData(id)
            await loadBlackListData(currentPage.value, perPage.value)
        } finally {
            isLoading.value = false
            btn.isLoading = false
        }
    }

    const toggleSelectAll = () => {
        blackListData.value.forEach(item => {
            item.isSelected = selectAll.value
        })
    }

    const handleBulkDelete = async () => {
        const selectedIds = blackListData.value
            .filter(item => item.isSelected)
            .map(item => item.id)

        if (selectedIds.length === 0) {
            alertMessage.value = {
                message: 'No items selected for deletion.',
                type: 'error'
            }
            return
        }

        if (!confirm(`Are you sure you want to remove ${selectedIds.length} selected items?`)) {
            return
        }

        try {
            isLoading.value = true
            await Promise.all(selectedIds.map(async (id: any) => {
                await deleteBlockListData(id)
            }))
            await loadBlackListData(currentPage.value, perPage.value)
            alertMessage.value = {
                message: 'Selected items removed successfully.',
                type: 'success'
            }
        } catch (error) {
            alertMessage.value = {
                message: 'An error occurred while removing items.',
                type: 'error'
            }
        } finally {
            isLoading.value = false
        }
    }

    const hasSelectedItems = () => {
        return blackListData.value.some((item: any) => item.isSelected)
    }

    const goToPage = async (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            await loadBlackListData(page, perPage.value)
        }
    }

    const nextPage = async () => {
        if (currentPage.value < totalPages.value) {
            await goToPage(currentPage.value + 1)
        }
    }

    const prevPage = async () => {
        if (currentPage.value > 1) {
            await goToPage(currentPage.value - 1)
        }
    }

    const changePerPage = async (newPerPage: number) => {
        if (newPerPage >= 1 && newPerPage <= 100) {
            await loadBlackListData(1, newPerPage)
        }
    }

    const handleExport = async () => {
        try {
            isLoading.value = true
            const response = await exportBlockListData()

            if (response.status !== 'success') {
                alertMessage.value = {
                    message: response.message || 'Error exporting blacklist.',
                    type: 'error'
                }
                return
            }

            // Create blob and download
            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            const url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', response.filename || `blacklist_export_${new Date().getTime()}.csv`)
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)

            alertMessage.value = {
                message: 'Blacklist exported successfully as CSV.',
                type: 'success'
            }
        } catch (error: any) {
            alertMessage.value = {
                message: error?.response?.data?.message || 'Error exporting blacklist.',
                type: 'error'
            }
        } finally {
            isLoading.value = false
        }
    }

    const handleImport = () => {
        try {
            // Create hidden file input
            const fileInput = document.createElement('input')
            fileInput.type = 'file'
            fileInput.accept = '.csv'
            fileInput.style.display = 'none'

            fileInput.onchange = async (e: any) => {
                const file = e.target.files[0]
                if (!file) return

                try {
                    isLoading.value = true
                    const csvContent = await file.text()

                    // Call the API to import the data
                    const response = await importBlockListData(csvContent)

                    if (response.status !== 'success') {
                        alertMessage.value = {
                            message: response.message || 'Error importing blacklist.',
                            type: 'error'
                        }
                        return
                    }

                    // Show success message with details
                    const { imported_count, skipped_count } = response.data || {}
                    alertMessage.value = {
                        message: `${response.message}`,
                        type: 'success'
                    }

                    // Reload blacklist data
                    await loadBlackListData(currentPage.value, perPage.value)
                } catch (parseError: any) {
                    alertMessage.value = {
                        message: parseError?.response?.data?.message || 'Error importing blacklist.',
                        type: 'error'
                    }
                } finally {
                    isLoading.value = false
                }
            }

            document.body.appendChild(fileInput)
            fileInput.click()
            document.body.removeChild(fileInput)
        } catch (error) {
            alertMessage.value = {
                message: 'Error opening file picker.',
                type: 'error'
            }
        }
    }

    onMounted(() => {
        loadBlackListData(1, 20)
    })

    return {
        isLoading,
        blackListData,
        alertMessage,
        selectAll,
        currentPage,
        perPage,
        totalEntries,
        totalPages,
        removeFromBlacklist,
        handleBulkDelete,
        toggleSelectAll,
        hasSelectedItems,
        handleExport,
        handleImport,
        goToPage,
        nextPage,
        prevPage,
        changePerPage,
        loadBlackListData
    }
}
