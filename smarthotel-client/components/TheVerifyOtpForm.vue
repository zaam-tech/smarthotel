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
        <h1>Authentication required</h1>
        <p>
          For your security,we need to authenticate your request. We've sent a
          One Time Password(OTP) to the email {{ email }}.Please enter it below.
        </p>
        <div class="input-group mb">
          <label>Enter OTP</label>
          <input
            type="text"
            class="input"
            name="password"
            v-model="otp.model"
          />
        </div>
        <div class="success" v-show="sent">
          <md-checkmark-icon class="ion-icon" />
          <span>A new code has been sent to your email</span>
        </div>
        <button class="btn">Continue</button>
        <span class="resend" @click.prevent="resendOtp">Resend OTP</span>
        <div class="help" @click="openContent">
          <ios-arrow-forward-icon :class="{ down: open }" class="ion-icon" />
          <span class="help-text">I need more help</span>
        </div>
        <div class="content" :class="{ open }">
          <p>
            If you've already tried to reset your password,but haven't received
            an email from SmartHotel, check your Junk or Spam folder.
          </p>
          <p>
            If you can't access your email, try resetting that first through
            your email provider.
          </p>
          <p>
            If you've recently updated your password,your old password could
            still be save in your browser. Try clearing your browser history and
            re-typing your password.
          </p>
        </div>
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
import redirect from '~/utilities/redirect'
export default {
  components: {
    AppPopup,
  },
  data() {
    return {
      errors: [],
      email: 'zaamtechnologies@gmail.com',
      sent: false,
      otp: {
        invalid: false,
        model: '',
      },
      open: false,
    }
  },
  created() {
    if (process.title === 'browser' && localStorage) {
      const temp = localStorage.getItem('email')
      this.email = JSON.parse(temp)
    }
  },
  methods: {
    handleSubmit() {},
    ...mapActions({
      verifyOtpForPasswordReset: 'auth/verifyOtpForPasswordReset',
      resendOtpForPasswordReset: 'auth/resendOtpForPasswordReset',
    }),
    async resendOtp() {
      try {
        await this.resendOtpForPasswordReset()
        this.sent = true
        this.otp.model = ''
        setTimeout(() => {
          this.sent = false
        }, 7000)
      } catch (error) {
        bus.$emit('showPopup', {
          message: `${error.message}`,
          success: false,
        })
      }
    },
    setErrors() {
      this.errors = []
      if (!this.emailReg.test(this.email.model)) {
        this.errors.push({
          id: v4(),
          message: 'Enter your email',
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
        const { otp } = this
        try {
          await this.verifyOtpForPasswordReset(otp.model)
          if (process.title === 'browser' && localStorage) {
            localStorage.removeItem('email')
          }
          bus.$emit('showResForm', 'AddNewPassForm')
        } catch (error) {
          bus.$emit('showPopup', {
            message: `${error.message}`,
            success: false,
          })
        }
      }
      setTimeout(() => {
        this.errors = []
      }, 5000)
    },
    openContent() {
      this.open = !this.open
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
  display: block;
  p {
    margin: 0.5em 0;
  }
  h1 {
    text-align: center;
    font-size: 1.7em;
    text-transform: unset;
  }
  .help {
    @include flex;
    @include center;
    cursor: pointer;
    .ion-icon {
      margin-right: 0.5em;
    }
    .ion-icon.down {
      transition: all 0.3s linear;
      transform: rotate(90deg);
    }
  }
  span {
    text-transform: unset !important;
    font-weight: normal;
    font-size: 1em;
    color: var(--primary);
  }
  .success {
    @include flex;
    @include center;
    .ion-icon {
      margin-right: 10px;
      svg {
        fill: var(--green);
      }
    }
    span {
      color: var(--green);
      font-size: 15px;
    }
  }
  label {
    font-weight: normal;
  }
  .content {
    display: none;
    padding-left: 1.5em;
    transition: all 0.3s linear;
  }
  .content.open {
    @include flexCol;
  }
  .resend {
    cursor: pointer;
    margin: 1em 0;
    @include flexCenter;
    font-weight: bold;
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
