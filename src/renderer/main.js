import Vue from 'vue'
import * as axios from 'axios'
import VTooltip from 'v-tooltip'
import * as notifier from 'node-notifier'

import Message from './components/_message'
import Checkbox from './components/_checkbox/checkbox'

import App from './App'
import router from './router'
import store from './store'
import db from './db'
import db_user from './db_user'
import Modal from './components/_modal/modal'

import { remote } from 'electron'

remote.globalShortcut.register('CommandOrControl+Shift+K', () => {
  remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
})

window.addEventListener('beforeunload', () => {
  remote.globalShortcut.unregisterAll()
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$db = db
Vue.prototype.$db_user = db_user
Vue.prototype.$notifier = notifier

Vue.directive('autoresize', {
  inserted: function (el) {
    let height = el.scrollHeight > 90 ? el.scrollHeight : 90
    el.style.height = height + 'px'
    el.style.resize = 'none'
    function OnInput() {
      height = el.scrollHeight > 90 ? el.scrollHeight : 90
      if(this.scrollHeight > 90) {
        el.style.overflowY = 'scroll'
      } else {
        el.style.overflowY = 'hidden'
      }
      this.style.height = 'auto';
      this.style.height = height + 'px';
      this.scrollTop = this.scrollHeight;
      window.scrollTo(window.scrollLeft, (this.scrollTop + this.scrollHeight));
    }
    el.addEventListener("input", OnInput, false);
  }
})

Vue.component('Modal', Modal)
Vue.component('Message', Message)
Vue.component('Checkbox', Checkbox)
Vue.use(VTooltip)
Vue.prototype.$Message = Message
Vue.prototype.$Modal = Modal
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  data: {
    showModal: false
  }
}).$mount('#app')
