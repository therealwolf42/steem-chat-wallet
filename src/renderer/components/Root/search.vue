<template>
  <div class="Search__Main">
    <input  @keyup.enter="go()" class="Search__Input" placeholder="Start Conversation" v-model="search_input">
    <div class="Search__Button" @click="go()">
      <svg viewBox="0 0 20 20" >
        <path d="M17.218,2.268L2.477,8.388C2.13,8.535,2.164,9.05,2.542,9.134L9.33,10.67l1.535,6.787c0.083,0.377,0.602,0.415,0.745,0.065l6.123-14.74C17.866,2.46,17.539,2.134,17.218,2.268 M3.92,8.641l11.772-4.89L9.535,9.909L3.92,8.641z M11.358,16.078l-1.268-5.613l6.157-6.157L11.358,16.078z"></path>
      </svg>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'users',
      'currentTransfers',
      'hidelist'
    ]),
  },
  data() {
    return {
      search_input: '',
      clicked: false
    }
  },
  methods: {
    async go() {
      if(this.clicked) return
      this.clicked = true
      let name = this.search_input
      if(name.length < 3) {
        console.error('Username too short')
        this.$Message.error('Name too short')
        this.clicked = false
        return
      }

      let account = await this.$store.dispatch('getSteemAccount', name)
      if(!account) {
        console.error('Invalid Username')
        this.$Message.error('Not a valid user')
        this.clicked = false
        return
      }

      if(this.hidelist.indexOf(name) > -1) {
        this.$store.commit('removeHidelistUser', name)
        this.$store.commit('setTransfers', { transfers: this.currentTransfers, updating: false })
      }
      let selected_user = this.users.filter(x => x.main_user === name)[0]
      selected_user = selected_user ? selected_user : { main_user: name, last_transfer: 0, transfers: [] }
      this.$store.commit('setSelectedUser', selected_user )
      this.search_input = ''
      this.clicked = false
    }
  }
}
</script>

<style>
.Search__Main {
  margin:5px 8px;
  display: flex;
}

.Search__Input {
  padding:10px 10px;
  width:calc(100% - 50px);
  font-size:0.9rem;
  border: 1px solid #dfdfdf;
  border-right-color: white;
  border-radius:4px 0 0 4px;
}
</style>
