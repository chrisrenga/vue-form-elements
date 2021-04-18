# Vue Form Elements
Vue.js Form compoents with a TailwindCss stylesheet

!! WIP !!

Register the Plugin
```js
import FormElements from '@chrisrenga/vue-form-elements'
Vue.use(FormElements);
```

or import the individual components
```js
import {FormInput, FormSelect} from '@chrisrenga/vue-form-elements'
```
Globally
```js
Vue.component('v-form-input', FormInput);
```
Or in another component
```js
export default {
    components: {FormSelect},
    ...
}
```
import the stylesheet
```js
import style from '@chrisrenga/vue-form-elements/dist/index.css'
```

## Components

### v-form-input

```html
<v-form-input
    label="Name"
    name="name"
    :form="form"
    value='initial value'
    :show-errors="false"
    :required="true"
    :autofocus="true"
    placeholder="Please enter a name..."
/>
```

### v-form-select
```html
<v-form-select
    label="Membership Type"
    :options="[
        {name: 'value 1', value: 1},
        {name: 'value 2', value: 2},
    ]"
    :form="form"
    name="type"
    option-name="name"
    option-value="value"
/>
```
### v-form-money
### v-form-counter
### v-form-search
### v-form-textarea
### v-form-creator

### v-form Creator
Automatically create a form with the defined field components

```html
<v-form-creator
    action="/form-submit"
    method="POST"
    sumbitText="Save"
    :fields="[
        {
            component: 'form-input',
            name: 'name',
            label: 'Name input',
            value: 't',
        },
        {
            component: 'form-input',
            name: 'email',
            label: 'Email',
        },
        {
            component: 'form-select',
            name: 'option',
            label: 'Option selection',
            options: [
                {nome: 'value 1', id: 1},
                {nome: 'value 2', id: 2},
            ],
            value: 2,
            optionName: 'nome',
            optionValue: 'id',

        },
        {
            component: 'form-counter',
            name: 'quantity',
            label: 'Quantità',
            value: 1,
        },
        {
            component: 'form-money',
            name: 'euro',
            label: 'Prezzo',
            value: 345,
        },
        {
            component: 'form-search',
            name: 'search',
            label: 'Cerca',
            url: '/query',
            resultValue: 'value',
        },
        {
            component: 'form-textarea',
            name: 'notes',
            label: 'Note',
            value: 'I',
        },
    ]"
></v-form-creator>
```

## Non Ajax forms

#### Setting errors and old values with Laravel
```html
<v-form-input
    :ajax="false"
    label="Name"
    name="name"
    :errors='@json($errors->get("name"))'
    :value='@json(old("name"))'
></v-form-input>
```