<template>
  <div id="form">
    <h1 class="heading"><span class="name">Smart Hotel</span> Account</h1>
    <div class="errors" v-if="errors.length">
      <div class="header">
        <span class="material-icons">warning</span>
        <h2>There was an error</h2>
      </div>
      <ul>
        <li v-for="error in errors" :key="error.id">{{ error.message }}</li>
      </ul>
    </div>
    <form @submit.prevent="handleSubmit" :class="{ signupform: !show }">
      <h1>Create Account</h1>
      <div class="input-group mb">
        <label>Your name</label>
        <input
          type="text"
          class="input"
          name="name"
          v-model="$v.fullName.$model"
          :class="{
            valid: $v.fullName.$model && !$v.fullName.$invalid,
            invalid: $v.fullName.$model && $v.fullName.$invalid,
          }"
        />
      </div>
      <div class="input-group mb">
        <label>Email</label>
        <input
          type="text"
          class="input"
          name="email"
          v-model="email.model"
          @input="validateEmail($event)"
          :class="{
            valid: email.model && !email.invalid,
            invalid: email.model && email.invalid,
          }"
        />
      </div>
      <div class="input-group mb">
        <label>Password</label>
        <input
          type="password"
          class="input"
          name="password"
          placeholder="At least 6 characters"
          v-model="password.model"
          @input="validatePassword"
          :class="{
            invalid: password.model && password.invalid,
          }"
        />
        <p>
          <span class="material-icons">info</span> Password must be at least 6
          characters
        </p>
        <p class="error" v-show="passwordErrors.password">
          {{ passwordErrors.password }}
        </p>
      </div>
      <div class="input-group mb">
        <label>Re-enter password</label>
        <input
          type="password"
          class="input"
          name="rePassword"
          v-model="rePassword.model"
          @input="validateMatchPass"
          :class="{
            invalid: rePassword.model && rePassword.model !== password.model,
          }"
        />
        <p class="error" v-show="passwordErrors.rePassword">
          {{ passwordErrors.rePassword }}
        </p>
      </div>
      <button class="btn">Next</button>
      <p class="next">
        Already have an account?
        <nuxt-link to="/login" class="link">Next</nuxt-link>
      </p>
    </form>
  </div>
</template>

<script>
import Vue from 'vue'
import AppFooter from '../components/AppFooter.vue'
import { bus } from '../layouts/default.vue'
import { mapState, mapActions } from 'vuex'
import { required, minLength, sameAs } from 'vuelidate/lib/validators'
import { v4 } from 'uuid'
import TheVerifyFormVue from './TheVerifyForm.vue'
import validateEmail from '../utilities/validateEmail'
import validatePassword from '../utilities/validatePassword'
export default {
  data() {
    return {
      fullName: '',
      email: {
        invalid: false,
        model: '',
        required: false,
      },
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
      passwordErrors: {
        password: '',
        rePassword: '',
      },
      show: false,
    }
  },
  validations: {
    fullName: {
      required,
      minLength: minLength(5),
    },
  },
  methods: {
    ...mapActions({
      signupUser: 'auth/signupUser',
      loginUser: 'auth/loginUser',
    }),
    async handleSubmit() {
      this.setErrors()
      if (!this.errors.length && !this.passwordErrors.password) {
        const { email, password, rePassword } = this
        const user = {
          fullName: this.$v.fullName.$model,
          email: email.model,
          password: password.model,
        }
        try {
          await this.signupUser(user)
          if (process.title === 'browser' && localStorage) {
            localStorage.setItem('form', 'TheVerifyForm')
            localStorage.setItem('email', user.email)
          }
        } catch (error) {
          const response = {
            message: `${error.message}`,
            success: false,
          }
          bus.$emit('showPopup', response)
        }
      }
      setTimeout(() => {
        this.errors = []
      }, 7000)
    },
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

      if (this.$v.fullName.$model.length < 6) {
        this.errors.push({
          id: v4(),
          message: 'Full Name is required',
        })
      } else {
        this.errors = this.errors.filter(
          (error) => error.message.indexOf('fullname') === -1
        )
      }

      if (this.password.model.length < 6) {
        this.errors.push({
          id: v4(),
          message: 'Password is required',
        })
      } else {
        this.errors = this.errors.filter(
          (error) => error.message.indexOf('characters') === -1
        )
      }
      if (!validatePassword(this.password.model)) {
        this.passwordErrors.password =
          'Password should be a minimum of 6 characters and have at least 1 uppercase letter,1 lowercase letter,one number,1 special characters'
      } else {
        this.passwordErrors.password = ''
      }

      if (this.password.model !== this.rePassword.model) {
        this.passwordErrors.rePassword = 'Passwords must match'
      } else {
        this.passwordErrors.rePassword = ''
      }
    },
    validateEmail(event) {
      const { email, emailReg } = this
      email.required = true
      if (!validateEmail(email.model)) {
        email.invalid = true
      } else {
        email.invalid = false
        email.required = false
      }
    },
    validateMatchPass() {
      const { password, rePassword } = this
      if (password.model === rePassword.model) {
        rePassword.invalid = false
        rePassword.error = false
      } else {
        rePassword.invalid = true
        rePassword.error = true
      }
    },
    validatePassword(event) {
      const { password, passwordReg } = this
      if (validatePassword(password.model)) {
        password.invalid = false
        password.required = false
      } else {
        password.invalid = true
        password.required = true
      }
    },
  },
  computed: {
    valid() {
      const { email, password, rePassword } = this
      if (
        (!rePassword.invalid && rePassword.model,
        !email.invalid && email.model,
        !password.invalid && password.model)
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
  margin: 5em 0 4em 0;
  .heading {
    @include heading;
  }
  form {
    @include form-variant;
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
}
.close {
  @include absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
  color: #0055ff;
}
.btn + p {
  margin-top: 1.5em;
  width: 90%;
  line-height: 1.5em;
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
