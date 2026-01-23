<template>
    <Native
        v-model="localValue"
        wrapperClass="block"
        labelClass="mb-1"
        inputClass="placeholder:text-inherit placeholder:opacity-60 border border-secondary-five rounded-sm pl-3 pr-7 py-2 block w-full disabled:bg-gray-100 disabled:opacity-60 flex items-center justify-between"
        :label="label"
    />
</template>

<script setup>
    import Native from '../Native.vue'
    defineOptions({
        name: 'PrimaryInput'
    })
    const props = defineProps({
        iconSource: String,
        iconName: String,
        label: String,
        hideMicrophone: Boolean
    })
    const localValue  = defineModel();
</script>