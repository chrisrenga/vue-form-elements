<template>
<layout
    :label="label"
    :errors="form.errors"
    :name="name"
    :show-errors="showErrors"
    inline
>
    <div class="flex">
        <button
            @click.prevent="remove"
            :class="{'cursor-not-allowed': form[name] <= min}"
            class="counter-btn"
            type="button"
            :disabled="form[name] <= min"
        >
            -
        </button>
        <input
            @change="changed"
            @input="changed"
            v-model.number="form[name]"
            type="number"
            :min="min"
            class="counter-input"
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
            default: null,
        },

        min: {
            type: Number,
            default: 1,
        },
    },

    mixins: [Base],

    mounted() {
        if (!this.value && !this.form[this.name]) {
            Vue.set(this.form, this.name, this.min);
        }
    },

    methods: {
        add() {
            this.form[this.name]++;
            this.changed();
        },

        remove() {
            if(this.form[this.name] <= this.min) {
                return;
            }
            this.form[this.name]--;
            this.changed();
        },
    },
}
</script>
