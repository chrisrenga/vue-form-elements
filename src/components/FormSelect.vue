<template>
<div class="md:w-1/2">
    <label v-if="label" class="block mb-1 text-gray-700">{{ label }}</label>
    <div class="relative w-full">
        <select
            @change="selected"
            v-model="value"
            :class="{ 'border-red': showErrors && form.errors.has(model) }"
            class="form-select"
            type="text"
            :required="required"
            :name="name"
        >
            <option value=""></option>
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
    <div
        v-if="showErrors && form.errors.has(model)"
        v-text="form.errors.first(model)"
        class="text-red-500"
    />
</div>
</template>
<script>
import { events } from '../events'

export default {
    props: {
        showErrors: {
            default: true,
        },
        type: {
            default: 'text'
        },
        model: null,
        label: null,
        required: false,
        form: null,
        options: {},
        optionValue: {
            default: 'value'
        },
        optionName: {
            default: 'name'
        },
        inputValue: null,

        name: {
            type: String,
            default: null,
        },
    },

    data() {
        return {
            value: this.form ? this.form[this.model] : this.inputValue,
        }
    },

    computed: {
        formValue() {
            return this.form ? this.form[this.model] : null;
        },
    },

    watch: {
        formValue(newVal) {
            this.value = newVal;
        },
    },

    methods: {
        selected(e) {
            this.form ? this.form[this.model] = this.value : null,
            this.$emit('selected', this.value);
        },

        getValue(option) {
            return this.optionValue == '*' ? option : _.get(option, this.optionValue);
        },

        getName(option) {
            return _.get(option, this.optionName);
        },
    }
}
</script>