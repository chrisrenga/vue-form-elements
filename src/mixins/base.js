import Form from 'form-backend-validation'

import Layout from '../components/Base/Layout'
import Loader from '../components/Base/Loader';

export default {
    props: {
        inputClass: {
            type: String,
            default: 'form-input',
        },

        errors: {
            type: Array,
            default: () => [],
        },

        name: {
            type: String,
            required: true,
        },

        value: {
            default: null,
        },

        form: {
            default: () => new Form(),
        },

        required: {
            type: Boolean,
            default: false,
        },

        label: {
            type: String,
            default: null,
        },

        autofocus: {
            type: Boolean,
            default: false,
        },

        showErrors: {
            type: Boolean,
            default: true,
        },

        placeholder: {
            type: String,
            default: null,
        },

        autocomplete: {
            type: String,
            default: null,
        },

        disabled: {
            type: Boolean,
            default: false,
        },
    },

    components: {
        Layout,
        Loader,
    },

    watch: {
        value(newVal) {
            this.form[this.name] = newVal;
        },
    },

    created() {
        if (this.value) {
            Vue.set(this.form, this.name, this.value);
        }

        if(this.errors.length) {
            this.form.errors.errors[this.name] = this.errors;
        }
    },

    mounted() {
        if (this.autofocus) {
            this.$nextTick(() => this.$refs.formElement.focus());
        }
    },

    methods: {
        changed(element = null) {
            this.clearError();

            this.$emit('changed', this.form ? this.form[this.name] : element.target.value);
        },

        clearError() {
            if(this.form && this.form.errors) {
                this.form.errors.clear(this.name)
            }
        },
    },
}