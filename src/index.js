// import { events } from './events'

import FormInput from './FormInput.vue'
// import FormSelect from './components/FormSelect.vue'
// import FormCounter from './components/FormCounter.vue'

export {
	FormInput,
}

// Create module definition for Vue.use()
const plugin = {
    install(Vue, args = {}) {

        Vue.component('form-input', FormInput);
        this.installed = true;
    }
};

export default plugin;

// Auto-install
let GlobalVue = null
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue
}
if (GlobalVue) {
	GlobalVue.use(plugin)
}
