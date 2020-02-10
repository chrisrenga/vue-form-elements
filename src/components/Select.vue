<template>
<layout
    :label="label"
    :errors="form.errors"
    :name="name"
    :show-errors="showErrors"
>
    <div class="relative w-full">
        <select
            @change="changed"
            v-model="form[name]"
            :class="{ 'border-red-500': showErrors && form.errors.has(name) }"
            class="form-select"
            :required="required"
            :name="name"
            :disabled="disabled"
        >
            <option value="" v-text="placeholder"></option>
            <option
                v-for="(option, index) in options"
                :key="index"
                :value="getValue(option)"
                v-text="getName(option)"
            ></option>
        </select>
        <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
        >
            <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
            ><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
        </div>
    </div>
</layout>
</template>

<script>
import Base from '../mixins/base'

const get = require('lodash/get')

export default {
    props: {
        options: {
            type: Array,
            required: true,
        },

        optionValue: {
            type: String,
            default: 'value'
        },

        optionName: {
            type: String,
            default: 'name'
        },
    },

    mixins: [Base],

    methods: {
        getValue(option) {
            return this.optionValue == '*' ? option : get(option, this.optionValue);
        },

        getName(option) {
            return get(option, this.optionName);
        },
    }
}
</script>