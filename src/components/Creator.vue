<template>
<form @submit="process" :method="!ajax ? method : null" :action="!ajax ? action : null">

    <input v-if="!ajax" type="hidden" name="_token" :value="csrfToken">

    <slot/>

    <component
        v-for="(field, index) in fields"
        :key="index"
        :is="`${field.component}`"
        :form="form"
        :name="field.name"
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
    />

    <button
        :disabled="form.processing"
        :class="{'loader': form.processing}"
        type="submit"
        class="btn btn-success"
        v-text="sumbitText"
    />

    <div>
        <br><br>
        {{ form }}
    </div>
</form>
</template>

<script>
import Form from 'form-backend-validation'

export default {
    props: {
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

        sumbitText: {
            type: String,
            default: 'Save',
        },

        ajax: {
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
    },

    created() {
        var formValues = {};

        this.fields.forEach(field => {
            formValues[field.name] = field.value ? field.value : null;
        });

        this.form = new Form(formValues);
    },

    methods: {
        process(event) {
            if (!this.ajax) {
                return;
            }

            event.preventDefault();

            this.form[this.method](this.action)
                .then(response => this.$emit('processed', response))
                .catch(errors => this.$emit('errors', errors))
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