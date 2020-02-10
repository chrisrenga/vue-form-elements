<template>
<form @submit="process" :method="!ajax ? 'post' : null" :action="!ajax ? url : null">

    <input v-if="!ajax" type="hidden" name="_token" :value="csrfToken">
    <input v-if="!ajax && method != 'post'" type="hidden" name="_method" :value="method">
    <input v-if="!ajax && id" type="hidden" :name="idName" :value="id">

    <slot/>

    <div
        v-for="(row, index) in fields"
        :key="index"
        :class="row.class"
        class="md:flex justify-between items-center mb-4"
    >
        <component
            v-for="(field, index) in row.fields"
            :key="index"
            :is="field.component"
            :form="form"
            :name="field.name"
            :type="field.type"
            :label="field.label"
            :options="field.options"
            :class="field.class"
            :show-errors="field.showErrors"
            :option-name="field.optionName"
            :option-value="field.optionValue"
            :value="field.value"
            :url="field.url"
            :placeholder="field.placeholder"
            :result-name="field.resultName"
            :result-value="field.resultValue"
            :maxlenght="field.maxlenght"
            :rows="field.rows"
            :errors="field.errors"
            :search="field.search"
            :disabled="field.disabled"
            :cents="field.cents"
            :description="field.description"
            :from-name="field.fromName"
            :to-name="field.toName"
            :params="field.params"
            @changed="emit(field.name + 'Changed', $event)"
            @created="emit(field.name + 'Created', $event)"
        />
    </div>
    <v-form-submit
        :processing="form.processing"
        :label="submitText"
        :classes="submitClass"
    />
</form>
</template>

<script>
import Form from 'form-backend-validation'

export default {
    props: {
        id: {
            default: null,
        },

        idName: {
            type: String,
            default: 'id',
        },

        action: {
            type: String,
            required: true,
        },

        method: {
            type: String,
            default: 'post',
        },

        fields: {
            type: Array,
            default: () => [],
        },

        submitText: {
            type: String,
            default: 'Save',
        },

        submitClass: {
            type: String,
            default: 'btn btn-success',
        },

        ajax: {
            type: Boolean,
            default: true,
        },

        reset: {
            type: Boolean,
            default: true,
        },
    },

    data: () => ({
        form: new Form({}),
    }),

    computed: {
        csrfToken() {
            return document.head.querySelector('meta[name="csrf-token"]').content;
        },

        url() {
            return this.id ? this.action + '/' + this.id : this.action;
        },
    },

    created() {
        var formValues = {};

        this.fields.flatMap(row => row.fields).forEach(field => {
            if (field.fromName && field.toName) {
                formValues[field.fromName] = null;
                formValues[field.toName] = null;
            }
            formValues[field.name] = field.value ? field.value : null;
        });

        this.form = new Form(formValues, { resetOnSuccess: this.reset });
    },

    methods: {
        process(event) {
            if (!this.ajax) {
                return;
            }

            event.preventDefault();

            this.form[this.method](this.url)
                .then(response => this.$emit('processed', response))
                .catch(errors => this.$emit('errors', errors))
        },

        emit(name, data) {
            this.$emit(name, data);
        },
    },
}
</script>

<style>
.loader {
    color: transparent !important;
    pointer-events: none;
    position: relative;
}

.loader:after {
    animation: spinAround 500ms infinite linear;
    border: 2px solid #dbdbdb;
    border-radius: 290486px;
    border-right-color: transparent;
    border-top-color: transparent;
    content: "";
    display: block;
    width: 1em;
    height: 1em;
    position: relative;
    position: absolute;
    left: calc(50% - (1em / 2));
    top: calc(50% - (1em / 2));
    position: absolute !important;
}

@keyframes spinAround {
    from {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    to {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
</style>