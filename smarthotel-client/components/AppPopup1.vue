<template>
  <div
    id="popup"
    :class="{ success, error: !success }"
    class="errors"
    v-show="show"
  >
    <div class="header">
      <span class="material-icons">check</span>
      <h2>Success</h2>
    </div>
    <ul>
      <li>{{ message }}</li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'
import { bus } from '../layouts/default.vue'
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    success: {
      type: Boolean,
      required: true,
    },
  },
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
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#popup {
  background: var(--white);
  border-radius: 5px;
  border: 1px solid var(--red);
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
  border-color: var(--red);
  .close {
    color: var(--white);
    background: var(--red);
  }
}
#popup.success {
  border-color: var(--green);
  .close {
    color: var(--white);
    background: var(--green);
  }
}
</style>
