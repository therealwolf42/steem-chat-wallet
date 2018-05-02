<template>
  <div class="Account__Container">
    <div style="display:flex; align-items:center;">
      <div v-if="!Unlocked" v-bind:class="{ not_clickable_lock: !Username, Button__Lock__focus: clickedUnlock && Username }" class="Button__Lock">
      <svg viewBox="0 0 64 64" @click="unlock(true)">
        <path data-name="layer2" d="M19 26.8V15A13 13 0 0 1 32 2a13 13 0 0 1 13 13v11.8"></path>
        <path data-name="layer2" d="M23 24.1V15a9 9 0 0 1 18 0v9.1"></path>
        <circle data-name="layer1" cx="32" cy="42" r="20"></circle>
        <path data-name="layer1" d="M34 45a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2 2 2 0 0 1 2 2z"></path>
      </svg>
      </div>
    <svg v-if="Unlocked" v-bind:class="{ not_clickable_lock: !Username }" class="Button__Lock"  viewBox="0 0 64 64" @click="unlock(false)">
    <path data-name="layer2" d="M19 26.8V15A13 13 0 0 1 32 2a13 13 0 0 1 13 13"></path>
    <path data-name="layer2" d="M23 24.1V15a9 9 0 0 1 18 0 2 2 0 0 0 4 0"></path>
    <circle data-name="layer1" cx="32" cy="42" r="20"></circle>
    <path data-name="layer1" d="M34 45a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2 2 2 0 0 1 2 2z"></path>
  </svg>
    <svg style="margin-left:10px;margin-right:10px;" @click="openSettings()" class="Button_Settings" viewBox="0 0 20 20">
			<path fill="none" d="M10.032,8.367c-1.112,0-2.016,0.905-2.016,2.018c0,1.111,0.904,2.014,2.016,2.014c1.111,0,2.014-0.902,2.014-2.014C12.046,9.271,11.143,8.367,10.032,8.367z M10.032,11.336c-0.525,0-0.953-0.427-0.953-0.951c0-0.526,0.427-0.955,0.953-0.955c0.524,0,0.951,0.429,0.951,0.955C10.982,10.909,10.556,11.336,10.032,11.336z"></path>
			<path fill="none" d="M17.279,8.257h-0.785c-0.107-0.322-0.237-0.635-0.391-0.938l0.555-0.556c0.208-0.208,0.208-0.544,0-0.751l-2.254-2.257c-0.199-0.2-0.552-0.2-0.752,0l-0.556,0.557c-0.304-0.153-0.617-0.284-0.939-0.392V3.135c0-0.294-0.236-0.532-0.531-0.532H8.435c-0.293,0-0.531,0.237-0.531,0.532v0.784C7.582,4.027,7.269,4.158,6.966,4.311L6.409,3.754c-0.1-0.1-0.234-0.155-0.376-0.155c-0.141,0-0.275,0.055-0.375,0.155L3.403,6.011c-0.208,0.207-0.208,0.543,0,0.751l0.556,0.556C3.804,7.622,3.673,7.935,3.567,8.257H2.782c-0.294,0-0.531,0.238-0.531,0.531v3.19c0,0.295,0.237,0.531,0.531,0.531h0.787c0.105,0.318,0.236,0.631,0.391,0.938l-0.556,0.559c-0.208,0.207-0.208,0.545,0,0.752l2.254,2.254c0.208,0.207,0.544,0.207,0.751,0l0.558-0.559c0.303,0.154,0.616,0.285,0.938,0.391v0.787c0,0.293,0.238,0.531,0.531,0.531h3.191c0.295,0,0.531-0.238,0.531-0.531v-0.787c0.322-0.105,0.636-0.236,0.938-0.391l0.56,0.559c0.208,0.205,0.546,0.207,0.752,0l2.252-2.254c0.208-0.207,0.208-0.545,0.002-0.752l-0.559-0.559c0.153-0.303,0.285-0.615,0.389-0.938h0.789c0.295,0,0.532-0.236,0.532-0.531v-3.19C17.812,8.495,17.574,8.257,17.279,8.257z M16.747,11.447h-0.653c-0.241,0-0.453,0.164-0.514,0.398c-0.129,0.496-0.329,0.977-0.594,1.426c-0.121,0.209-0.089,0.473,0.083,0.645l0.463,0.465l-1.502,1.504l-0.465-0.463c-0.174-0.174-0.438-0.207-0.646-0.082c-0.447,0.262-0.927,0.463-1.427,0.594c-0.234,0.061-0.397,0.271-0.397,0.514V17.1H8.967v-0.652c0-0.242-0.164-0.453-0.397-0.514c-0.5-0.131-0.98-0.332-1.428-0.594c-0.207-0.123-0.472-0.09-0.646,0.082l-0.463,0.463L4.53,14.381l0.461-0.463c0.169-0.172,0.204-0.434,0.083-0.643c-0.266-0.461-0.467-0.939-0.596-1.43c-0.06-0.234-0.272-0.398-0.514-0.398H3.313V9.319h0.652c0.241,0,0.454-0.162,0.514-0.397c0.131-0.498,0.33-0.979,0.595-1.43c0.122-0.208,0.088-0.473-0.083-0.645L4.53,6.386l1.503-1.504l0.46,0.462c0.173,0.172,0.437,0.204,0.646,0.083c0.45-0.265,0.931-0.464,1.433-0.597c0.233-0.062,0.396-0.274,0.396-0.514V3.667h2.128v0.649c0,0.24,0.161,0.452,0.396,0.514c0.502,0.133,0.982,0.333,1.433,0.597c0.211,0.12,0.475,0.089,0.646-0.083l0.459-0.462l1.504,1.504l-0.463,0.463c-0.17,0.171-0.202,0.438-0.081,0.646c0.263,0.448,0.463,0.928,0.594,1.427c0.061,0.235,0.272,0.397,0.514,0.397h0.651V11.447z"></path>
		</svg>
    <svg  style="margin-right:10px;"  v-bind:class="{ disabled: clickedUpdate,  not_clickable: !Username }" @click="updateTransfers()"  class="Button_Update" viewBox="0 0 20 20">
			<path fill="none" d="M3.254,6.572c0.008,0.072,0.048,0.123,0.082,0.187c0.036,0.07,0.06,0.137,0.12,0.187C3.47,6.957,3.47,6.978,3.484,6.988c0.048,0.034,0.108,0.018,0.162,0.035c0.057,0.019,0.1,0.066,0.164,0.066c0.004,0,0.01,0,0.015,0l2.934-0.074c0.317-0.007,0.568-0.271,0.56-0.589C7.311,6.113,7.055,5.865,6.744,5.865c-0.005,0-0.01,0-0.015,0L5.074,5.907c2.146-2.118,5.604-2.634,7.971-1.007c2.775,1.912,3.48,5.726,1.57,8.501c-1.912,2.781-5.729,3.486-8.507,1.572c-0.259-0.18-0.618-0.119-0.799,0.146c-0.18,0.262-0.114,0.621,0.148,0.801c1.254,0.863,2.687,1.279,4.106,1.279c2.313,0,4.591-1.1,6.001-3.146c2.268-3.297,1.432-7.829-1.867-10.101c-2.781-1.913-6.816-1.36-9.351,1.058L4.309,3.567C4.303,3.252,4.036,3.069,3.72,3.007C3.402,3.015,3.151,3.279,3.16,3.597l0.075,2.932C3.234,6.547,3.251,6.556,3.254,6.572z"></path>
		</svg>
    </div>
    <div style="display:flex;">
      <div v-if="Username" class="Username">@{{ Username }}</div>
      <div class="newVersion" v-if="newVersion && !showSettings">Update Available</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import steem from 'steem'
import * as _g from '../../_g'

export default {
  components: {
  },
  computed: {
    ...mapGetters([
      'currentAccount',
      'users',
      'Username',
      'Unlocked',
      'clickedUnlock',
      'newVersion',
      'showSettings'
    ]),
    ...mapState([
      'account',
      'transfers'
    ])
    },
  data() {
    return {
      status: '',
      error: false,
      clickedUpdate: false
    }
  },
  created() {
  },
  methods: {
    unlock(status) {
      if(!this.Username) return
      if(status) { // locked
        this.$store.commit('setClickedUnlock', true)
      } else {
        this.$store.commit('setUnlocked', false)
        this.$store.commit('setKeyDecrypted', {key_type:'memo_key', key: ''})
        this.$store.commit('setKeyDecrypted', {key_type:'active_key', key: ''})
      }
      
    },
    openSettings() {
      this.$store.commit('setShowSettings')
    },
    async updateTransfers() {
      if(this.clickedUpdate || ! this.Username) return
      this.clickedUpdate = true
      let transfers = await this.$store.dispatch('updateTransfers', { first: false, whole_history: false })
      //this.updateAccount()
      await _g.wait_sec(10)
      this.clickedUpdate = false
      return transfers
    }
  },
  watch: {
  }    
}
</script>

<style>
.newVersion {
  margin-top: -1px;
  margin-left: 5px;
  font-size:0.9rem;
  color:var(--main-color);
}

.Username {
  color: #7b7b7b;
  margin-top:-2px;
  margin-left:5px;
}

.Account__Container {
  height: fit-content;
  display:flex;
  flex-flow: column;
  margin:0 15px;
  margin-bottom:10px;
}
.Account__Input {
  padding:5px 10px;
  width:100px;
}
.Account__Status {
  margin-left:10px;
}

.Button_Settings, .Button_Update {
  width: 2em;
  height: 2em;
  fill: #7b7b7b;
  cursor: pointer;
}

.Button__Lock {
  width: 2em;
  height: 2em;
  fill: #7b7b7b;
  cursor: pointer;
  padding-bottom:1px;
}

.Button__Lock path, .Button__Lock circle {
  fill: none;
  stroke: #7b7b7b;
  stroke-width: 3;
  stroke-miterlimit: 10;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.Button__Lock:hover path, .Button__Lock:hover circle, .Button__Lock__focus path, .Button__Lock__focus circle {
  stroke: var(--main-color);
}

.Button_Settings:hover, .Button_Update:hover {
  width: 2em;
  height: 2em;
  fill: var(--main-color);
}

.Button_Settings path, .Button_Update path {
  fill: #7b7b7b;
}

.Button_Settings:hover path, .Button_Update:hover path {
  fill: var(--main-color);
}

.source {
  width:130px;
}

.not_clickable {
  fill: #7b7b7b;
  cursor:auto;
}

.not_clickable_lock {
  cursor:auto;
}

.not_clickable_lock:hover path, .not_clickable_lock:hover circle {
  stroke: #7b7b7b;
}

.not_clickable:hover, .not_clickable:hover path {
  fill: #7b7b7b;
}
</style>
