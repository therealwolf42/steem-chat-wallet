<template>
  <div style="z-index:11000;">
  <div class="Intro__Main">
    <img class="Intro__Logo" src="../../assets/logo.png">
    <h2 style="font-size:1.3rem;">Steem Messenger Beta v1.0</h2>
    <div style="font-size:1.1rem;">Messenger for the Steem Blockchain</div>
    <div style="margin-top:10px;font-size:1rem;">Developed by <a @click="open('http://steemit.com/@therealwolf')">@therealwolf</a> with funding from <a @click="open('https://smartsteem.com')">smartsteem.com</a></div>

    <h2 style="margin-top:15px;" v-if="loading">Loading ...</h2>
    <button v-if="!Username && !loading" id="show-modal" @click="show(true)" style="margin-top:20px; font-weight:500; width:200px;" class="Btn__Special" >GET STARTED</button>
    <modal v-if="showModal" @clicked="start" @close="show(false)">
      <h3 slot="header">Important: User Agreement </h3>
      <div slot="body">
        <p>Please read carefully through these paragraphs. By using Steem Messenger, you agree to have read, understood and accepted the following terms.</p>
        <div class="divider"></div>
        <p class="modal__sentence"> - Steem Messenger is currently in Beta. While careful development and testing has been done, @therealwolf or smartsteem.com cannot be held liable for unknown issues, loss of funds (SBD & STEEM) or mistakes made by the user.</p>
        <p class="modal__sentence"> - All messenges send through Steem Messenger are publicy available on the Steem blockchain - either in encrypted or un-encrypted format.</p>
      </div>
    </modal>
  </div>


    <div v-if="false" class="Arrow__Main">
      <h2 style="font-size:1.4rem;color:var(--main-color)">START HERE</h2>
      <img src="../../assets/arrow.png"/>
    </div>
  </div>
</template>

<script>
import { shell } from 'electron'
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'showModal',
      'agreedTerms',
      'Username',
      'loading'
    ])
  },
  methods: {
    open(link) {
      shell.openExternal(link)
    },
    show(status) {
      if(this.agreedTerms) {
        this.$store.commit('setShowSettings')
      } else {
        this.$store.commit('setShowModal', status)
      }
      
    },
    start(status) {
      if(status) {
        this.$store.commit('setShowModal', false)
        this.$store.commit('setAgreedTerms', true)
        this.$store.commit('setAgreedTermsDB', true)
        this.$store.commit('setShowSettings')
      }
      //this.$store.commit('setShowSettings')
    }
  }
}
</script>

<style>
.Intro__Main {
  display:flex;
  align-items: center;
  justify-content: center;
  flex-flow:column;
  z-index:10000;
  height:100%;
  /*margin-top:-50px;*/
}

.Intro__Logo {
  /*margin-top:-80px;*/
  height:150px;
  margin-bottom:10px;
}

.Arrow__Main {
  position: fixed;
  left:50px;
  bottom:50px;
}

.Arrow__Main img {
  width:26px;
  margin-left:17px;
}

.divider {
  margin-top:10px;
  margin-bottom:10px;
  border-top:0.5px solid black;
  opacity: 0.5;
}

.modal__sentence {
  margin-top:10px;
}
</style>
