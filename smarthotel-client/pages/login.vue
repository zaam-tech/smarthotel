<template>
  <section>
    <AppPopup />
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
      <form @submit.prevent="submit">
        <h1>Get started with Smart Hotel</h1>
        <div class="input-group mb">
          <label for="email">Email or mobile phone number</label>
          <input
            type="text"
            class="input"
            name="email"
            v-model="email.model"
            @input="validateEmail()"
            :class="{
              invalid: email.invalid,
            }"
          />
        </div>
        <div class="input-group mb password">
          <label>Password</label>
          <span @click="resetPass">Forgot your password?</span>
          <input
            type="password"
            class="input"
            name="password"
            v-model="password.model"
            :class="{
              invalid: password.error,
            }"
          />
          <p class="error" v-show="passwordError">{{ passwordError }}</p>
        </div>
        <button class="btn">Login</button>
        <div class="checkbox mb">
          <input type="checkbox" name="checkbox" />
          <label for="checkbox"> Keep me Signed In </label>
          <div class="details" @click="togglePopup">
            <span>Details</span>
            <span class="ti ti-angle-down"></span>
          </div>
        </div>
        <div class="popup" v-show="showPopup">
          <div class="popup-header">
            <p>"Keep me Signed in" Checkbox</p>
            <span class="ti ti-close" @click="togglePopup"></span>
          </div>
          <div class="popup-container">
            <p>
              Choosing "keep me signed in" reduces the number of times you're
              asked to Sign-in on this devices
            </p>
            <p class="last-para">
              To keep your account secure, use this option only on your personal
              devices.
            </p>
          </div>
        </div>
        <div class="signup">
          <div class="text">
            <p>New to smarthotel?</p>
          </div>
          <nuxt-link to="/signup" class="btn-grey"
            >create your account</nuxt-link
          >
        </div>
      </form>
    </div>
    <AppFooter />
  </section>
</template>

<script>
import Vue from 'vue'
import { bus } from '../layouts/default'
import AppFooter from '../components/AppFooter'
import AppPopup from '../components/AppPopup'
import { mapState, mapActions } from 'vuex'
import { minLength, required } from 'vuelidate/lib/validators'
import { v4 } from 'uuid'
import validateEmail from '../utilities/validateEmail'
import validatePassword from '../utilities/validatePassword'
import redirect from '../utilities/redirect'
export default {
  head() {
    return {
      title: 'Smart Hotel | Login',
    }
  },
  components: {
    AppFooter,
    AppPopup,
  },
  computed: {
    valid() {
      const { email, password } = this
      if (
        email.model &&
        !email.invalid &&
        password.model &&
        !password.model.length < 5
      ) {
        return true
      } else {
        return false
      }
    },
  },
  data() {
    return {
      email: {
        invalid: false,
        model: '',
        required: false,
      },
      errors: [],
      password: {
        invalid: false,
        model: '',
        required: false,
      },
      passwordError: '',
      showPopup: false,
    }
  },
  methods: {
    ...mapActions({
      loginUser: 'auth/loginUser',
      getHotelById: 'hotel/getHotelById',
      getHotel: 'hotel/getHotel',
      getUser: 'auth/getUser',
      setForm: 'misc/setForm',
    }),
    checkCashierVerification(cashier) {
      if (cashier.isVerified) {
        return true
      } else {
        return false
      }
    },
    togglePopup() {
      this.showPopup = !this.showPopup
    },
    resetPass() {
      redirect('/reset-password')
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

      if (!this.password.model) {
        this.errors.push({
          id: v4(),
          message: 'Password is required',
        })
      } else {
        this.errors = this.errors.filter(
          (error) => error.message.indexOf('required') === -1
        )
      }
    },
    async submit() {
      this.setErrors()
      setTimeout(() => {
        this.errors = []
      }, 7000)
      if (!this.errors.length) {
        let userType = ''
        try {
          const { email, password } = this
          const user = {
            email: email.model,
            password: password.model,
          }
          if (process.title === 'browser' && window && localStorage) {
            await this.loginUser(user)
            localStorage.setItem('userEmail', email.model)
            await this.getUser()
            let tempUser = localStorage.getItem('user')
            let userData = JSON.parse(tempUser)
            userType = userData.userType.toLowerCase()
            switch (userData.userType.toLowerCase()) {
              case 'cashier':
            }
            if (userData.userType.toLowerCase().indexOf('cashier') != -1) {
              await this.getHotelById()
              redirect('/dashboard')
            } else if (userData.userType.toLowerCase().indexOf('master')) {
              await this.getHotelById()
              redirect('/dashboard')
            } else if (
              userData.userType.toLowerCase().indexOf('master') != -1
            ) {
              await this.getHotel()
              let tempHotel = localStorage.getItem('hotel')
              let hotel = JSON.parse(tempHotel)
              if (hotel) {
                redirect('/dashboard')
              } else {
                redirect('/register-business')
              }
            }
          }
        } catch (error) {
          if (error.status === 401 && userType === 'master admin') {
            if (process.title === 'browser') {
              localStorage.setItem('form', 'TheVerifyForm')
              redirect('/signup')
            }
          } else {
            bus.$emit('showPopup', {
              message: `${error.message}`,
              success: false,
            })
          }
        }
      }
    },
    validateEmail() {
      this.email.required = true
      if (!validateEmail(this.email.model)) {
        this.email.invalid = true
      } else {
        this.email.invalid = false
        this.email.required = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#form {
  @include flexColCenterBoth;
  margin: 2em 0 4em 0;
}
.heading {
  @include heading;
}
form {
  @include form-variant;
  .password-group {
    @include flexSpace;
    .options {
      font-size: 14px;
      font-weight: bold;
    }
  }
  .checkbox {
    margin: 1.5em 0;
    @include flex;
    @include center;
    // @include center;
    input[type='checkbox'] {
      margin-top: 3px;
      margin-right: 1em;
    }
    label {
      margin-right: 1em;
    }
  }
  .password {
    @include grid;
    grid-template-columns: repeat(2, 1fr);
    label {
      grid-column: 1/2;
    }
    span {
      grid-column: 2/3;
      text-align: right;
    }
    .error {
      grid-column: 1/3;
      font-size: 14px;
      text-transform: unset;
    }
    .input {
      grid-column: 1/3;
    }
  }
  .popup {
    @include absolute;
    left: 50%;
    top: 50%;
    width: 120%;
    transform: translate(-50%, -47%);
    z-index: 10;
    background: var(--white);
    border: 1px solid var(--grey);
    border-radius: 5px;
    .popup-header {
      @include flexSpace;
      @include center;
      padding: 0.85em 1em;
      background: var(--light_grey);
      color: var(--charcoal);
      border-bottom: 1px solid var(--light_grey);
      p {
        font-weight: bold;
      }
      .ti {
        color: var(--grey);
      }
    }
    .popup-container {
      padding: 1em;
      @include relative;
      .last-para {
        margin-top: 1em;
      }
      &::after {
        content: '';
        @include absolute;
        bottom: -10px;
        left: 50%;
        z-index: 1;
        transform: translateX(-50%);
        transform: rotate(-45deg);
        width: 20px;
        height: 20px;
        background: var(--white);
        border-left: 1px solid var(--light_grey);
        border-bottom: 1px solid var(--light_grey);
      }
    }
  }
  .signup {
    padding: 0.5em 0;
    @include flexCol;
    .text {
      @include flexCenter;
      margin: 1em 0;
      margin-bottom: 0.5em;
      p {
        display: inline-block;
        color: var(--dark-grey);
        @include relative;
        &:before {
          @include absolute;
          left: -75%;
          bottom: 8px;
          height: 3px;
          width: 65%;
          background: var(--light_grey);
          content: '';
          display: inline-block;
          margin-right: 20px;
        }
        &:after {
          @include absolute;
          right: -75%;
          bottom: 8px;
          height: 3px;
          width: 65%;
          background: var(--light_grey);
          content: '';
          display: inline-block;
          margin-left: 20px;
        }
      }
    }
    .btn {
      @include btn-new;
      margin-top: 1.5em;
    }
    .btn-grey {
      @include btn-grey;

      margin-top: 1.5em;
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
