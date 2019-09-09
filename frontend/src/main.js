import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import router from './router'
import store from './store/index'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.component('font-awesome-icon', FontAwesomeIcon)

import { faTrash, faBoxOpen, faCheck, faClock, faPen, 
faFilter, faCog, faPlus, faHome, faSave, faColumns, faFlag, faSignInAlt, faSignOutAlt, faCogs, faUserPlus, faMinus, faPaperclip, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { faPlay, faPause, faStop, faTasks } from '@fortawesome/free-solid-svg-icons'
library.add(faPlay, faPause, faStop, faTrash, faBoxOpen,
  faCheck, faClock, faPen, faFilter, faCog, faPlus, faHome,
  faSave, faTasks, faColumns, faFlag, faSignInAlt, faSignOutAlt, faCogs, 
  faUserPlus, faMinus, faPaperclip, faQuestionCircle)


Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(BootstrapVue)
Vue.use(require('vue-moment'));

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
