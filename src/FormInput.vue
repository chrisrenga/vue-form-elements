<template>
    <div class="md:w-1/2">
        <label v-if="label" class="block mb-1 text-gray-700">{{ label }}</label>
        <div class="relative w-full">
            <input
                ref="formInput"
                v-model="form[model]"
                class="form-input"
                :type="type"
                :required="required"
                :pattern="type === 'number' ? '[0-9]*' : null"
            >
        </div>
    </div>
</template>
<script>
import { events } from './events'

export default {
    name: 'FormInput',

    props: {
        type: {
            type: String,
            default: 'text'
        },
        model: '',

        label: {
            type: String,
            default: null,
        },

        required: false,
        form: {},
        autofocus: {
            type: Boolean,
            default: false,
        },
    },

    mounted() {
        events.$on(this.model + '-value', value => {
            this.form[this.model] = value
        });

        if (this.autofocus) {
            this.$nextTick(() => this.$refs.formInput.focus());
        }
    },
}
</script>
