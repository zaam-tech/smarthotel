<template>
  <div id="add-password">
    <div id="form">
      <h1 class="heading"><span class="name">Smart Hotel</span> Account</h1>
      <form @submit.prevent="handleSubmit" :class="{ signupform: !show }">
        <AppPopup1 :message="message" :success="true" />
        <h1>Add mobile number</h1>
        <p>
          Add a mobile number to safeguard your Smart Hotel account. By
          enrolling your phone number, you consent to receive automated text
          messages from Smart Hotel related to account security. You can opt out
          of account security related messaging by removing your mobile number
          in the "Login & security" settings. Message and data rates may apply.
        </p>
        <div class="input-group mb">
          <input
            type="text"
            class="input"
            name="number"
            placeholder="At least 6 characters"
            v-model="number.model"
            :class="{
              valid: number.model && !number.invalid,
              invalid: number.model && number.invalid,
            }"
          />
        </div>
        <button class="btn">Add mobile number</button>
        <nuxt-link to="/">Not now</nuxt-link>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { bus } from '../layouts/default.vue'
import AppPopup1 from '../components/AppPopup1'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    AppPopup1,
  },
  data() {
    return {
      errors: [],
      message: 'Your password has been changed',
      number: {
        model: null,
        invalid: false,
        error: false,
      },
      show: false,
    }
  },
  methods: {
    ...mapActions({
      signupUser: 'auth/signupUser',
    }),
    async handleSubmit() {
      const { password, rePassword } = this
      const user = {
        password: password.model,
      }
      try {
        const res = await this.signupUser(user)
        const response = {
          message: 'User created successfully. Redirecting to login',
          success: true,
        }
        bus.$emit('showPopup', response)
      } catch (error) {
        const response = {
          message: `${error.message}`,
          success: false,
        }
        bus.$emit('showPopup', response)
        console.log(error)
      }
    },
    setErrors() {
      this.errors = []

      if (this.password.model.length < 6) {
        this.errors.push({
          id: v4(),
          message: 'password should be at  least 6 characters',
        })
      } else {
        this.errors = this.errors.filter(
          (error) => error.message.indexOf('characters') === -1
        )
      }
      if (this.password.model !== this.rePassword.model) {
        this.errors.push({
          id: v4(),
          message: 'passwords must match',
        })
      } else {
        this.errors = this.errors.filter(
          (error) => error.message.indexOf('characters') === -1
        )
      }

      if (!this.passwordReg.test(this.password.model)) {
        this.errors.push({
          id: v4(),
          message: 'password should be at  least 6 characters',
        })
      } else {
        this.errors = this.errors.filter(
          (error) => error.message.indexOf('password') === -1
        )
      }
      console.log(this)
    },
    validatePassword(event) {
      if (this.password.model === this.rePassword.model) {
        this.rePassword.invalid = false
        this.rePassword.error = false
      } else {
        this.rePassword.invalid = true
        this.rePassword.error = true
      }
    },
  },
  computed: {
    valid() {
      const { password, rePassword } = this
      if (
        password.model &&
        !password.invalid &&
        rePassword.model &&
        !rePassword.invalid
      ) {
        return true
      } else {
        return false
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
  .heading {
    @include heading;
  }
  h3 {
    margin-top: 1em;
    margin-bottom: 0.5em;
    font-weight: normal;
  }
  .btn + a {
    margin-top: 1em;
    text-align: center;
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
