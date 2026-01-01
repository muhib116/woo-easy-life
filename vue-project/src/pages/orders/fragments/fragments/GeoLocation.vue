<template>
    <div class="flex items-center gap-2">
        <a
            v-if="order?.customer_latitude && order?.customer_longitude"
            :href="`https://www.google.com/maps/search/?api=1&query=${order.customer_latitude},${order.customer_longitude}&zoom=35`"
            target="_blank"
            class="text-green-600 mt-0.5 text-decoration-none ml-1"
            title="Visit Geo Location on Map"
        >
            <Icon
                name="PhMapTrifold"
                size="16"
            />
        </a>
    
        <button 
            v-if="order?.geo_info" 
            class="relative"
            @click="() => {
                toggle = !toggle;
            }"
            v-click-outside="() => toggle && (toggle = false)"
            title="View Geo Location Info"
        >
            <Icon 
                name="PhInfo"
                size="22"
            />
            <div v-if="toggle" class="absolute top-full -right-4 md:right-0 bg-white border shadow-md rounded mt-1 z-10 w-fit block min-w-[250px]">
                <div class="text-center font-semibold p-2 border-b border-opacity-50 pb-1">
                    Geo Location Info
                </div>
                
                <div class="grid gap-2 px-3 py-2 text-sm text-left text-gray-700">
                    <div v-if="order.geo_info.country"><b>Country:</b> {{ order.geo_info.country }}</div>
                    <div v-if="order.geo_info.region"><b>Region:</b> {{ order.geo_info.region }}</div>
                    <div v-if="order.geo_info.city"><b>City:</b> {{ order.geo_info.city }}</div>
                    <div v-if="order.geo_info.timezone"><b>Timezone:</b> {{ order.geo_info.timezone }}</div>
                    <div v-if="order.geo_info.isp"><b>ISP:</b> {{ order.geo_info.isp }}</div>
                    <div v-if="order.geo_info.lat && order.geo_info.lon">
                        <b>Coordinates:</b> {{ order.geo_info.lat }}, {{ order.geo_info.lon }}
                    </div>
                </div>
            </div>
        </button>
    </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/components'
import { ref } from 'vue'

const props = defineProps<{
  order: any;
}>();

const toggle = ref(false);
</script>