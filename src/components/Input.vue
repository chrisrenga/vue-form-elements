<template>
<layout
    :label="label"
    :errors="form.errors"
    :name="name"
    :show-errors="showErrors"
>
    <div class="relative w-full">
        <input
            ref="formElement"
            v-model="form[name]"
            @keyup="showErrors ? form.errors.clear(name) : null"
            :class="{ 'border-red-500': showErrors && form.errors.has(name) }"
            class="form-input"
            :type="type"
            :required="required"
            :pattern="type === 'number' ? '[0-9]*' : null"
            :name="name"
            :placeholder="placeholder"
            :disabled="disabled"
            :autocomplete="autocomplete"
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
    },

    mixins: [Base],
}
</script>
