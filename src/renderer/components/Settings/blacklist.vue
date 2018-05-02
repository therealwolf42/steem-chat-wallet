<template>
  <div class="SettingsTopic__Main">
    <div class="SettingsTopic__Partial">
      <p class="Heading">Blacklisted Users</p>
      <p>Click on the name to remove from blacklist</p>
      <div class="Blacklist__Container">
        <div class="Blacklist__User hover__red" v-for="user in blacklist" :key="user" @click="remove(user)">
          {{ user }}
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
      'User',
      'blacklist'
    ])
  },
  data() {
    return {
      user: '',
      memo: '',
      active: '',
      changed: false
    }
  },
  methods: {
    remove(user) {
      this.changed = true
      this.$store.commit('removeBlacklistUser', user)
    },
    save() {
      this.$store.commit('setBlacklistDB')
      this.$Message.success('Saved')
    }
  }

}
</script>

<style>
.Blacklist__Container{
  position: absolute;
  z-index: 1;
  top:60px;
  height:calc(100% - 150px);
  width:300px;
  overflow-y: auto;
  padding:10px;
  border-top: 0.5px solid #dfdfdf;
  border-bottom: 0.5px solid #dfdfdf;
}

.Blacklist__User {
  cursor: pointer;
  border:none !important;
}

.Blacklist__User {

}
</style>
