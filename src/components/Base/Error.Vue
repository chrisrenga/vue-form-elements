<template>
<div
    v-if="errors && show && errors.has(name)"
    class="text-red-500 mb-2"
>
    <div v-for="(error, index) in errors.get(name)" :key="index">{{ error }}</div>
</div>
</template>

<script>
export default {
    props: {
        errors: {
            default: null,
        },

        name: {
            type: String,
            default: '',
        },

        show: {
            type: Boolean,
            default: true,
        },
    },
}
</script>