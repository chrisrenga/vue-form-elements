<template>
<div>
    <label v-if="label" class="block mb-1 text-gray-700">{{ label }}</label>
    <div class="flex">
        <button
            @click.prevent="remove"
            :class="{'cursor-not-allowed': form.quantity <= 1}"
            class="flex items-center justify-center border rounded-full w-8 h-8 shadow bg-gray-400 hover:bg-gray-600"
            type="button"
        >
            -
        </button>
        <input
            @change="changed"
            @input="changed"
            v-model="form.quantity"
            type="number"
            min="1"
            class="text-center appearance-none px-0 text-xl mx-1 w-10 bg-transparent"
            step="1"
            pattern="[0-9]*"
        />
        <button
            @click.prevent="add"
            class="flex items-center justify-center border rounded-full w-8 h-8 shadow bg-gray-400 hover:bg-gray-600"
            type="button"
        >
            +
        </button>
    </div>
</div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: null,
        },

        quantity: {
            type: Number,
            default: 1,
        },
    },

    data() {
        return {
            form: {
                quantity: this.quantity,
            },
        }
    },

    watch: {
        quantity(newVal) {
            this.form.quantity = newVal;
            this.changed();
        },
    },

    methods: {
        add() {
            this.form.quantity++;
            this.changed();
        },

        remove() {
            if(this.form.quantity <= 1) {
                return;
            }
            this.form.quantity--;
            this.changed();
        },

        changed() {
            this.$emit('changed', this.form.quantity);
        }
    },
}
</script>
