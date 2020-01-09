<template>
<div v-on-clickaway="close" class="relative">
    <label v-if="label" class="block mb-1 text-gray-700">{{ label }}</label>
    <div class="relative flex items-center">
        <div class="absolute inset-y-0 left-0 pl-2 pointer-events-none flex items-center text-gray-600">
            <svg class="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path></svg>
        </div>

        <input
            ref="searchInput"
            @click="open"
            @focus="open"
            @input="handleInput"
            @keydown.enter.prevent="chooseSelected"
            @keydown.down.prevent="move(1)"
            @keydown.up.prevent="move(-1)"
            v-model="query"
            type="text"
            class="form-input px-8"
            :placeholder="placeholder"
            spellcheck="false"
            :autofocus="autofocus"
        />

        <button
            v-if="query"
            @click.stop="clear"
            type="button"
            tabindex="-1"
            class="absolute p-2 inline-block top-0 right-0"
        >
            &cross;
        </button>
    </div>

    <div
        v-if="show"
        ref="container"
        class="absolute overflow-y-scroll scrolling-touch text-sm bg-white shadow -mt-1 rounded z-50 w-full"
        tabindex="-1"
        style="max-height: 155px;"
    >
        <div
            v-for="(result, index) in results"
            :key="index"
            :ref="index === selected ? 'selected' : null"
            class="px-4 py-2 cursor-pointer hover:bg-gray-400 text-left"
            @click.prevent="choose(result)"
            :class="{
                [`search-input-item-${index}`]: true,
                'hover:bg-30': index !== selected,
                'bg-blue-400 text-white': index === selected
            }"
            :selected="index === selected"
        >
            {{ getResultValue(result) }}
        </div>
    </div>
</div>
</template>
<script>
import { mixin as clickaway } from 'vue-clickaway'

export default {
    props: {
        label: {
            type: String,
            default: null,
        },

        url: {
            type: String,
            default: null,
        },

        value: {
            default: null,
        },

        resultValue: {
            type: String,
            default: 'descrizione',
        },

        placeholder: {
            type: String,
            default: 'Cerca...',
        },

        autofocus: {
            type: Boolean,
            default: false,
        },
    },

    mixins: [clickaway],

    data() {
        return {
            show: false,
            query: this.value,
            results: [],
            selected: 0,
        }
    },

    watch: {
        query(search) {
            this.selected = 0

            Vue.nextTick(() => {
                if (this.show) {
                    this.$refs.container.scrollTop = 0
                }
            });
        },

        value(newVal) {
            this.query = newVal;
        },
    },

    mounted() {

        if (this.autofocus) {
             this.$nextTick(() => this.$refs.searchInput.focus());
        }

        document.addEventListener('keydown', e => {
            if (this.show && (e.keyCode == 9 || e.keyCode == 27)) {
                setTimeout(() => this.close(), 50)
            }
        })
    },

    methods: {

        handleInput() {
            if (this.query.length < 1 || this.query == ' ') {
                return;
            }

            this.debouncer(() => {
                this.doSearch();
            }, 500);
        },

        doSearch() {
            if (!this.url) {
                return this.$emit('search', this.query);
            }

            if (!this.query) {
                return this.results = null;
            }

            this.open();

            axios.get(`${this.url}/${this.query}`)
                .then(({data}) => this.results = data);
        },

        /**
         * Debounce function for the input handler
         */
        debouncer: _.debounce(callback => callback(), 500),

        move(offset) {
            if (this.show) {
                let newIndex = this.selected + offset

                if (newIndex >= 0 && newIndex < this.results.length) {
                    this.selected = newIndex
                    this.updateScrollPosition()
                }
            }
        },

       updateScrollPosition() {
            Vue.nextTick(() => {
                if (this.$refs.selected) {
                    if (
                        this.$refs.selected[0].offsetTop >
                        this.$refs.container.scrollTop +
                            this.$refs.container.clientHeight -
                            this.$refs.selected[0].clientHeight
                    ) {
                        this.$refs.container.scrollTop =
                            this.$refs.selected[0].offsetTop +
                            this.$refs.selected[0].clientHeight -
                            this.$refs.container.clientHeight
                    }

                    if (this.$refs.selected[0].offsetTop < this.$refs.container.scrollTop) {
                        this.$refs.container.scrollTop = this.$refs.selected[0].offsetTop
                    }
                }
            })
        },

        chooseSelected() {
            if (this.results[this.selected] !== undefined) {
                this.choose(this.results[this.selected])
            }
        },

        choose(option) {
            this.$emit('selected', option)
            Vue.nextTick(() => this.close())
            this.results = [];
        },

        open() {
            this.show = true;
        },

        close() {
            this.show = false;
        },

        clear() {
            this.query = null;
            this.show = false;
            this.results = [];

            this.$emit('clear');

            if (!this.url) {
                return this.$emit('search', this.query);
            }
        },

        getResultValue(result) {
            return _.get(result, this.resultValue);
        },
    }
}
</script>
