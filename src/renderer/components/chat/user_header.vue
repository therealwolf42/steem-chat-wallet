<template>
  <div class="UserHeader__Main" v-if="isSelected()">
    <div class="UserHeader__Name" @click="open(`https://steemit.com/@${selectedUser.main_user}`)" v-if="selectedUser">@ {{ selectedUser.main_user }}</div>
    <div class="UserHeader__Ignore" v-if="selectedUser" @click="ignore(selectedUser.main_user)">Ignore</div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { shell } from 'electron'

export default {
  computed: {
    ...mapGetters([
      'currentAccount',
      'User',
      'users',
      'selectedUser'
    ])
  },
  created(){
    this.selected_user = this.selectedUser
  },
  data() {
    return {
      selected_user: {}
    }
  },
  methods: {
    ignore(main_user) {
      this.$store.commit('ignoreUser', main_user)
    },
    open(link) {
      shell.openExternal(link)
    },
    isSelected() {
      try {
        return this.selectedUser.main_user
      } catch (e) {
        return false
      }
    }
  }
}
</script>

<style>
.UserHeader__Main {
  display:flex;
  flex-flow: row;
  align-items: center;
  padding:10px 10px;
  border-bottom: 1px solid #f7f7f7;
}

.UserHeader__Name {
  font-size: 1.15rem;
  font-weight:700;
  cursor: pointer;
}

.UserHeader__Name:hover {
  color: var(--main-color);
}

.UserHeader__Ignore {
  cursor: pointer;
  margin-left:20px;
  opacity: 0.4;
}

.UserHeader__Ignore:hover {
  opacity: 1;
}
</style>
