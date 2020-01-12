<template>
<layout
    :label="label"
    :errors="form.errors"
    :name="name"
    :show-errors="showErrors"
    v-on-clickaway="close"
>
    <input type="hidden" :name="name" :value="form[name]">

    <div class="relative flex items-center">
        <div class="absolute inset-y-0 left-0 pl-2 pointer-events-none flex items-center text-gray-600">
            <svg class="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path></svg>
        </div>

        <input
            ref="formElement"
            @click="open"
            @focus="open"
            @input="handleInput"
            @keydown.enter.prevent="chooseSelected"
            @keydown.down.prevent="move(1)"
            @keydown.up.prevent="move(-1)"
            @keyup="form.errors.clear(name)"
            v-model="query"
            type="search"
            class="form-input px-8"
            :class="{ 'border-red-500': showErrors && form.errors.has(name) }"
            :placeholder="placeholder"
            spellcheck="false"
            :autofocus="autofocus"
        />

        <button
            v-if="query"
            @click.stop="clear"
            type="button"
            tabindex="-1"
            class="absolute p-2 pr-3 inset-y-0 right-0 flex items-center text-gray-600"
        >

            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 1000 1000"
                class="fill-current h-3 w-3"
            >
            <path d="M538.7,500L980.5,58.2c6-6,9.5-14.1,9.5-22.3c0-7.1-2.7-13.7-7.5-18.5c-4.8-4.8-11.4-7.5-18.5-7.5c-8.1,0-16.2,3.5-22.2,9.5L500,461.3L58.2,19.5c-6-6-14.1-9.5-22.2-9.5c-7.1,0-13.7,2.7-18.5,7.5C12.7,22.2,10,28.8,10,36c0,8.1,3.5,16.1,9.5,22.2L461.3,500L19.5,941.8c-5.8,5.8-9.1,13.2-9.5,20.9c-0.3,7.6,2.3,14.7,7.4,19.8c4.8,4.8,11.4,7.4,18.5,7.4c8.1,0,16.2-3.4,22.2-9.5L500,538.7l441.8,441.8c11.3,11.3,30.4,12.2,40.7,2c10.7-10.7,9.8-28.9-2-40.7L538.7,500z"/>
            </svg>

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
</layout>
</template>
<script>
import Base from '../mixins/base'
import { mixin as clickaway } from 'vue-clickaway'

const debounce  = require('lodash/debounce')
const get  = require('lodash/get')

export default {
    props: {
        url: {
            type: String,
            default: null,
        },

        resultName: {
            type: String,
            default: 'descrizione',
        },

        resultValue: {
            type: String,
            default: 'id',
        },
    },

    mixins: [clickaway, Base],

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
        debouncer: debounce(callback => callback(), 500),

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
            if(this.form) {
                this.query = option[this.resultName];
                this.form[this.name] = option[this.resultValue];
            }

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
            return get(result, this.resultName);
        },
    }
}
</script>
