import Creator from './components/Creator'
import Input from './components/Input'
import DateRange from './components/DateRange'
import Checkbox from './components/Checkbox'
import Money from './components/Money'
import Select from './components/Select'
import Counter from './components/Counter'
import Search from './components/Search'
import Textarea from './components/Textarea'
import Error from './components/Base/Error'
import Submit from './components/Submit'

import Form from 'form-backend-validation';

export {
    Form,
    Creator,
    Input,
    DateRange,
    Checkbox,
    Money,
    Select,
    Counter,
    Search,
    Textarea,
    Error,
    Submit,
}

export default {
    install(Vue, args = {}) {
        if (this.installed) return

        this.installed = true
        let keyword = 'v-form-';

        Vue.component(keyword + 'creator', Creator)
        Vue.component(keyword + 'input', Input)
        Vue.component(keyword + 'daterange', DateRange)
        Vue.component(keyword + 'checkbox', Checkbox)
        Vue.component(keyword + 'money', Money)
        Vue.component(keyword + 'select', Select)
        Vue.component(keyword + 'counter', Counter)
        Vue.component(keyword + 'search', Search)
        Vue.component(keyword + 'textarea', Textarea)
        Vue.component(keyword + 'error', Error)
        Vue.component(keyword + 'submit', Submit)

        window.Form = Form;
    }
}
