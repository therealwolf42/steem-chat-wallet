<template>
  <div id="wrapper"  @contextmenu.prevent="$refs.ctxMenu.open">
    <intro v-if="(!Username || loading) && !showSettings" class="Root__Intro"/>
    <settings v-if="showSettings" class="Root__Settings"/>
    <main>
      
      <div class="Wrapper__Top">
        <!--<server class="Root__Server"/>-->
      </div>
      <div v-if="!loading" class="Wrapper__Main">
        <div class="Wrapper__Left">
          <search v-if="Username" class="Root__Search"/>
          <users class="Root__Users"/>
          <Unlock v-if="clickedUnlock && Username" class="Root__Unlock"/>
          <account v-if="Username" class="Root__Account"/>
        </div>
        <chat v-if="Username" class="Root__Chat"/>
      </div>
    </main>
    <context-menu id="context-menu" ref="ctxMenu">
      <li class="ctx-header">Options</li>
        <li class="ctx-item" @click="removeNotifications()">Remove All Notifications</li>
    </context-menu>
  </div>
</template>

<script>
import Unlock from './Root/unlock.vue'
import settings from './Root/settings'
import search from './Root/search'
import account from './Root/account'
import users from './Root/users'
import intro from './intro/intro'
//import server from './Root/server'
import chat from './Root/chat'
import contextMenu from 'vue-context-menu'

import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'showSettings',
      'Username',
      'clickedUnlock',
      'loading'
    ])
    },
    name: 'root',
    created() {
    },
    components: { account, users, chat, search, settings, intro, Unlock, contextMenu },
    methods: {
      removeNotifications() {
        this.$store.commit('setNotifications', [])
        this.$store.commit('setBadge')
      }
    }
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

:root {
  --main-color: #06D6A9;
  --main-color-light: rgb(33, 209, 156);
  --main-color-lighter: rgb(36, 235, 175);
  --main-color-dark: rgb(28, 172, 129);
  --main-color-darker: rgb(28, 173, 130);
  --main-color-red: #fc3b68;
  --main-color-red-light: #ff6388;
}



* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body { font-family: 'Source Sans Pro', sans-serif; }

#wrapper {
  background-color:white;
  height: 100vh;
  width: 100vw;
  overflow-y: hidden;
}

.Wrapper__Main {
  display: flex;
}

.Root__Unlock {
  position:absolute;
  bottom:75px;
  left:20px;
}

.Root__Intro {
  position: fixed;
  top:0;
  left:0;
  height:calc(100%);
  width:100%;
}

.Root__Chat {
  flex:1;
  position: absolute;
  top: 0;
  right: 0;
  left: 220px;
  bottom: 0;
  overflow-y: hidden;
}

.Wrapper__Left {
  display:flex;
  flex-flow:column;
}

.Root__Search {
  display:flex;
  position: absolute;
  top:0;
  height:40px;
  flex: 1;
  width: 200px;
}

.Root__Users {
  flex: 1;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 1;
  overflow-y: scroll;
  height:calc(100vh - 130px);
  width: 200px;
  background-color: white;
  margin-top:55px;
}

.Root__Account {
  position: absolute;
  overflow-y: hidden;
  bottom:0;
  height:50px;
  z-index:11000;
}

/* Scrollbar */

.scrollbar__small::-webkit-scrollbar, .Root__Users::-webkit-scrollbar {
  width: 4px;
  background-color: white;
}

.scrollbar__medium::-webkit-scrollbar, .Textarea textarea::-webkit-scrollbar, .Blacklist__Container::-webkit-scrollbar {
  width: 6px;
  background-color: white;
}

.scrollbar__large::-webkit-scrollbar, .ChatHistory__Main::-webkit-scrollbar  {
  width: 10px;
  background-color: white;
}

.scrollbar__main::-webkit-scrollbar-thumb, .Root__Users::-webkit-scrollbar-thumb, .ChatHistory__Main::-webkit-scrollbar-thumb,
.Textarea textarea::-webkit-scrollbar-thumb,  .Blacklist__Container::-webkit-scrollbar-thumb {
    background-color: rgba(221, 221, 221, 0.92)
}

.scrollbar__main::-webkit-scrollbar-track, .Root__Users::-webkit-scrollbar-track, .ChatHistory__Main::-webkit-scrollbar-track,
.Textarea textarea::-webkit-scrollbar-track,  .Blacklist__Container::-webkit-scrollbar-track {
    background-color: white;
}
​

.Wrapper__Top {
  position: absolute;
  top: 0;
  right:0;
  z-index: 500;
}

.Textarea textarea {
  overflow-y: hidden;
  max-height:160px;
  font-size:1.1rem;
  min-height:80px;
  resize:none;
  font-family:'Source Sans Pro', sans-serif;
}

:focus {
  outline:none;
}

.Btn__Special {
  color: #fff;
  /*background-image: linear-gradient(90deg,#00aeff,#3369e7);*/
  background-color: var(--main-color);
  border-color:#c5d9e8;
  display: inline-block;
  padding: 6px 16px;
  outline: 0;
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
  border: 1px solid var(--main-color);
  border-radius: 4px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
}

.Btn__Special:hover {
  background-color: var(--main-color-light);
}

.Btn__Special:disabled {
  opacity: 0.7;
}

.Root__Settings {
  width:100%;
  height:100vh;
  z-index: 1000;
  background-color: white;
  position:fixed
}

.Color__Main {
  border: 1px solid var(--main-color);
  color: var(--main-color);
}

.border__round {
  border-radius:4px;
  border: 0.9px solid #dfdfdf;
}

.border__round__medium {
  border-radius:4px;
  border: 1px solid #dfdfdf;
}

.hover__blue:hover {
  border: 1px solid var(--main-color);
  color: var(--main-color);
}

.hover__fill:hover, .highlighted {
  border: 1px solid var(--main-color);
  color: white;
  background-color: var(--main-color);
}

/*green: 1FBF8F blue: 2181ef*/

.hover__red:hover {
  border: 1px solid #ff507a;
  color: #ff507a;
}

input:disabled {
  background-color: white;
  opacity: 0.6;
}

.disabled {
  opacity: 0.5;
}

.Key__Circle__Container {
  display:flex;
  margin-top: 10px;
  align-items:center;
  margin-left:6px;
}

.Key__Circle__Label {
  margin-left:4px;
}

.Key__Circle {
  width: 2em;
  height: 2em;
  margin-top: 2px;
  margin-left:2px;
  fill: #7b7b7b;
  padding-bottom:1px;
}

.Key__Circle__on {
  fill: var(--main-color);
}

.Search__Button {
  display:flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-top: 1px solid #dfdfdf;
  border-bottom: 1px solid #dfdfdf;
  border-right: 1px solid #dfdfdf;
  border-radius:0 4px 4px 0;
  padding-right:10px;
  cursor: pointer;
}

/* Search Button */

.Search__Button svg {
  width: 1.8em;
  height: 1.8em;
  fill: #7b7b7b;
  cursor: pointer;
  transform: rotate(43deg);
}

.Search__Button svg path {
  fill: #7b7b7b;
}

.Search__Button:hover svg path {
  fill: var(--main-color);
}

.Heading {
  font-weight:700;
  font-size:1.2rem;
  margin-bottom:10px;
}

h2 {
  font-weight:700;
  font-size:1rem;
}

a {
  text-decoration: none;
  color: var(--main-color);
  cursor: pointer;
}

.Color__Red {
  background-color: var(--main-color-red);
  border-color: var(--main-color-red);
}

.Color__Red:hover {
  background-color: var(--main-color-red-light);
  border-color: var(--main-color-red-light);
}

.changed {
  border: 1px solid var(--main-color);
}
</style>
