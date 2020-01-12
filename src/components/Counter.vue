<template>
<layout
    :label="label"
    :errors="form.errors"
    :name="name"
    :show-errors="showErrors"
>
    <div class="flex">
        <button
            @click.prevent="remove"
            :class="{'cursor-not-allowed': form[name] <= 1}"
            class="counter-btn"
            type="button"
            :disabled="form[name] <= 1"
        >
            -
        </button>
        <input
            @change="changed"
            @input="changed"
            v-model="form[name]"
            type="number"
            min="1"
            class="text-center appearance-none px-0 text-xl mx-1 w-10 bg-transparent"
            :class="{ 'text-red-500': showErrors && form.errors.has(name) }"
            step="1"
            pattern="[0-9]*"
            :name="name"
        />
        <button
            @click.prevent="add"
            class="counter-btn"
            type="button"
        >
            +
        </button>
    </div>
</layout>
</template>

<script>
import Base from '../mixins/base'

export default {
    props: {
        value: {
            type: Number,
            default: 1,
        },
    },

    mixins: [Base],

    methods: {
        add() {
            this.form[this.name]++;
            this.changed();
        },

        remove() {
            if(this.form[this.name] <= 1) {
                return;
            }
            this.form[this.name]--;
            this.changed();
        },
    },
}
</script>
