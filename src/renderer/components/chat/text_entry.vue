<template>
    <div class="Textarea">
      <textarea  v-model="message" v-autoresize rows="1" class=""></textarea>
      <div class="Options__Main">
        <div class="Options__Button__Container">
          <div class="Options__ConfCancel__Container" v-if="clicked">
            <div class="Options__Confirm" v-if="clicked" @click="confirm()" v-bind:class="{ disabled: waiting }">Confirm: {{ amount }} {{ currency }}</div>
            <div class="Options__Cancel" v-if="clicked" @click="cancel()" v-bind:class="{ disabled: waiting }">Cancel</div>
          </div>
          <button class="Btn__Special" :disabled="clicked" @click="send()">Send</button>
        </div>
        <div style="display:flex;justify-content:center; align-items:center; margin:2px 0;">
          <input type="checkbox" v-model="useEncrypt"/> <span style="margin-left:5px;">Encrypt</span>
        </div>
        <div class="Options__TransferAmount">
          <input class="Options__Amount" v-bind:class="{ higherAmount: amount > 0.001 }" type="number" v-model="amount" @change="changedAmount()" lang="en-US" title="asd">
          <div class="Options__Currency__Container">
            <div style="margin-right:3px;" class="Options__Currency" v-bind:class="{ selected: currency === 'SBD' }" @click="changeCurrency('SBD')">SBD</div>
            <div class="Options__Currency" v-bind:class="{ selected: currency === 'STEEM' }"  @click="changeCurrency('STEEM')">STEEM</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import * as steem from 'steem'

export default {
  computed: {
    ...mapGetters([
      'currentAccount',
      'memo_key',
      'memo_key_decrypted',
      'active_key',
      'active_key_decrypted',
      'users',
      'selectedUser',
      'settings',
      'Unlocked'
    ])
  },
  data() {
    return {
      useEncrypt: true,
      amount: 0.001,
      currency: 'SBD',
      clicked: false,
      message: '',
      waiting: false
      //amountRegex = /^[0-9]*\.?[0-9]{0,3}$/;
    }
  },
  methods: {
    changeEncrypt() {
      this.useEncrypt = !this.useEncrypt
    },
    changedAmount() {
      if(this.amount <= 0) this.amount = 0.001
    },
    changeCurrency(currency) {
      this.currency = currency
    },
    send() {
      this.amount = Number(this.amount)
      if(this.amount > 0 && !this.waiting) {
        this.clicked = true
      }
    },
    async confirm() {
      try {
        if(!this.Unlocked) {
          return this.$Message.error('Please unlock first')
        }
        if(this.waiting) return
        this.waiting = true
        if(this.useEncrypt && !this.memo_key_decrypted) {
          console.error('Missing Memo Key')
          this.$Message.error('Missing Memo Key')
          this.clicked = this.waiting = false
          return
        }
        if(!this.active_key_decrypted) {
          console.error('Missing Active Key')
          this.$Message.error('Missing Active Key')
          this.clicked = this.waiting = false
          return
        }
        this.clicked = false
        let memo = this.message
        if(this.message.length > 0 && this.useEncrypt) {
          let other_account = await this.$store.dispatch('getSteemAccount', this.selectedUser.main_user)
          memo = steem.memo.encode(this.memo_key_decrypted, other_account.memo_key, '# ' + this.message)
        }
        
        let result = await this.$store.dispatch('transfer', { amount: this.amount, asset: this.currency, memo })
        this.waiting = false
        if(result) {
          this.amount = Number(this.settings.amount)
          this.message = ''
          await this.$store.dispatch('updateTransfers', { first: false })
          this.$store.commit('updateSelectedUser', this.selectedUser)
        }
        
      } catch (error) {
        this.$Message.error(error.message)
        this.waiting = false
        this.clicked = false
      }
      
    },
    cancel() {
      if(this.waiting) return
      this.clicked = false
    }
  },
  created() {
    this.amount = this.settings.amount
    this.currency = this.settings.default_currency
    this.useEncrypt = this.settings.use_encrypt
  },
  watch: {
  }
}
</script>

<style>
.Textarea {
  display:flex;
  margin:5px 10px;
  align-items:center;
}

textarea {
  padding:5px 10px;
  width:100%;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
}

.Options__Main {
  width:200px;
  display:flex;
  flex-flow:column;
  padding:0 10px;
}

.Options__Encrypt {
  display:flex;
  align-items: center;
  justify-content: center;
  padding:3px 0;
}

.Options__Encrypt input {
  margin-right:5px;
}

.Options__TransferAmount {
  display:flex;
}

.Options__Currency__Container {
  display:flex;
  align-items: center;
}

.Options__Currency {
  cursor: pointer;
  padding:4px 8px;
  border-radius:4px;
  border: 1px solid #dfdfdf;
  opacity: 0.4;
  font-weight:700;
  font-size:0.8rem;
}

.Options__Amount {
  padding:5px 10px;
  border-radius:4px;
  border: 1px solid #dfdfdf;
  width:75px;
  margin-right:5px;
  opacity: 0.4;
}

.Options__Button__Container {
  position: relative;
  display:flex;
  justify-content: center;
}

.Options__ConfCancel__Container {
  position: absolute;
  top:-110px;
  left:0;
  padding:0 8px;
  padding-top:10px;
  height:88px;
  width:100%;
  background-color: white;
  border-radius:4px;
}

.Options__Button__Container button {
  width:100%;
}

.Options__Confirm, .Options__Cancel {
  padding:5px 10px;
  min-width:160px;
  text-align: center;
  position: absolute;
  font-weight:700;
  border: 1px solid #dfdfdf;
  border-radius:4px;
  cursor: pointer;
  background-color: white;
}

.Options__Confirm {
  top:10px;
  border: 1px solid var(--main-color);
  color: var(--main-color);
  opacity:0.7;
}

.Options__Confirm:hover {
  border: 1.5px solid var(--main-color);
  background-color: var(--main-color);
  color:white;
  opacity: 1;
}

.Options__Cancel {
  top:50px;
  border: 1px solid #f37895;
  color: #f87896;
  
  opacity:0.7;
}

.Options__Cancel:hover {
  border: 1.5px solid #ff507a;
  background-color: #ff507a;
  color:white;
  opacity:1;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

.higherAmount {
  font-weight:700;
}

.selected {
  opacity: 0.75;
}

</style>
