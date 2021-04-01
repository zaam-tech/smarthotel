<template>
  <section>
    <AppPopup />
    <div id="form">
      <div class="errors" v-if="errors.length">
        <div class="header">
          <span class="material-icons">warning</span>
          <h2>There was an error</h2>
        </div>
        <ul>
          <li v-for="error in errors" :key="error.id">{{ error.message }}</li>
        </ul>
      </div>
      <form @submit.prevent="submit">
        <h1>Password Assistance</h1>
        <p>
          Enter the email address or phone number associated with your Smart
          Hotel account
        </p>
        <div class="input-group mb">
          <label for="email">Email or mobile phone number</label>
          <input type="text" class="input" name="email" v-model="email.model" />
        </div>
        <button class="btn" @click="handleSubmit">Continue</button>
        <h3>Has your email or phone number changed?</h3>
        <p>
          If you no longer use the email address associated with your Smart
          Hotel account, you may contact
          <nuxt-link to="/report">Customer Service</nuxt-link> for help
          restoring your account.
        </p>
      </form>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import { bus } from '../layouts/default.vue'
import { mapState, mapActions } from 'vuex'
import AppPopup from '@/components/AppPopup'
import { v4 } from 'uuid'
import validateEmail from '~/utilities/validateEmail'
export default {
  components: {
    AppPopup,
  },
  data() {
    return {
      errors: [],
      email: {
        invalid: false,
        model: '',
      },
    }
  },
  computed: mapState(['auth']),
  methods: {
    handleSubmit() {},
    ...mapActions({
      getOtpForPasswordReset: 'auth/getOtpForPasswordReset',
    }),
    setErrors() {
      this.errors = []
      if (!validateEmail(this.email.model)) {
        this.errors.push({
          id: v4(),
          message: 'Enter your email address',
        })
      } else {
        this.errors = this.errors.filter(
          (error) => error.message.indexOf('email') === -1
        )
      }
    },
    async submit() {
      this.setErrors()
      if (!this.errors.length) {
        const { email } = this
        try {
          if (process.title === 'browser' && localStorage) {
            localStorage.setItem('email', email.model)
          }
          await this.getOtpForPasswordReset(email.model)
          bus.$emit('showResForm', 'TheVerifyOtpForm')
        } catch (error) {
          bus.$emit('showPopup', {
            message: `${error.message}`,
            success: false,
          })
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#form {
  @include flexColCenterBoth;
  margin: 10rem 0 2rem 0;
}

form {
  @include form-variant;
  p {
    margin: 0.5em 0;
  }
  h3 {
    margin: 1em 0;
    font-weight: normal;
  }
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
