<template>
  <div id="feedback-page">
    <div class="headers">
      <h1>Report</h1>
      <h2>Tell us about your experience with the system</h2>
    </div>
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
      <form @submit.prevent="sendMessage">
        <div class="input-group">
          <label>Your Fullname</label>
          <input type="text" class="input" v-model="fullName.model" />
        </div>
        <div class="input-group">
          <label>Your Email</label>
          <input
            type="text"
            class="input"
            v-model="email.model"
            @input="validateEmail($event)"
          />
        </div>
        <div class="input-group">
          <label>Your message</label>
          <textarea
            class="input"
            v-model="message.model"
            ref="message"
            cols="20"
            rows="8"
          ></textarea>
        </div>
        <div class="input-group">
          <button class="btn">Send</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import AppPopup from './AppPopup'
import { bus } from '../layouts/default'
import { v4 } from 'uuid'
import validateEmail from '../utilities/validateEmail'
export default {
  components: {
    AppPopup,
  },
  computed: {},
  data() {
    return {
      fullName: {
        error: '',
        model: '',
      },
      email: {
        error: '',
        model: '',
      },
      errors: [],
      message: {
        error: '',
        model: '',
      },
      show: false,
    }
  },
  methods: {
    setErrors() {
      this.errors = []
      const { fullName, email, message } = this
      if (!fullName.model) {
        this.errors.push({
          id: v4(),
          message: 'Enter your name',
        })
      } else {
        this.errors = this.errors.filter(
          (error) => error.message.indexOf('name') === -1
        )
      }
      if (!validateEmail(email.model)) {
        this.errors.push({
          id: v4(),
          message: 'Enter your email',
        })
      } else {
        this.errors = this.errors.filter(
          (error) => error.message.indexOf('email') === -1
        )
      }
      if (!message.mode) {
        this.errors.push({
          id: v4(),
          message: 'Enter your message',
        })
      } else {
        this.errors = this.errors.filter(
          (error) => error.message.indexOf('message') === -1
        )
      }
    },
    sendMessage() {
      this.setErrors()
      const { fullname, email, message } = this
      if (fullname && email && message) {
        const message = new URLSearchParams()
        message.append('email', email)
        message.append('message', message)
        message.append('fullname', fullname)
        try {
          bus.$emit('showPopup', {
            message: 'Message was sent successfull',
            success: true,
          })
        } catch (error) {
          console.log(error)
          bus.$emit('showPopup', {
            message: 'Message wasnt sent successfull',
            success: false,
          })
        }
      } else {
        const response = {
          message: 'Please fill in all fields',
          success: false,
        }
        bus.$emit('showPopup', response)
      }
    },
  },
}
</script>
<style lang="scss">
@import '../assets/mixins/index.scss';
#feedback-page {
  @include relative;
  @include flexColCenterBoth;
  margin-top: 5em;
  padding: 2em;
  .headers {
    @include headers;
    text-align: center;
  }
  #popup {
    margin: 0.5em auto;
  }
  #form {
    width: 100%;
    margin-top: 2em;
    @include flexCenterBoth;
    form {
      @include form-variant;
    }
  }
}
</style>
