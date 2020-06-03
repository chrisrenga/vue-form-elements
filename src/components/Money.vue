<template>
<layout
    :label="label"
    :errors="form.errors"
    :name="name"
    :show-errors="showErrors"
>
    <input :key="key" type="hidden" :name="name" :value="form[name]">
    <div class="relative w-full">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">€</div>
        <input
            ref="formElement"
            @input="toInteger"
            :value="cents ? Number(form[name]/100) : Number(form[name])"
            :class="[{ 'border-red-500': showErrors && form.errors.has(name) }, inputClass]"
            class="pl-8"
            :type="type"
            :required="required"
            :placeholder="placeholder"
            :disabled="disabled"
        >
    </div>
</layout>
</template>
<script>
import Base from '../mixins/base'
import { events } from '../events'

export default {
    props: {
        type: {
            type: String,
            default: 'text'
        },

        cents: {
            type: Boolean,
            default: true,
        },
    },

    mixins: [Base],

    data: () => ({
        key: 1,
    }),

    watch: {
        value(newVal) {
            this.form[this.name] = Number(newVal);
        },
    },

    computed: {
        elementValue() {
            return Number(this.cents ? this.handleComma(this.form[this.name]) / 100 : this.handleComma(this.form[this.name])).toFixed(2);
        },
    },

    created() {
        if (this.value) {
            Vue.set(this.form, this.name, this.handleComma(this.value));
        }

        if(this.errors.length) {
            this.form.errors.errors[this.name] = this.errors;
        }
    },

    methods: {
        toInteger(event) {
            let number = this.handleComma(event.target.value);

            Vue.set(this.form,
                this.name,
                Number(this.cents ? (number * 100).toFixed() : number)
            );

            // this.key = this.key+1;
        },

        handleComma(number) {
            number = String(number).split(',').join('.');

            if(isNaN(Number(number))) {
                number = 0
            }

            return Number(number);
        },
    }
}
</script>
