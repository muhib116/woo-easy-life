<template>
    <div class="flex flex-wrap gap-x-2">
        <span
            v-if="order?.ip_block_listed"
            class="!py-0 !text-[10px] flex items-center text-[#f93926]"
        >
            <Icon
                name="PhCellTower"
                size="12"
            />
        </span>
        <span
            v-if="order?.phone_block_listed"
            class="!py-0 !text-[10px] flex items-center text-[#e82661]"
        >
            <Icon
                name="PhSimCard"
                size="12"
            />
        </span>
        <span
            v-if="order?.email_block_listed"
            class="!py-0 !text-[10px] flex items-center text-[#444444]"
        >
            <Icon
                name="PhSimCard"
                size="12"
            />
        </span>
        <span
            v-if="order?.device_block_listed"
            class="!text-[10px] flex gap-1 items-center text-[#e82661] border px-1 py-1 rounded shadow"
        >
            <Icon
                name="PhDeviceMobileSlash"
                size="12"
            />
            <Button.Native
                class="flex items-center text-blue-500 hover:text-blue-700"
                title="Copy device token"
                @click="copyToClipboard(order?.customer_device_token, 'Device token')"
            >
                <Icon
                    name="PhCopy"
                    size="12"
                />
            </Button.Native>
        </span>
    </div>
</template>

<script setup lang="ts">
    import { Icon, Button } from '@/components'
    import { useOrders } from '@/pages/orders/useOrders'
    
    type OrderBlacklistData = {
        ip_block_listed?: boolean
        phone_block_listed?: boolean
        email_block_listed?: boolean
        device_block_listed?: boolean
    }
    
    defineProps<{
        order: OrderBlacklistData
    }>()
    
    const { copyToClipboard } = useOrders()
</script>