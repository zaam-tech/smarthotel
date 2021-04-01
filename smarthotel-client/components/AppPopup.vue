<template>
  <div
    id="popup"
    :class="{ success, error: !success }"
    class="errors"
    v-show="show"
  >
    <span class="material-icons close" @click="hidePopup">close</span>
    <div class="header" v-show="!success">
      <span class="material-icons">warning</span>
      <h2>There was an error</h2>
    </div>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import Vue from 'vue'
import { bus } from '../layouts/default.vue'
export default {
  data() {
    return {
      message: 'This action failed',
      success: false,
      show: false,
    }
  },
  methods: {
    hidePopup() {
      this.show = false
      this.success = false
      this.message = 'This Action Failed'
    },
  },
  created() {
    bus.$on('showPopup', (data) => {
      const { message, success } = data
      this.message = message
      this.success = success
      this.show = true
      setTimeout(() => {
        this.message = ''
        this.success = null
        this.show = false
      }, 7000)
    })
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#popup {
  background: var(--white);
  border-radius: 5px;
  position: fixed;
  border: 1px solid var(--deep-red);
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 10px;
  width: 25em;
  color: var(--black);
  z-index: 500;
}
.popup {
  @include flex;
  @include center;
  @include relative;
  height: 100%;
  text-align: center;
  padding: 0.75em;
  h2 {
    font-size: 25px;
  }
  p {
    font-size: 13px;
  }
  .warning {
    margin-right: 1em;
  }
}
#popup.error {
  border-color: var(--deep-red);
  .close {
    color: var(--white);
    background: var(--deep-red);
  }
}
#popup.success {
  border-color: var(--green);
  .close {
    color: var(--white);
    background: var(--green);
  }
  .header{
    color:var(--green);
  }
}
.close {
  @include absolute;
  top: -10px;
  right: -10px;
  cursor: pointer;
  border-radius: 50%;
  font-size: 14px;
  padding: 5px;
}
</style>
