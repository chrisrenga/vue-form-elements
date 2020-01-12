<template>
<layout
    :label="label"
    :errors="form.errors"
    :name="name"
    :show-errors="showErrors"
>
    <div class="relative w-full">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">€</div>
        <input
            ref="formElement"
            @keyup="form.errors.clear(name)"
            @input="form[name] = $event.target.value * 100"
            :value="form[name] ? form[name]/100 : null"
            :class="{ 'border-red-500': showErrors && form.errors.has(name) }"
            class="form-input pl-8"
            :type="type"
            :required="required"
            :pattern="type === 'number' ? '[0-9]*' : null"
            :name="name"
            :placeholder="placeholder"
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
