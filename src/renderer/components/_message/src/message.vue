<template>
  <div
    class="at-message__wrapper"
    :style="{
      top: top ? `${top}px` : 'auto'
    }">
    <transition name="move-up" @after-leave="doDestory">
      <div
        class="at-message"
        :class="{
          [`at-message--${type}`]: type
        }"
        v-show="visible">
        <i class="icon at-message__icon" :class="iconClass"></i>
        <span class="at-message__content">{{ message }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        message: '',
        duration: 2000,
        type: 'info',
        icon: '',
        visible: false,
        timer: null,
        closed: false,
        onClose: null,
        top: null
      }
    },
    computed: {
      iconClass () {
        const classArr = {
          'success': 'icon-check-circle',
          'error': 'icon-x-circle',
          'warning': 'icon-alert-circle',
          'info': 'icon-info',
          'loading': 'icon-loader'
        }

        return this.icon || classArr[this.type]
      }
    },
    watch: {
      closed (val) {
        if (val) {
          this.visible = false
        }
      }
    },
    methods: {
      doDestory () {
        this.$destroy(true)
        this.$el.parentNode.removeChild(this.$el)
      },
      close () {
        this.closed = true
        if (typeof this.onClose === 'function') {
          this.onClose(this)
        }
      },
      startTimer () {
        if (this.duration) {
          this.timer = setTimeout(() => {
            !this.closed && this.close()
          }, this.duration)
        }
      },
      clearTimer () {
        this.timer && clearTimeout(this.timer)
      }
    },
    mounted () {
      this.startTimer()
    }
  }
</script>

<style>
.at-message {
  display: inline-block;
  padding: 6px 16px;;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 1px 8px rgba(0, 0, 0, .15);
  z-index: 1500;
}

.at-message__wrapper {
    position: fixed;
    left: 5px;
    top: 16px;
    width: 100%;
    text-align: center;
    /*transition: opacity .3s, transform .3s, top .4s;*/
    pointer-events: none;
  }
  .at-message__icon {
    display: inline-block;
    margin-right: 4px;
    vertical-align: middle;
}

.at-message__content {
  flex: 1;
  padding-right: 8px;
}

.at-message--success {
    background-color: white;
    border: 1px solid var(--main-color);
    color: var(--main-color);
  }

  .at-message--info {
    background-color: white;
    border: 1px solid #c0c0c0;
    color: #c0c0c0;
  }

  .at-message--error {
    background-color: white;
    border: 1px solid #ff507a;
    color: #ff507a;
  }
  .at-message--warning {
    border: 1px solid var(--main-color);
    color: var(--main-color);
    background-color: white;
  }
  .at-message--info {
    color: blue;
  }
  .at-message--loading {
    color: yellow;
    animation: icon-loading 2s linear infinite both;
  }

  .at-message--success {
    
  }

</style>
