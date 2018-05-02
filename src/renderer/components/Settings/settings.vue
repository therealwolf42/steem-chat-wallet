<template>
  <div class="SettingsTopic__Main">
    <div class="SettingsTopic__Partial">
      <p class="Heading">Settings</p>
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
          <input class="Input__Main Input__Interval border__round" type="number" v-model="interval"> Minutes
        </div>
        <div class="Settings__Part">
          <p class="Settings__Label">Unlock Timeout</p>
          <input class="Input__Main Input__Interval border__round" type="number" v-model="timeout"> Minutes
        </div>
      </div>
    </div>
    <p style="position:absolute; bottom:25px;opacity:0.7;">Please restart messenger after saving for changes to take effect</p>
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
      'User',
      'settings'
    ])
  },
  data() {
    return {
      use_smartsteem_blacklist: true,
      use_encrypt: true,
      default_currency: 'SBD',
      interval: 10,
      timeout: 60,
      changed: false,
      was_created: false
    }
  },
  created() {
    this.use_smartsteem_blacklist = this.settings.use_smartsteem_blacklist
    this.use_encrypt = this.settings.use_encrypt
    this.default_currency = this.settings.default_currency
    this.interval = this.settings.interval
    this.timeout = this.settings.timeout
    this.default_amount = this.settings.default_amount
  },
  methods: {
    remove(user) {
      this.changed = true
      this.$store.commit('removeBlacklistUser', user)
    },
    save() {
      if(this.interval < 1) return this.$Message.error('Minimum Interval: 1 Minute')
      let payload = {}
      payload.use_smartsteem_blacklist = this.use_smartsteem_blacklist
      payload.use_encrypt = this.use_encrypt
      payload.default_currency = this.default_currency
      payload.interval = this.interval
      payload.timeout = this.timeout
      payload.default_amount = this.default_amount
      this.$store.commit('updateSettings', payload)
      this.$Message.success('Saved')
      this.changed = false
    }
  }

}
</script>

<style>
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

.Input__Interval {
  text-align: center;
  min-width: 45px;
  width: 45px;
  margin-right:8px;
}

.Settings__Checkbox {
  margin-left:18px;
}
</style>
