<template>
  <div class="ChatHistory__Main" id="ChatHistory__Main" v-if="selectedUser">
    <div class="Message" v-for="transfer in selectedUser.transfers" :key="transfer.number">
      <div class="Message__Top">
        <div class="Message__From Message__Part">{{ transfer.from }}</div>
        <div class="Message__Time Message__Part">{{ transfer.time | fromNow }}</div>
        <div class="Message__Amount Message__Part">{{ transfer.amount }} {{ transfer.asset }}</div>
      </div>
      <div class="Message__Memo">{{ transfer.decoded ? transfer.decoded : (transfer.memo ? transfer.memo : '-') }}</div><!--| decode(User.memo_key, transfer.memo)-->
    </div>
  </div>
</template>

<script>

import { mapGetters, mapState } from 'vuex'
import * as steem from 'steem'
import * as moment from 'moment'
export default {
  computed: {
    ...mapGetters([
      'currentAccount',
      'memo_key_decrypted',
      'users',
      'selectedUser'
    ])
  },
  filters: {
    decode: async function(memo) {

    },
    fromNow: function(date) {
      return moment.utc(date).local().calendar();
      //return moment.utc(date).fromNow()
    }
  },
  methods: {
  },
  created() {
    let element = document.getElementById("ChatHistory__Main")
    if(element) {
      element.scrollTop = element.scrollHeight
    }
  },
  updated() {
    let element = document.getElementById("ChatHistory__Main")
    if(element) {
      element.scrollTop = element.scrollHeight
    }
    
  },
  watch: {
  }
}
</script>

<style>
.ChatHistory__Main {
  margin-top:50px;
  max-width: 100%;
  height:100%;
  flex:1;
  word-wrap:break-word;
  overflow-y: scroll;
}

.Message {
  padding:10px 10px;
  border-bottom:1px solid #f7f7f7;
  max-width:900px;
}

.Message__Top {
  display:flex;
  flex-flow:row;
  padding-bottom:10px;
}

.Message__From {
  font-weight:700;
  margin-right:10px;
}

.Message__Time {
  margin-right:10px;
  opacity: 0.85;
}

.Message__Amount {
  opacity: 0.5;
}

.Message__Memo {
  min-height:10px;
  margin-bottom:5px;
}
</style>
