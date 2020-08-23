import Vue from 'vue'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'

import {Button, Field, Notify} from 'vant';
import 'vant/lib/index.css';

Vue.use(Button);
Vue.use(Field);
Vue.use(Notify);

Vue.config.productionTip = false


Vue.use(new VueSocketIO({
  debug: false,
  connection: 'http://localhost:3000',
  /* vuex: {
     store,
     actionPrefix: 'SOCKET_',
     mutationPrefix: 'SOCKET_'
   },*/
  options: { //Optional options
    //path: "/my-app/"
  }
}))


new Vue({
  render: h => h(App),
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    message: function (data) {
      console.log('message receive:',data)
      //console.info(this)

      this.$emit('event-desk',data);
      console.info('event-desk emit');
    },
    disconnect: function (socket) {
      console.info('disconnect',socket)
    },
    reconnect: function (socket) {
      console.info('reconnect',socket)
    }
  },
}).$mount('#app')
