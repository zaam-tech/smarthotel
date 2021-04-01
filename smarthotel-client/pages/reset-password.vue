<template>
  <div id="reset">
    <keep-alive>
      <component :is="component"></component>
    </keep-alive>
    <AppFooter />
  </div>
</template>

<script>
import AppFooter from '../components/AppFooter.vue'
import AddPhoneForm from '../components/AddPhoneForm'
import AddNewPassForm from '../components/AddNewPassForm'
import TheResetPassForm from '../components/TheResetPassForm'
import TheVerifyOtpForm from '../components/TheVerifyOtpForm'
import { bus } from '../layouts/default'
export default {
  head() {
    return {
      title: 'Smart Hotel | Reset Password',
    }
  },
  components: {
    AppFooter,
    AddPhoneForm,
    AddNewPassForm,
    TheResetPassForm,
    TheVerifyOtpForm,
  },
  created() {
    bus.$on('showResForm', (form) => (this.component = form))
  },
  data() {
    return {
      component: 'TheResetPassForm',
    }
  },
}
</script>

<style lang="scss" scoped></style>
