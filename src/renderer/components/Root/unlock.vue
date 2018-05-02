<template>
  <div class="Unlock__Main">
    <div class="Unlock__Container">
      <input @keyup.enter="unlock()" id="Input__Encrypt" class="Input__Encrypt Color__Main" placeholder="Encryption Password" type="password" v-model="encryption_password">
      <div class="Search__Button Unlock__Button " @click="unlock()">
      <svg viewBox="0 0 20 20" >
        <path d="M17.218,2.268L2.477,8.388C2.13,8.535,2.164,9.05,2.542,9.134L9.33,10.67l1.535,6.787c0.083,0.377,0.602,0.415,0.745,0.065l6.123-14.74C17.866,2.46,17.539,2.134,17.218,2.268 M3.92,8.641l11.772-4.89L9.535,9.909L3.92,8.641z M11.358,16.078l-1.268-5.613l6.157-6.157L11.358,16.078z"></path>
      </svg>
    </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as CryptoJS from 'crypto-js'
import * as _g from '../../_g'

export default {
  computed: {
    ...mapGetters([
      'Unlocked',
      'clickedUnlock',
      'memo_key',
      'active_key',
      'settings'
    ])
  },
  data() {
    return {
      encryption_password: ''
    }
  },
  methods: {
    async unlock() {
      if(this.memo_key) {
        if(!this.decrypt('memo_key', this.memo_key)) return
        this.$store.dispatch('decodeAllTransfers')
      }

      if(this.active_key) {
        if(!this.decrypt('active_key', this.active_key)) return
      }

      this.$store.commit('setUnlocked', true)
      this.$store.commit('setClickedUnlock', false)

      // Lock again after waiting time
      await _g.wait_sec(this.settings.timeout > 1 ? this.settings.timeout * 60 : 1 * 60)
      this.$store.commit('setUnlocked', false)
      this.$store.commit('setKeyDecrypted', {key_type:'memo_key', key: ''})
      this.$store.commit('setKeyDecrypted', {key_type:'active_key', key: ''})
    },
    decrypt(key_type, key) {
      try {
        key = CryptoJS.AES.decrypt(key, this.encryption_password)
        key = key.toString(CryptoJS.enc.Utf8)
        if(!key) {
          this.$Message.error('Wrong Password')
          return false
        }
        this.$store.commit('setKeyDecrypted', { key_type, key })
        return true
      } catch (e) {
        console.error(e)
        this.$Message.error('Wrong Password')
        return false
      }
    }
  },
  mounted() {
    
    let element = document.getElementById('Input__Encrypt')
    if(element) {
      element.focus()
    }
  }

}
</script>

<style>
.Unlock__Main {
  z-index:10000;
  background-color:white;
}

.Input__Encrypt {
  width:150px;
  padding:10px 10px;
  padding-right:4px;
  border-radius:4px;
  
}

.Unlock__Container {
  display:flex;
  background-color: white;
}

.Unlock__Button {
  border-color: var(--main-color);
  margin-left:-3px;
}

.Unlock__Button svg path {
  fill: var(--main-color);
}
</style>
