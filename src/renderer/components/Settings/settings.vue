<template>
  <div class="SettingsTopic__Main">
    <div class="SettingsTopic__Partial">
      <p class="Heading">Settings</p>
      <p style="margin-bottom:15px;">Restart messenger after saving for changes to take effect</p>
      <div class="Settings__Settings">

        <div class="Settings__Part">
          <p class="Settings__Label">Use Smartsteem Blacklist</p>
          <input class="Settings__Checkbox" type="checkbox" v-model="use_smartsteem_blacklist"/>
        </div>

        <div class="Settings__Part Settings__Interval">
          <p class="Settings__Label">Default Encrypt Messages</p>
          <input class="Settings__Checkbox" type="checkbox" v-model="use_encrypt"/>
        </div>

        <div class="Settings__Part">
          <p class="Settings__Label">Default Currency</p>
          <select  class="Input__Main Select__Currency border__round" v-model="default_currency">
            <option value="SBD">SBD</option>
            <option value="STEEM">STEEM</option>
          </select>
        </div>

        <div class="Settings__Part Settings__Interval">
          <p class="Settings__Label">Update Interval</p>
          <input class="Input__Main Input__Small border__round" type="number" v-model="interval"> Minutes
        </div>

        <div class="Settings__Part">
          <p class="Settings__Label">Unlock Timeout</p>
          <input class="Input__Main Input__Small border__round" type="number" v-model="timeout"> Minutes
        </div>

        <div class="Settings__Part">
          <p class="Settings__Label">Share Settings below public</p>
          <input class="Settings__Checkbox" style="margin-right:5px;" type="checkbox" v-model="show_public"/>(this will update your account JSON-data)
        </div>

        <div class="Settings__Part">
          <p class="Settings__Label">Show Messages with at least</p>
          <input class="Input__Main Input__Small border__round" type="number" style="width:60px" v-model="min_visible"> SBD / STEEM
        </div>

        <div class="Settings__Part">
          <p class="Settings__Label">Desktop Notifications</p>
          <input class="Settings__Checkbox" type="checkbox" v-model="enabled_alert"/>
          <span style="margin:0 10px;">with at least</span>
          <input class="Input__Main Input__Small border__round" type="number" style="width:60px" v-model="min_alert"> SBD / STEEM
        </div>

      </div>
    </div>
    <button class="Button__Save Button__Main border__round__medium hover__blue"  
            v-bind:class="{ changed: changed }" @click="save()">Save</button>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import * as steem from 'steem'

export default {
  computed: {
    ...mapGetters([
      'Username',
      'settings',
      'Unlocked',
      'active_key_decrypted'
    ])
  },
  data() {
    return {
      saving: false,
      use_smartsteem_blacklist: true,
      use_encrypt: true,
      default_currency: 'SBD',
      interval: 10,
      timeout: 60,
      changed: false,
      was_created: false,
      min_visible: 0.001,
      enabled_alert: false,
      min_alert: 0.002,
      show_public: true
    }
  },
  created() {
    this.use_smartsteem_blacklist = this.settings.use_smartsteem_blacklist
    this.use_encrypt = this.settings.use_encrypt
    this.default_currency = this.settings.default_currency
    this.interval = this.settings.interval
    this.timeout = this.settings.timeout
    this.default_amount = this.settings.default_amount
    this.min_visible = this.settings.min_visible
    this.enabled_alert = this.settings.enabled_alert
    this.min_alert = this.settings.min_alert
    this.show_public = this.settings.show_public
  },
  methods: {
    remove(user) {
      this.changed = true
      this.$store.commit('removeBlacklistUser', user)
    },
    async save() {
      if(this.saving) return
      this.saving = true
      if(this.interval < 1) return this.$Message.error('Minimum Interval: 1 Minute')
      
      if(this.show_public
        && ( this.settings.show_public !== this.show_public
        || ((this.settings.min_visible !== this.min_visible
        || this.settings.enabled_alert !== this.enabled_alert
        || this.settings.min_alert !== this.min_alert)))) {
        if(!this.Unlocked) return this.$Message.error(`Please unlock first`)
        if(!this.active_key_decrypted) return this.$Message.error(`Please add your active-key`)
          await this.changeJSON()
      }
      this.updateSettings()
    },
    async changeJSON() {
      let account = await this.$store.dispatch('getSteemAccount', this.Username)
      let data = JSON.parse(account.json_metadata)
      data.messenger = {}
      //if(this.show_using) data.messenger.using_messenger = true
      data.messenger.min_visible = this.min_visible
      data.messenger.enabled_alert = this.enabled_alert
      if(this.enabled_alert) data.messenger.min_alert = this.min_alert
      await this.$store.dispatch('updateAccount', { account: account.name, memo_key: account.memo_key, json_metadata: JSON.stringify(data) })
    },
    updateSettings() {
      let payload = {}
      payload.use_smartsteem_blacklist = this.use_smartsteem_blacklist
      payload.use_encrypt = this.use_encrypt
      payload.default_currency = this.default_currency
      payload.interval = this.interval
      payload.timeout = this.timeout
      payload.default_amount = this.default_amount
      payload.min_visible = this.min_visible
      payload.enabled_alert = this.enabled_alert
      payload.min_alert = this.min_alert
      payload.show_public = this.show_public
      console.log(payload)
      this.$store.commit('updateSettings', payload)
      this.$Message.success('Saved')
      this.changed = false
      this.saving = false
    }
  }

}
</script>

<style>

.SettingsTopic__Main {
  height:90%;
}
.Settings__Part {
  display:flex;
  align-items: center;
  margin-bottom:20px;
}

.Select__Currency {
  width:90px;
  min-width:90px;
  text-align: center;
}

.Settings__Label {
  width:200px;
}

.Input__Small {
  text-align: center;
  min-width: 45px;
  width: 45px;
  margin-right:8px;
}

.Settings__Checkbox {
  margin-left:18px;
}
</style>
