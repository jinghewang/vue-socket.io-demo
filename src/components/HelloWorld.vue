<template>
  <div class="container">
    <div class="container-item item-panel">
      <div>Socket</div>
      <van-field v-model="current_socketid" label="socketid" placeholder="current socketid" />
      <van-button plain size="small" type="info" v-on:click="getSocketId">getSocketId</van-button>
    </div>
    <div class="container-item item-panel">
      <div>Broadcast</div>
      <van-field v-model="broadcast_namespace" label="namespace" placeholder="broadcast namespace" />
      <van-field v-model="broadcast_room" label="room" placeholder="broadcast room" />
      <van-field v-model="broadcast_client" label="socketid" placeholder="socketid" />
    </div>
    <div class="container-item item-row2">
      <van-button plain size="small" type="warning" data-method="broadcast" v-on:click="sendMessage">broadcast</van-button>
      <van-button plain size="small" type="info" data-method="message-namespace" v-bind:data-namespace="broadcast_namespace" v-on:click="sendMessage">broadcast by namespace</van-button>
      <van-button plain size="small" type="primary" data-method="message-room" v-bind:data-room="broadcast_room" v-on:click="sendMessage">broadcast by room</van-button>
      <van-button plain size="small" type="info" data-method="message-client" v-bind:data-client="broadcast_client" v-on:click="sendMessage">broadcast by client</van-button>
      <van-button plain size="small" type="primary" data-method="message-test" v-on:click="sendMessage">message-test</van-button>
    </div>
    <div class="container-item item-panel">
      <div>Room</div>
      <van-field v-model="current_room" label="room" placeholder="请输入内容 Room" />
    </div>
    <div class="container-item item-row2">
      <van-button plain size="small" type="warning" v-on:click="joinRoom">Join</van-button>
      <van-button plain size="small" type="warning" v-on:click="leaveRoom">Leave</van-button>
    </div>

  </div>
</template>

<script>


  import Vue from 'vue';
  import { Button } from 'vant';
  //import _ from 'lodash';

  Vue.use(Button);
  import { Field } from 'vant';
  import { Form } from 'vant';
  import { Notify } from 'vant';

  Vue.use(Form);

  Vue.use(Field);


  /**
   * get token
   * @author wjh 2020-8-12
   * @returns {number}
   */
  const getToken = function () {
    let timestamp = (new Date()).valueOf();
    return timestamp;
  };

  /**
   * get token
   * @author wjh 2020-8-12
   * @returns {number}
   */
  const getTimestamp = function () {
    let timestamp = (new Date()).valueOf();
    return timestamp;
  };



  function getVueDataset(event,attribute) {
    let elem = event.currentTarget.attributes['data-' + attribute];
    if (elem)
      return elem.value;
    else
      return '';
  }



  const getClientData = function (data) {
    data.access_token = data.access_token || getToken();
    data.timestamp = data.timestamp || getTimestamp();
    //data.source = data.source || 'client';
    //console.warn(data);
    return data;
  };

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      message: 'Hello Vue!',
      visible: false,
      current_socketid: '',
      send_message: 'hello boy',
      target_socketid: '',
      current_room: 'room1',
      room_message: 'hello room',
      target_room: 'room1',
      broadcast_namespace: '/',
      broadcast_room: 'room1',
      broadcast_client: '',
      access_token: '',
    }
  },
  methods: {
    test: function (elem) {
      let data = {};
      console.info(data.xa);

      let test = this.$refs.test;
      let method = test.attributes['data-method'].value;
      console.info(method);
      console.info(test.dataset['method']);

    },
    getSocketId: function(ee){
      this.current_socketid = this.$socket.id;
    },
    sendMessage: function(e){
      let method = getVueDataset(e, 'method');
      let namespace = getVueDataset(e, 'namespace');
      let room = getVueDataset(e, 'room');
      let client = getVueDataset(e, 'client');
      let data = {'type': method, 'meta': {}, 'data': {}};
      if (namespace)
        data.meta.namespace = namespace;

      if (room)
        data.meta.room = room.split(',');

      if (client)
        data.meta.client = client.split(',');

      data.data = {id: 123, name: 'wjh'};
      console.info('data',data);

      this.$socket.emit('message', data, function (d) {
        console.info('message back', d)
      })
    },
    joinRoom: function () {
      let room = this.current_room;
      this.$socket.emit('join-room', getClientData({'type': 'join-room', 'room': room}), function (data) {
        console.info('join-room back', data)
      });
    },
    leaveRoom: function () {
      let room = this.current_room;
      this.$socket.emit('leave-room', getClientData({'type': 'leave-room', 'room': room}), function (data) {
        console.info('leave-room back', data)
      });
    },
    emit: function (elem) {
      console.info(111)
      let data = {
        type: 'message',
        meta: {
          room: ['room1']
        },
        data: {
          id: 1222,
          name: 'wjh'
        }
      };

      this.$socket.emit('message', data, function (d) {
        console.info('message ack', d);
      })
    },
    emittest: function (event) {
      console.info('emittest');
    }
  },
  mounted() {
    console.info('--mounted--');
    console.info(this.$root)
    let event_desk = this.$root._events['event-desk'];
    if (!event_desk) {
      this.$root.$on('event-desk', function (data) {
        console.info('event-desk', data);
        Notify(JSON.stringify(data));
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .container {
    display: grid;
    grid-template-columns: 100%;
    gap: 10px 10px;
    text-align: left;
  }


  .container-item {
    /*width: 100vw;*/
  }

  .item-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px);
    gap: 10px 10px;
    justify-content: space-evenly;

  }

  .item-row2 {
    display: grid;
    grid-template-columns: repeat(auto-fill, 45%);
    gap: 10px 10px;
    justify-content: space-evenly;
  }

  .item-panel {
    display: block;
  }


</style>
