<template>
<layout
    :label="label"
    :errors="form.errors"
    :name="name"
    :show-errors="showErrors"
>
    <div class="relative w-full">
        <textarea
            ref="formElement"
            v-model="form[name]"
            @keyup="showErrors ? form.errors.clear(name) : null"
            :class="{ 'border-red-500': showErrors && form.errors.has(name) }"
            class="form-input"
            :required="required"
            :name="name"
            :placeholder="placeholder"
            :rows="rows"
            :maxlength="maxlength"
            :disabled="disabled"
        ></textarea>
    </div>
</layout>
</template>
<script>
import Base from '../mixins/base'

export default {
    props: {
        maxlength: {
            type: Number,
            default: 255,
        },
        rows: {
            type: Number,
            default: 5,
        },
    },

    mixins: [Base],
}
</script>
