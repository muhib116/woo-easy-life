import { getBlockListData, deleteBlockListData, exportBlockListData, importBlockListData } from "@/api"
import { onMounted, ref } from "vue"

export const useBlackList = () => {

    const isLoading = ref(false)

    const selectAll = ref(false)
    const alertMessage = ref({
        message: '',
        type: ''
    })
    const blackListData = ref([])

    const loadBlackListData = async () => {
        try {
            isLoading.value = true
            const { data } = await getBlockListData()
            blackListData.value = data
        } finally {
            isLoading.value = false
        }
    }

    const removeFromBlacklist = async (id: string | number, btn) => {
        if (!confirm("Are you sure to remove?")) return
        try {
            isLoading.value = true
            btn.isLoading = true
            const { data } = await deleteBlockListData(id)
            blackListData.value = data
            await loadBlackListData()
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
            await Promise.all(selectedIds.map(async id => {
                await deleteBlockListData(id)
            }))
            await loadBlackListData()
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
        return blackListData.value.some(item => item.isSelected)
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
                    await loadBlackListData()
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
        loadBlackListData()
    })

    return {
        isLoading,
        blackListData,
        alertMessage,
        selectAll,
        removeFromBlacklist,
        handleBulkDelete,
        toggleSelectAll,
        hasSelectedItems,
        handleExport,
        handleImport
    }
}