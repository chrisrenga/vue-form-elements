<template>
<layout
    :label="label"
    :errors="form.errors"
    :name="name"
    :show-errors="showErrors"
>
    <input type="hidden" :name="fromName" v-model="form[fromName]">
    <input type="hidden" :name="toName" v-model="form[toName]">

    <div class="relative w-full">
        <input
            :key="keyValue"
            ref="formElement"
            v-model="form[name]"
            @input="showErrors ? form.errors.clear(name) : null"
            :class="{ 'border-red-500': showErrors && form.errors.has(name) }"
            class="form-input"
            type="text"
            :required="required"
            :name="name"
            :disabled="disabled"
            :placeholder="placeholder"
        >
    </div>
</layout>
</template>
<script>
import Base from '../mixins/base'

export default {
    props: {
        dateFormat: {
            type: String,
            default: 'Y-m-d',
        },

        seperator: {
            type: String,
            default: '-',
        },

        name: {
            type: String,
            default: 'date_range',
            required: false,
        },

        fromName: {
            type: String,
            default: 'from',
        },

        toName: {
            type: String,
            default: 'to',
        },
    },

    mixins: [Base],

    data: () => ({
        flatpickr: null,
        keyValue: 1,
    }),

    watch: {
        value(newVal) {
            Vue.set(this.form, this.name, newVal);
            this.flatpickr.setDate(newVal)
            this.fillFields()
        },
    },

    created() {
        if (!this.form[this.fromName] || !this.form[this.toName]) {
            this.fillFields()
        }
    },

    mounted() {
        this.$nextTick(() => {

            this.flatpickr = flatpickr(this.$refs.formElement, {
                onClose: this.onChange,
                dateFormat: this.dateFormat,
                allowInput: true,
                mode: 'range',
                locale: {
                    ...flatpickr.locale,
                    rangeSeparator: ` ${this.seperator} `
                },
            })
        })
    },

    methods: {
        fillFields() {
            if (!this.form[this.name]) {
                return;
            }

            var dates = this.form[this.name].split(' ' + this.seperator + ' ');
            this.form[this.fromName] = dates[0];
            this.form[this.toName] = dates[1];
        },

        onChange(event) {
            this.form[this.name] = this.$refs.formElement.value;

            this.fillFields()

            this.$emit('changed', {
                value: this.form[this.name],
                from: this.form[this.fromName],
                to: this.form[this.toName],
            });
        },
    },
}
</script>
