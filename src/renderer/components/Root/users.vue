<template>
  <div v-if="users && selectedUser">
    <div class="users__main" v-for="user in users" :key="user.main_user" @click="selectUser(user)" v-bind:class="{ selectedUser: selectedUser.main_user === user.main_user }">
      <div  class="users__part users_name">{{ user.main_user }}</div>
      <img class="users__badge" v-if="(notifications.filter(x => x.main_user === user.main_user)).length > 0" src="../../assets/badges/badge.png"><!-- :src="getImagePath(notifications.filter(x => x.main_user === user.main_user))"-->
      <svg @click="hide(user.main_user)" class="Button__Ignore" viewBox="0 0 20 20">
				<path fill="none" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
			</svg>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import * as steem from 'steem'

export default {
  computed: {
    ...mapGetters([
      'users',
      'selectedUser',
      'blacklist',
      'notifications'
    ])
  },
  data() {
    return {
      name: this.$store.state.account.name,
      syncing: false,
      clicked_hide: false
    }
  },
  created() {
  },
  methods: {
    getImagePath(notifications) {
      if(notifications.length > 0) {
        notifications = notifications[0]
      }
      notifications = notifications.count > 9 ? `9+` : notifications.count
      return `../../assets/badges/badge_${notifications}.png`
    },
    hide(user) {
      this.clicked_hide = true
      this.$store.commit('hideUser', user)
      this.clicked_hide = false
    },
    selectUser(user) {
      if(this.clicked_ignore) return
      this.$store.commit('setSelectedUser', user)
      if((this.notifications.filter(x => x.main_user === user.main_user)).length > 0) {
        this.$store.commit('removeNotification', { main_user: user.main_user })
        this.$store.commit('setBadge')
      }
      
    }
  },
  filters: {
    
  },
}
</script>

<style>
.users__badge {
  width:15px;
  height:15px;
}

.users__main {
  display:flex;
  padding:8px 20px;
  cursor: pointer;
  align-items: center;
}

.users__main:hover, .selectedUser {
  background-color: rgba(0, 0, 0, 0.019);
  color: var(--main-color);
}

.users__part {
  flex:1;
}

.users__memo {
  flex:2;
}

.Button__Ignore {
  
}

.Button__Ignore {
  width: 1.2em;
  height: 1.2em;
  fill: #7b7b7b;
  cursor: pointer;
  opacity: 0;
  margin-left:8px;
}

.users__main:hover > .Button__Ignore {
  opacity: 1;
}

.Button__Ignore path {
  fill: #7b7b7b;
}

.Button__Ignore:hover path {
  fill: var(--main-color);
}
</style>
