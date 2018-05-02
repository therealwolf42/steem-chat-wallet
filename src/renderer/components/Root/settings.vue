<template>
  <div class="Settings__Main">
      <div class="Settings__Left">
        <div class="Settings__Left__inner">
          <div class="Settings__Topic" @click="selected = 'Account'" v-bind:class="{ selectedBlue: selected === 'Account' }">Accounts</div>
          <div class="Settings__Topic" @click="selected = 'Nodes'" v-bind:class="{ selectedBlue: selected === 'Nodes' }">Nodes</div>
          <div class="Settings__Topic" @click="selected = 'Blacklist'" v-bind:class="{ selectedBlue: selected === 'Blacklist' }">Blacklist</div>
          <div class="Settings__Topic" @click="selected = 'Settings'" v-bind:class="{ selectedBlue: selected === 'Settings' }">Settings</div>
        </div>
      </div>
      <div class="Settings__Right">
        <settingsAccount v-if="selected === 'Account'"/>
        <settingsNodes v-if="selected === 'Nodes'"/>
        <settingsBlacklist v-if="selected === 'Blacklist'"/>
        <settingsSettings v-if="selected === 'Settings'"/>
      </div>
      <button class="Settings__Exit border__round" @click="exitSettings()">X</button>
  </div>
</template>

<script>
import settingsAccount from '../Settings/account'
import settingsBlacklist from '../Settings/blacklist'
import settingsNodes from '../Settings/nodes'
import settingsSettings from '../Settings/settings'

export default {
  components: {
    settingsAccount, settingsBlacklist, settingsNodes, settingsSettings
  },
  data() {
    return {
      selected: 'Account'
    }
  },
  methods: {  
    exitSettings() {
      this.$store.commit('setShowSettings', false)
    }
  }
}
</script>

<style>
.Settings__Main {
  height:100%;
  width:100%;
  background-color: white;
}

.Settings__Exit {
  position: fixed;
  top: 0;
  right:0;
  margin-top:30px;
  margin-right:40px;
  background-color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  text-align: center;
  color:#979797;
  border:1.1px solid #979797;
  font-weight:400;
  cursor: pointer;
  z-index:1500;
}

.Settings__Exit:hover {
  border: 1px solid var(--main-color);
  color: var(--main-color);
}

.Settings__Left {
  position: absolute;
  top:0px;
  left:0px;
  width:150px;
  height:100%;
  background-color: #fbfbfb;
}

.Settings__Left__inner {
  padding:30px 15px;
  display:flex;
  flex-flow:column;
  align-items: center;
  height:100%;
}

.Settings__Right {
  position: absolute;
  top:0px;
  height:100%;
  width:calc(100% - 150px);
  left:150px;
  padding:30px 30px;
  z-index:1200;
}
.Settings__Topic {
  text-align:left;
  cursor: pointer;
  padding:5px 10px;
  margin:2px 0;
  width:100px;
  border-radius:6px;
}

.Settings__Topic:hover, .selectedBlue {
  color: var(--main-color);
}

</style>
