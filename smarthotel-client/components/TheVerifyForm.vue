<template>
  <div id="form">
    <div class="errors" v-if="error && error.message">
      <div class="header">
        <span class="material-icons">warning</span>
        <h2>There was an error</h2>
      </div>
      <ul>
        <li>{{ error.message }}</li>
      </ul>
    </div>
    <form @submit.prevent="submit">
      <h1>Verify Email Address</h1>
      <p v-show="email">
        To verify your email we have sent a One Time Password(OTP) to
        {{ email }} (<span class="text" @click="back">Change</span>)
      </p>
      <div class="input-group mb">
        <label>Enter OTP</label>
        <input type="text" class="input" name="password" v-model="otp" />
      </div>
      <p class="success" v-show="sent">
        <span class="material-icons">check</span>
        A new code has been sent to your email
      </p>
      <button class="btn">Create Your Account</button>
      <p class="note">
        By creating an account,you agree to SmartHotel
        <nuxt-link to="/use">Conditions Of Use</nuxt-link> and
        <nuxt-link to="/policies">Privacy Policy</nuxt-link>
        <span class="resend" @click.prevent="resendOtp">Resend OTP</span>
      </p>
      <div class="resend-otp" v-show="sent">
        <p>Note: If you didnt receive our verification email:</p>
        <ul>
          <li>Confirm that your email was entered correctly above</li>
          <li>Check your spam or junk email folder</li>
        </ul>
      </div>
    </form>
  </div>
</template>

<script>
import Vue from 'vue'
import { bus } from '../layouts/default.vue'
import { mapGetters, mapActions } from 'vuex'
import { v4 } from 'uuid'
import redirect from '../utilities/redirect'
export default {
  data() {
    return {
      email: '',
      error: {},
      sent: false,
      otp: '',
    }
  },
  computed: {
    ...mapGetters({
      users: 'auth/users',
    }),
  },
  methods: {
    back() {
      bus.$emit('showForm', 'TheSignupForm')
    },
    ...mapActions({
      getUser: 'auth/getUser',
      verifyUser: 'auth/verifyUser',
      resendOTP: 'auth/resendOtpForEmailVerification',
    }),
    setError() {
      if (!this.otp) {
        this.error = {
          id: v4(),
          message: 'Enter the OTP',
        }
      } else {
        this.error = {}
      }
    },
    setFields() {
      this.user.password = this.password
    },
    async submit() {
      this.setError()
      setTimeout(() => {
        this.error = null
      }, 7000)
      if (this.error && !this.error.message) {
        try {
          await this.verifyUser(this.otp)
          await this.getUser()
          if (process.title === 'browser' && localStorage) {
            const user = JSON.parse(localStorage.getItem('user'))
            const userType = user.userType.toLowerCase()
            localStorage.removeItem('form')
            localStorage.removeItem('email')
            if (userType === 'cashier' || userType === 'Admin') {
              redirect('/dashboard')
            } else {
              redirect('/register-business')
            }
          }
        } catch (error) {
          bus.$emit('showPopup', {
            message: `${error.message}`,
            success: false,
          })
        }
      }
    },
    async resendOtp() {
      try {
        await this.resendOTP()
        this.sent = true
      } catch (error) {
        bus.$emit('showPopup', {
          message: error.message,
          success: false,
        })
      }
    },
  },
  created() {
    if (process.title === 'browser' && localStorage) {
      const email = localStorage.getItem('email')
      this.email = email
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';

#form {
  @include flexCenterBoth;
  margin: 10em 0 2em 0 !important;
}

form {
  @include form-variant;
  h3 {
    margin-top: 1em;
    margin-bottom: 0.5em;
    font-weight: normal;
  }
  .note {
    margin: 1.5em 0;
    .resend {
      margin-top: 0.75em;
      display: block;
      text-align: center;
    }
  }
  .success {
    @include flexCenterVariant;
    .material-icons {
      margin-right: 10px;
      color: var(--green);
    }
  }
  .resend-otp {
    ul {
      padding: 1em 0 0 1.5em !important;
      li {
        list-style-type: initial !important;
      }
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
