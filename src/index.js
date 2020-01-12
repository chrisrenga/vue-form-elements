import Creator from './components/Creator'
import Input from './components/Input'
import Money from './components/Money'
import Select from './components/Select'
import Counter from './components/Counter'
import Search from './components/Search'
import Textarea from './components/Textarea'

export {
    Creator,
    Input,
    Money,
    Select,
    Counter,
    Search,
    Textarea,
}

export default {
    install(Vue, args = {}) {
        if (this.installed) return

        this.installed = true
        let keyword = 'v-form-';

        Vue.component(keyword + 'creator', Creator)
        Vue.component(keyword + 'input', Input)
        Vue.component(keyword + 'money', Money)
        Vue.component(keyword + 'select', Select)
        Vue.component(keyword + 'counter', Counter)
        Vue.component(keyword + 'search', Search)
        Vue.component(keyword + 'textarea', Textarea)
    }
}
