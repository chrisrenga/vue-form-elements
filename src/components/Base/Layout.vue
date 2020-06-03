<template>
<div class="md:w-1/2 mb-2 md:mb-0">
    <label class="inline-block relative">
        <span v-if="label" class="block mb-1">{{ label }}</span>

        <slot/>

    </label>

    <error
        :errors="errors"
        :name="name"
        :show="showErrors"
    />
</div>
</template>

<script>
import Error from './Error'

export default {
    props: {
        label: {
            type: String,
            default: null,
        },

        errors: {
            type: Object,
            default: null,
        },

        showErrors: {
            type: Boolean,
            default: true,
        },

        name: {
            type: String,
            default: '',
        },
    },

    components: {
        Error,
    },
}
</script>