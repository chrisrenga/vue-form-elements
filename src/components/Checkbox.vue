<template>
<layout
    :label="label"
    :errors="form.errors"
    :name="name"
    :show-errors="showErrors"
>
    <div class="relative w-full inline-flex items-center">
        <input
            ref="formElement"
            v-model="form[name]"
            @change="changed"
            :class="{ 'border-red-500': showErrors && form.errors.has(name) }"
            class=""
            type="checkbox"
            :required="required"
            :name="name"
            :disabled="disabled"
        >
        <span v-if="description" class="ml-2" v-html="description"></span>
    </div>
</layout>
</template>
<script>
import Base from '../mixins/base'

export default {
    props: {
        description: {
            type: String,
            default: null,
        },
    },

    mixins: [Base],
}
</script>
