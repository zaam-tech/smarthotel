<template>
  <div id="form">
    <h1 class="heading"><span class="name">Smart Hotel</span> Account</h1>
    <form @submit.prevent="handleSubmit" :class="{ signupform: !show }">
      <h1>Create new password</h1>
      <p>We'll ask for this password whenever you Sign-In</p>
      <div class="input-group mb">
        <label>New password</label>
        <input
          type="password"
          class="input"
          name="password"
          placeholder="At least 6 characters"
          v-model="password.model"
          :class="{
            valid: password.model && !password.invalid,
            invalid: password.model && password.invalid,
          }"
        />
        <p>
          <span class="material-icons">info</span> Password must be at least 6
          characters
        </p>
        <p class="error" v-show="passwordError">{{ passwordError }}</p>
      </div>
      <div class="input-group mb">
        <label>Re-enter password</label>
        <input
          type="password"
          class="input"
          name="RePassword"
          v-model="rePassword.model"
          @change="validatePassword($event)"
        />
        <p class="error" v-show="rePasswordError">Passwords have to match</p>
      </div>
      <button class="btn">Save Changes and Sign-In</button>
    </form>
    <div id="tips">
      <h2>Secure password tips:</h2>
      <ul>
        <li>
          Use at least 8 characters,a combination of numbers and letters is best
        </li>
        <li>Do not use the same password you have used with us previously</li>
        <li>
          Do not use dictionary words,your name,email address, mobile phone
          number or other personal information that can be easily obtained.
        </li>
        <li>Do not use the same password for multiple accounts</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { bus } from '../layouts/default.vue'
import { mapState, mapActions } from 'vuex'
import { v4 } from 'uuid'
import validatePassword from '../utilities/validatePassword'
export default {
  data() {
    return {
      errors: [],
      rePassword: {
        model: '',
        invalid: false,
        error: false,
      },
      password: {
        model: '',
        invalid: false,
        error: false,
      },
      passwordError: '',
      rePasswordError: '',
      show: false,
    }
  },
  methods: {
    ...mapActions({
      resetPassword: 'auth/resetPassword',
    }),
    async handleSubmit() {
      this.setErrors()
      if (!this.passwordError && !this.rePasswordError) {
        const { password } = this
        try {
          await this.resetPassword(password.model)
          bus.$emit('showResForm', 'AddPhoneForm')
        } catch (error) {
          bus.$emit('showPopup', {
            message: `${error.message}`,
            success: false,
          })
        }
      }
    },
    setErrors() {
      this.errors = []

      if (!validatePassword(this.password.model)) {
        this.passwordError =
          'Password should be a minimum of 6 characters and have at least 1 uppercase letter,1 lowercase letter,one number,1 special characters'
      } else {
        this.passwordError = ''
      }

      if (this.password.model !== this.rePassword.model) {
        this.rePasswordError =
          'Password should be a minimum of 6 characters and have at least 1 uppercase letter,1 lowercase letter,one number,1 special characters'
      } else {
        this.rePasswordError = ''
      }
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
  @include flexColCenter;
  margin: 8em 0 2rem 0;
  .heading {
    @include heading;
  }
}

form {
  @include form-variant;
  h3 {
    margin-top: 1em;
    margin-bottom: 0.5em;
    font-weight: normal;
  }
  p:not(.next) {
    @include relative;
    margin-top: 0.5em;
    @include flexCenterVariant;
    .material-icons {
      margin-right: 0.5em;
      position: unset !important;
    }
  }
}
#tips {
  max-width: 400px;
  margin-top: 1.5em;
  ul {
    padding-left: 1em;
    li {
      list-style-type: initial;
    }
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
