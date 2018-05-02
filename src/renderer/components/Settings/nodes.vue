<template>
  <div class="SettingsTopic__Main">
    <p class="Heading">Node Settings</p>
    <div class="SettingsTopic__Partial">
      <p class="Label__Input">Current Node</p>
      <input class="Input__Main  border__round" :value="currentNode" disabled="true">
    </div>
    <div class="Node__Container">
      <h2 class="Label">Available Nodes</h2>
      <p class="Label__Input">Select an available node (for example: if you aren't able to update your messages or send messages)</p>
       <div class="Nodes__Container scrollbar__main scrollbar__medium">
        <div @click="select(node)" v-if="node !== currentNode" class="Node hover__blue" v-bind:class="{ selectedBlue: node === selected_node }" v-for="node in nodes" :key="node">
          <div >{{ node }}</div>
        </div>
       </div>
       
    </div>
    <div class="SettingsTopic__Partial" style="position:absolute; bottom:15px;">
      <p class="Label__Input">Custom Node (enter a custom node with https here)</p>
      <input class="Input__Main  border__round" v-model="selected_node">
    </div>
    <button class="Button__Save Button__Main border__round__medium hover__blue"  
            v-bind:class="{ changed: changed }" @click="save()">Save</button>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'currentNode',
      'nodes'
    ])
  },
  data() {
    return {
      selected_node: '',
      changed: false
    }
  },
  methods: {
    select(node) {
      this.changed = true
      this.selected_node = node
    },
    save() {
      if(this.selected_node.includes('api.steemit.com')) return this.$Message.error('This node is causing problems with the Messenger.')
      if(!this.selected_node) return
      this.$store.commit('setCurrentNode', this.selected_node)
      this.$store.commit('setCurrentNodeDB', this.selected_node)
      this.changed = false
    }
  }
}
</script>

<style>

.Node__Container {

}

.Node {
  padding:5px 0;
  border: none !important;
  cursor: pointer;
}

.Nodes__Container {
  position: absolute;
  z-index: 1;
  top:155px;
  height:calc(100% - 265px);
  width:calc(100% - 30px);
  overflow-y: auto;
  padding:10px;
  border-top: 0.5px solid #dfdfdf;
  border-bottom: 0.5px solid #dfdfdf;
  margin-top:10px;
}
</style>
