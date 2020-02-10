<template>
<div>
    <button
        :disabled="processing"
        :class="[{'loader ': processing}, classes]"
        type="submit"
        v-html="label"
    />
</div>
</template>

<script>
export default {
    props: {
        processing: {
            type: Boolean,
            default: false,
        },

        classes: {
            type: String,
            default: 'btn btn-success',
        },

        label: {
            type: String,
            default: 'Save',
        },
    },
}
</script>