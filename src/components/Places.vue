<template>
<div>
    <div class="w-full relative">
        <div class="absolute inset-y-0 left-0 pl-2 pointer-events-none flex items-center text-gray-600 z-10">
            <svg class="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path></svg>
        </div>

        <input
            :id="field.name"
            type="search"
            v-model="value"
            class="form-input px-8"
            :placeholder="field.name"
        />
    </div>

    <div v-if="s.address" >
        <div class="mb-2 text-gray-600">Seleziona per inserire</div>
        <button @click.prevent="emitChange" type="button" class="btn btn-default">
            <div>{{ s.address }}</div>
            <div>{{ s.city }}</div>
            <div>{{ s.state }}</div>
            <div>{{ s.county }}</div>
            <div>{{ s.postcode }}</div>
            <div>{{ s.countryCode }}</div>
        </button>
    </div>
</div>
</template>

<script>
import { events } from '../events'

export default {
    props: {
        countries: {
            default: null,
        },
        name: {
            default: 'street',
        },
        attribute: {
            default: 'street',
        },
    },

    data() {
        return {
            resourceName: {},
            field: {
                name: this.name,
            },
            value: '',
            s: {},
            placesAutocomplete: null,
        }
    },

    watch: {
        countries(newVal) {
            this.placesAutocomplete.configure({ countries: this.countries ? [this.countries] : null })
        },
    },

    /**
     * Mount the component.
     */
    mounted() {
        this.setInitialValue()

        this.field.fill = this.fill

        events.$on(this.name + '-value', value => {
            this.value = value
        })

        this.initializePlaces()
    },

    destroyed() {
        events.$off(this.field.attribute + '-value')
    },

    methods: {

        emitChange() {

            // address - Via Monteortone
            // city - Padua
            // state - Veneto
            // county - Padova
            // postcode - 35143
            // countryCode - it

            events.$emit('address-value', this.s.address);
            events.$emit('city-value', this.s.city);
            events.$emit('state-value', this.s.state);
            events.$emit('county-value', this.s.county);
            events.$emit('postcode-value', this.s.postcode);
            events.$emit('countryCode-value', this.s.countryCode);
        },

        fill(formData) {
            formData.append(this.field.attribute, this.value || '')
        },

        setInitialValue() {
            this.value = this.field.value || ''
        },
        /**
         * Initialize Algolia places library.
         */
        initializePlaces() {
            const places = require('places.js')

            const placeType = this.field.placeType

            const config = {
                style: true,
                container: document.querySelector('#' + this.field.name),
                type: this.field.placeType ? this.field.placeType : 'address',
                templates: {
                    value(suggestion) {
                        return suggestion.name
                    },
                },
                countries: this.countries ? [this.countries] : []
            }

            this.placesAutocomplete = places(config)

            this.placesAutocomplete.on('change', e => {
                this.$nextTick(() => {
                    this.value = e.suggestion.name

                    this.s.address = e.suggestion.name
                    this.s.city = e.suggestion.city
                    this.s.state = e.suggestion.administrative
                    this.s.postcode = e.suggestion.postcode
                    this.s.countryCode = e.suggestion.countryCode
                    this.s.county = e.suggestion.county

                })
            })

            this.placesAutocomplete.on('clear', () => {
                this.$nextTick(() => {
                    this.value = ''

                    events.$emit(this.field.secondAddressLine + '-value', '')
                    events.$emit(this.field.city + '-value', '')
                    events.$emit(this.field.state + '-value', '')
                    events.$emit(this.field.postalCode + '-value', '')
                    events.$emit(this.field.country + '-value', '')
                })
            })
        },

        /**
         * Parse the selected state into an abbreviation if possible.
         */
        parseState(state, countryCode) {
            if (countryCode != 'us') {
                return state
            }

            return _.find(this.states, (s) => {
                return s.name == state
            }).abbr
        }
    },

    computed: {
        /**
         * Get the list of United States.
         */
        states() {
            return {
                "AL": {
                    "count": "0",
                    "name": "Alabama",
                    "abbr": "AL"
                },
                "AK": {
                    "count": "1",
                    "name": "Alaska",
                    "abbr": "AK"
                },
                "AZ": {
                    "count": "2",
                    "name": "Arizona ",
                    "abbr": "AZ"
                },
                "AR": {
                    "count": "3",
                    "name": "Arkansas",
                    "abbr": "AR"
                },
                "CA": {
                    "count": "4",
                    "name": "California ",
                    "abbr": "CA"
                },
                "CO": {
                    "count": "5",
                    "name": "Colorado ",
                    "abbr": "CO"
                },
                "CT": {
                    "count": "6",
                    "name": "Connecticut",
                    "abbr": "CT"
                },
                "DE": {
                    "count": "7",
                    "name": "Delaware",
                    "abbr": "DE"
                },
                "DC": {
                    "count": "8",
                    "name": "District Of Columbia",
                    "abbr": "DC"
                },
                "FL": {
                    "count": "9",
                    "name": "Florida",
                    "abbr": "FL"
                },
                "GA": {
                    "count": "10",
                    "name": "Georgia",
                    "abbr": "GA"
                },
                "HI": {
                    "count": "11",
                    "name": "Hawaii",
                    "abbr": "HI"
                },
                "ID": {
                    "count": "12",
                    "name": "Idaho",
                    "abbr": "ID"
                },
                "IL": {
                    "count": "13",
                    "name": "Illinois",
                    "abbr": "IL"
                },
                "IN": {
                    "count": "14",
                    "name": "Indiana",
                    "abbr": "IN"
                },
                "IA": {
                    "count": "15",
                    "name": "Iowa",
                    "abbr": "IA"
                },
                "KS": {
                    "count": "16",
                    "name": "Kansas",
                    "abbr": "KS"
                },
                "KY": {
                    "count": "17",
                    "name": "Kentucky",
                    "abbr": "KY"
                },
                "LA": {
                    "count": "18",
                    "name": "Louisiana",
                    "abbr": "LA"
                },
                "ME": {
                    "count": "19",
                    "name": "Maine",
                    "abbr": "ME"
                },
                "MD": {
                    "count": "20",
                    "name": "Maryland",
                    "abbr": "MD"
                },
                "MA": {
                    "count": "21",
                    "name": "Massachusetts",
                    "abbr": "MA"
                },
                "MI": {
                    "count": "22",
                    "name": "Michigan",
                    "abbr": "MI"
                },
                "MN": {
                    "count": "23",
                    "name": "Minnesota",
                    "abbr": "MN"
                },
                "MS": {
                    "count": "24",
                    "name": "Mississippi",
                    "abbr": "MS"
                },
                "MO": {
                    "count": "25",
                    "name": "Missouri",
                    "abbr": "MO"
                },
                "MT": {
                    "count": "26",
                    "name": "Montana",
                    "abbr": "MT"
                },
                "NE": {
                    "count": "27",
                    "name": "Nebraska",
                    "abbr": "NE"
                },
                "NV": {
                    "count": "28",
                    "name": "Nevada",
                    "abbr": "NV"
                },
                "NH": {
                    "count": "29",
                    "name": "New Hampshire",
                    "abbr": "NH"
                },
                "NJ": {
                    "count": "30",
                    "name": "New Jersey",
                    "abbr": "NJ"
                },
                "NM": {
                    "count": "31",
                    "name": "New Mexico",
                    "abbr": "NM"
                },
                "NY": {
                    "count": "32",
                    "name": "New York",
                    "abbr": "NY"
                },
                "NC": {
                    "count": "33",
                    "name": "North Carolina",
                    "abbr": "NC"
                },
                "ND": {
                    "count": "34",
                    "name": "North Dakota",
                    "abbr": "ND"
                },
                "OH": {
                    "count": "35",
                    "name": "Ohio",
                    "abbr": "OH"
                },
                "OK": {
                    "count": "36",
                    "name": "Oklahoma",
                    "abbr": "OK"
                },
                "OR": {
                    "count": "37",
                    "name": "Oregon",
                    "abbr": "OR"
                },
                "PA": {
                    "count": "38",
                    "name": "Pennsylvania",
                    "abbr": "PA"
                },
                "RI": {
                    "count": "39",
                    "name": "Rhode Island",
                    "abbr": "RI"
                },
                "SC": {
                    "count": "40",
                    "name": "South Carolina",
                    "abbr": "SC"
                },
                "SD": {
                    "count": "41",
                    "name": "South Dakota",
                    "abbr": "SD"
                },
                "TN": {
                    "count": "42",
                    "name": "Tennessee",
                    "abbr": "TN"
                },
                "TX": {
                    "count": "43",
                    "name": "Texas",
                    "abbr": "TX"
                },
                "UT": {
                    "count": "44",
                    "name": "Utah",
                    "abbr": "UT"
                },
                "VT": {
                    "count": "45",
                    "name": "Vermont",
                    "abbr": "VT"
                },
                "VA": {
                    "count": "46",
                    "name": "Virginia ",
                    "abbr": "VA"
                },
                "WA": {
                    "count": "47",
                    "name": "Washington",
                    "abbr": "WA"
                },
                "WV": {
                    "count": "48",
                    "name": "West Virginia",
                    "abbr": "WV"
                },
                "WI": {
                    "count": "49",
                    "name": "Wisconsin",
                    "abbr": "WI"
                },
                "WY": {
                    "count": "50",
                    "name": "Wyoming",
                    "abbr": "WY"
                },
            }
        }
    }
}
</script>

<style scoped>
.ap-suggestion {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    line-height: 1.3em;
}
.ap-footer {
    display: none;
}

.ap-input::-webkit-search-decoration, .ap-input::-webkit-search-cancel-button, .ap-input::-webkit-search-results-button, .ap-input::-webkit-search-results-decoration {
  display: none;
}

input::-webkit-contacts-auto-fill-button {
    position: absolute;
    right: 40px;
}
</style>
