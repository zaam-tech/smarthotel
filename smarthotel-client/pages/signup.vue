<template>
  <section>
    <app-popup />
    <div id="form" :class="{ mbtop: !show }">
      <keep-alive>
        <component :is="component"></component>
      </keep-alive>
    </div>
    <app-footer />
  </section>
</template>

<script>
import Vue from 'vue'
import AppPopup from '../components/AppPopup.vue'
import AppFooter from '../components/AppFooter.vue'
import { bus } from '../layouts/default.vue'
import TheSignupForm from '../components/TheSignupForm.vue'
import TheVerifyForm from '../components/TheVerifyForm.vue'
import Loading from '../components/loading/index'
import { mapGetters, mapActions } from 'vuex'
export default {
  head() {
    return {
      title: 'Smart hotel | Signup',
    }
  },
  components: {
    AppPopup,
    AppFooter,
    Loading,
    TheSignupForm,
    TheVerifyForm,
  },
  data() {
    return {
      component: 'Loading',
      show: false,
    }
  },
  mounted() {
    if (process.title === 'browser' && localStorage) {
      const form = localStorage.getItem('form')
      if (form) {
        this.component = form
      } else {
        this.component = 'TheSignupForm'
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';

.close {
  @include absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
  color: #0055ff;
}
.btn + p {
  margin-top: 10px;
  width: 90%;
  line-height: 1.5rem;
  padding: 10px 0;
}
.link {
  color: #0055ff;
  margin-top: 10px;
  cursor: pointer;
  font-weight: bold;
}
/*Mobile Styles*/

@media screen and (max-width: 1100px) {
  form {
    width: 50%;
  }
}
@media screen and (max-width: 850px) {
  form {
    width: 80%;
  }
}
</style>
