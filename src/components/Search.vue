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
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                class="fill-current w-4 h-4"
            ><path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path></svg>
        </div>

        <input
            ref="formElement"
            @click="open"
            @focus="open"
            @keydown.stop=""
            @input.stop="handleInput"
            @keydown.enter.prevent="chooseSelected"
            @keydown.down.prevent="move(1)"
            @keydown.up.prevent="move(-1)"
            @keyup="showErrors ? form.errors.clear(name) : null"
            v-model="query"
            type="search"
            class="form-input px-8"
            :class="{ 'border-red-500': showErrors && form.errors.has(name) }"
            :placeholder="placeholder"
            spellcheck="false"
            :autofocus="autofocus"
            autocomplete="something-new"
        />

        <button
            v-if="query"
            @click.stop="clear"
            type="button"
            tabindex="-1"
            class="absolute p-2 pr-3 inset-y-0 right-0 flex items-center text-gray-600"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                class="fill-current h-4 w-4"
            ><path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"/></svg>

        </button>
    </div>

    <!-- Loader -->
    <div
        v-if="loading && url"
        class="bg-white py-3 overflow-hidden absolute rounded-lg shadow-lg w-full mt-2 max-h-search overflow-y-auto z-50"
    >
        <loader class="text-60" width="40" />
    </div>

    <!-- No Results Found -->
    <div
        v-if="shouldShowNoResults"
        class="bg-white overflow-hidden absolute rounded-lg shadow-lg w-full mt-2 max-h-search overflow-y-auto z-50"
    >
        <h3 class="text-xs uppercase tracking-wide text-80 bg-40 py-4 px-3">
            Nessun risultato
        </h3>
    </div>

    <div
        v-if="show"
        ref="container"
        class="absolute overflow-y-scroll scrolling-touch text-sm bg-white shadow-lg rounded z-50 w-full"
        tabindex="-1"
        style="max-height: 255px; max-width: 600px;"
    >
        <div
            v-for="group in formattedResults"
            class="text-left"
        >
            <div v-if="group.resourceTitle" class="uppercase tracking-wide text-80 bg-gray-200 py-2 px-3">
                {{ group.resourceTitle }}
            </div>

            <div
                v-for="item in group.items"
                :key="item.resourceName + ' ' + item.index"
                :ref="item.index === selected ? 'selected' : null"
                class="px-4 py-2 cursor-pointer hover:bg-gray-400 text-left"
                @click.prevent="choose(item)"
                :class="{
                    'hover:bg-30': item.index != selected,
                    'bg-blue-400 text-white': item.index == selected
                }"
                v-html="getResultValue(item)"
            ></div>
        </div>
    </div>
</layout>
</template>
<script>
import Base from '../mixins/base'
import { mixin as clickaway } from 'vue-clickaway'

const debounce  = require('lodash/debounce')
const get  = require('lodash/get')
const filter  = require('lodash/filter')

export default {
    props: {
        url: {
            type: String,
            default: null,
        },

        params: {
            type: Object,
            default: () => {},
        },

        resultName: {
            type: String,
            default: 'searchResult',
        },

        resultValue: {
            type: String,
            default: 'id',
        },

        search: {
            default: null,
        },
    },

    mixins: [clickaway, Base],

    data() {
        return {
            loading: false,
            currentlySearching: false,
            show: false,
            query: this.search,
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

        search(newVal) {
            this.query = newVal;
        },
    },

    computed: {
        indexedResults() {
            return _.map(this.results, (item, index) => {
                return { index, ...item }
            })
        },

        formattedGroups() {
            return _.chain(this.indexedResults)
                .map(item => {
                    return {
                        resourceName: item.resourceName,
                        resourceTitle: item.resourceName,
                    }
                })
                .uniqBy('resourceName')
                .value()
        },

        formattedResults() {
            return _.map(this.formattedGroups, group => {
                return {
                    resourceName: group.resourceName,
                    resourceTitle: group.resourceTitle,
                    items: filter(
                        this.indexedResults,
                        item => item.resourceName == group.resourceName
                    ),
                }
            })
        },

        hasSearchTerm() {
            return this.query && this.query.length && this.query != '';
        },

        hasResults() {
            return this.results && this.results.length > 0
        },

        shouldShowNoResults() {
            return (
                this.currentlySearching &&
                !this.loading &&
                !this.hasResults &&
                this.hasSearchTerm
            )
        },

        shouldShowResults() {
            return this.currentlySearching && this.hasResults && !this.loading
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
            this.loading = true

            if (!this.hasSearchTerm) {
                this.results = [];
                this.loading = false;
                return;
            }

            this.debouncer(() => {
                this.doSearch();
            }, 500);
        },

        doSearch() {
            if (!this.url) {
                this.loading = false
                return this.$emit('search', this.query);
            }

            if (!this.query) {
                return this.results = null;
            }

            this.open();

            axios.get(`${this.url}/${this.query}`, {params: this.params})
                .then(({data}) => {
                    this.loading = false;
                    this.results = data
                });

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

                if (newIndex < 0) {
                    this.selected = this.results.length - 1
                    this.updateScrollPosition()
                } else if (newIndex > this.results.length - 1) {
                    this.selected = 0
                    this.updateScrollPosition()
                } else if (newIndex >= 0 && newIndex < this.results.length) {
                    this.selected = newIndex
                    this.updateScrollPosition()
                }
            }
        },

       updateScrollPosition() {
            if (!this.url) {
               return;
            }

            const selection = this.$refs.selected
            const container = this.$refs.container

            this.$nextTick(() => {
                if (selection) {
                    if (
                        selection[0].offsetTop >
                        container.scrollTop + container.clientHeight - selection[0].clientHeight
                    ) {
                        container.scrollTop =
                            selection[0].offsetTop +
                            selection[0].clientHeight -
                            container.clientHeight
                    }
                    if (selection[0].offsetTop < container.scrollTop) {
                        container.scrollTop = selection[0].offsetTop
                    }
                }
            })
        },

        chooseSelected() {
            const resource = _.find(
                this.indexedResults,
                res => res.index == this.selected
            )

            this.choose(resource)
        },

        choose(option) {
            if(this.form) {
                this.query = option[this.resultName];
                this.form[this.name] = option[this.resultValue];
            }

            this.clearError();

            this.$emit('changed', option);

            Vue.nextTick(() => this.close())

            this.results = [];
        },

        open() {
            if (!this.url) {
                return;
            }

            this.show = true;
            this.currentlySearching = true
        },

        close() {
            this.show = false;
            this.currentlySearching = false
            this.loading = false
        },

        clear() {
            this.query = null;
            this.show = false;
            this.results = [];
            this.form[this.name] = null;

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
