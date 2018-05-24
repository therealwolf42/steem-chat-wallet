<template>
  <div class="SettingsTopic__Main scrollbar__main scrollbar__medium">
    <p class="Heading">Account Settings</p>
    <div v-if="Username">
      <div style="display:flex; align-items:center;">
        <currentAccount style="width:fit-content;"  />
        <button class="Button__Main ChangeKeys border__round__medium hover__blue" style="font-size:0.7rem;" @click="changeKeys()">Change Keys</button>
      </div>
    </div>
    <div>
     <div class="ImportMethods__Container" v-if="Username || Accounts.length > 0">
      <div class="ImportMethods__Part">
           <div style="margin-right:8px;" class="ImportMethod AccountAction border__round__medium hover__fill" @click="action = 'change'"
           v-bind:class="{ highlighted: action === 'change' || (Accounts.length > 0 && action !== 'add') , no_focus: action && action !== 'change' }">
            Accounts
           </div>
      </div>
      <div class="ImportMethods__Part">
        <div class="ImportMethod AccountAction border__round__medium hover__fill" @click="action = 'add'"
            v-bind:class="{ highlighted: action === 'add', no_focus: action && action !== 'add' }">
          Add Account
        </div>
        </div>
    </div>
    </div>
    <div v-if="action === 'change' || (Accounts.length > 0  && action !== 'add') " >
      <h2 >Your Accounts</h2>
      <Accounts style="height:100%;"/>
    </div>

    <div v-if="action === 'add' || (!Username && Accounts.length <= 0)">
      <p style="margin-bottom:5px;">You are able to add multiple accounts to Steem Chat-Wallet.</p>
      <p style="margin-bottom:10px;">For each account you can either enter your private active & memo-key directly or derive the keys from your password.</p>
      <p v-if="change_keys" style="margin-bottom:10px;">Important for "Change Keys": Your keys will be overwritten - even if you leave a field empty.</p>
      <div class="ImportMethods__Container">
        <div class="ImportMethods__Part" style="margin-right:8px;">
          <div  class="ImportMethod border__round__medium hover__fill" @click="chooseImport('password')"
              v-bind:class="{ highlighted: chosen === 'password', no_focus: chosen && chosen !== 'password' }">
            Import Password
          </div>
        </div>
        <div class="ImportMethods__Part">
          <div class="ImportMethod border__round__medium hover__fill" @click="chooseImport('keys')"
            v-bind:class="{ highlighted: chosen === 'keys', no_focus: chosen && chosen !== 'keys' }">
            Import Private Keys
          </div>
        </div>
      </div>

      <div v-if="chosen === 'password'">
        <p style="margin-bottom:5px;">Your password will not be saved - only the derived active- & memo-key</p>
        <div class="SettingsTopic__Partial">
          <p class="Label__Input">Account</p>
          <input class="Input__Main  border__round" v-model="new_username">
        </div>
        <div class="SettingsTopic__Partial">
          <p class="Label__Input">Password</p>
          <div>
            <input class="Input__Main  border__round" type="password" v-model="password">
          </div>
        </div>
      </div>

      <div v-if="chosen === 'keys'">
        <div class="SettingsTopic__Partial">
          <p class="Label__Input">Account</p>
          <input class="Input__Main  border__round" v-model="new_username">
        </div>
        <div class="SettingsTopic__Partial">
          <p class="Label__Input">Active Key</p>
          <div>
            <input class="Input__Main  border__round" type="password" v-model="active">
          </div>
        </div>
        <div class="SettingsTopic__Partial">
          <p>Memo Key</p>
          <div>
            <input class="Input__Main  border__round" type="password" v-model="memo">
          </div>
        </div>
      </div>

      <div v-if="chosen" style="margin-bottom:20px;">
        <h2 style="margin-bottom:5px;">Encryption</h2>
        <p style="margin-bottom:10px;">Your keys will be encrypted and then saved locally on your computer. For this encryption you need to enter an encryption password to unlock your keys. If you lose that password - you are not able to gain access of your keys. </p>
        <div class="SettingsTopic__Partial">
          <p class="Label__Input">Encryption Password</p>
          <div>
            <input class="Input__Main  border__round" type="password" v-model="encryption_password">
          </div>
        </div>
        <div class="SettingsTopic__Partial">
          <p class="Label__Input">Encryption Password (confirm)</p>
          <div>
            <input class="Input__Main  border__round" type="password" v-model="encryption_password_confirm">
          </div>
        </div>
        <button style=" width:100%; margin-top:10px;" class="Btn__Special" @click="addAccount()"> {{ change_keys ? 'Change Keys' : 'Add Account' }}</button>
      </div>
    </div>
    <!--<button  class="Button__Save Button__Main border__round__medium hover__blue" @click="save()" :disabled="clicked" 
            v-bind:class="{ changed: changed }">Save</button>-->
    <!--<div class="Settings__Info">* Keys are encrypted and then saved in the local database.</div>-->
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import * as steem from 'steem'
import * as dsteem from 'dsteem'
import * as CryptoJS from 'crypto-js'

import currentAccount from './account/current_account'
import Accounts from './account/accounts'

export default {
  components: {
    currentAccount, Accounts
  },
  computed: {
    ...mapGetters([
      'Username',
      'memo_key',
      'active_key',
      'Accounts'
    ])
  },
  data() {
    return {
      user: '',
      memo: '',
      active: '',
      clicked: false,
      changed: false,
      changeUnlock: false,
      chosen: '',
      new_username: '',
      password: '',
      encryption_password: '',
      encryption_password_confirm: '',
      select: true,
      action:'',
      change_keys: false
    }
  },
  created() {
    this.select = this.Accounts.length > 0
  },
  methods: {
    changeKeys() {
      if(this.change_keys) {
        this.change_keys = false
         this.new_username = ''
      } else {
        this.change_keys = true
        this.action = 'add'
        this.new_username = this.Username
      }
    },
    async addAccount(fromPassword) {
      

      if(!this.new_username || (( ( this.password || this.memo || this.memo) && (!this.encryption_password ||!this.encryption_password_confirm))
         || this.encryption_password !== this.encryption_password_confirm) ) {
        return this.$Message.error('Missing fields')
      }

      if(this.encryption_password && this.encryption_password.length < 5) return this.$Message.error('Password needs to be at least 5 characters long!')

      let changing_keys = this.new_username === this.Username

      let account = await this.$store.dispatch('getSteemAccount', this.new_username)
      if(!account) {
        this.clicked = false
        return this.$Message.error('Invalid Account')
      }


      if(this.chosen === 'password') {
        if(!this.password) return this.$Message.error('Missing Password')
        try {
          this.active = dsteem.PrivateKey.fromLogin(this.new_username, this.password, 'active').toString()
          this.memo = dsteem.PrivateKey.fromLogin(this.new_username, this.password, 'memo').toString()
        } catch (error) {
          return this.$Message.error('Invalid Password')
        }
      }

      let memo_valid = false
      if(this.memo) {
        memo_valid = await this.$store.dispatch('testKey', { key: this.memo, key_auths: [[account.memo_key, 1]]})
      }
      
      let active_valid = false
      if(this.active) {
        active_valid = await this.$store.dispatch('testKey', { key: this.active,  key_auths: account.active.key_auths})
      }

      if(!active_valid && !memo_valid && this.chosen === 'password') {
        return this.$Message.error('Invalid Password')
      } else if(!active_valid && this.active) {
        return this.$Message.error('Invalid Active Key')
      } else if(!memo_valid && this.memo) {
        return this.$Message.error('Invalid Memo Key')
      }

      if(!changing_keys) {
        this.$store.commit('resetUser')
        this.$store.commit('setUserName', this.new_username)
      }

      this.$store.commit('addAccount', {name: this.new_username, memo: memo_valid, active: active_valid })

      if(memo_valid) {
        this.setKey(this.memo, 'memo_key')
      } else if(!memo_valid && changing_keys) {
        this.resetKey('memo')
      }

      if(active_valid) {
        this.setKey(this.active, 'active_key')
      } else if(!active_valid && changing_keys) {
        this.resetKey('active')
      }
      
      if(!changing_keys) await this.$store.dispatch('changeUser', { name: this.new_username })
      
      this.memo = ''
      this.active = ''
      this.encryption_password = ''
      this.encryption_password_confirm = ''
      this.password = ''
      this.new_username = ''
      this.action = 'change'
      this.chosen = ''
      this.change_keys = false
    },
    setKey(key, key_type) {
      this.$store.commit('setKeyDecrypted', { key_type, key })
      this.$store.commit('setUnlocked', true)
      let params = { keySize: 512/32, iterations: 100000 }
      let encrypted_password = CryptoJS.PBKDF2(this.encryption_password, 'salt', params).toString()
      key = CryptoJS.AES.encrypt(key, encrypted_password).toString()
      this.$store.commit('setKey', { key_type, key })
    },
    chooseImport(key) {
      this.chosen = key
    },
    resetKey(key_type) {
      this.$store.commit('setKey', { key_type: `${key_type}_key`, key: '' })
      this[key_type] = ''
    },
    async save() {
      this.clicked = true
      let test_active = this.active !== this.active_key
      let test_memo = this.memo !== this.memo_key


      let result = true
      if(this.username !== this.Username) {
        
        //this.$Message.info('Updating Transfers')
        //await this.$store.dispatch('updateTransfers', { first: true })
      }
      this.clicked = false
      this.changed = false
      this.memo = this.memo_key
      this.active = this.active_key
      if(result) {
        this.$Message.success('Saved')
      } else {  }
    }
  },
  watch: {
    active: function(active) {
      this.changed = active != this.active_key
    },
    memo: function(memo) {
      this.changed = memo != this.memo_key
    }
  }
}
</script>

<style>
.ImportMethods__Container {
  margin:20px 0;
  display: flex;
  /*max-width:800px;*/
}

.ImportMethods__Part {
  display: inline-block;
  flex:1;
}

.ImportMethod {
  padding:8px 5px;
  min-width:150px;
  text-align: center;
  cursor: pointer;
  border-color: var(--main-color);
}

.no_focus {
  border-color:#dfdfdf;
}

.SettingsTopic__Main {
  overflow-y: auto;
  position: relative;
  display:flex;
  flex-flow:column;
  height:100%;
  padding:0 20px;
}

.SettingsTopic__Partial {
  display:flex;
  flex-flow: column;
  /*max-width:450px;*/
  padding-bottom:10px;
}

.Input__Main {
  padding:6px 10px;
  min-width:250px;
  width:100%;
}

.Label__Input {
  margin-bottom:4px;
}

.Settings__Info {
  position: fixed;
  bottom:0;
  font-style: italic;
  margin-bottom:15px;
}

.Button__Main {
  padding:6px 10px;
  background-color: white;
  cursor: pointer;
}

.Button__Save {
  position: fixed;
  bottom:20px;
  width:200px;
}

.Button__Save:disabled, .Button__Save:disabled:hover {
  border: 1px solid #dfdfdf;
  color: #dfdfdf;
}

.ChangeKeys {
  margin-left:15px;
  margin-top:10px;
  height:40px
}
</style>
