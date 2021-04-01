<template>
  <section>
    <div id="form" :class="{ mbtop: !show }">
      <form @submit.prevent="submit" :class="{ signupform: !show }">
        <div
          class="input-group"
          :class="{ invalid: !user.fullname, mb: user.fullname }"
        >
          <label>Full Name</label>
          <input type="text" class="input" name="fullname" v-model="fullname" />
          <p class="error" v-show="!user.fullname">Full Name is required</p>
        </div>
        <div
          class="input-group"
          :class="{ invalid: !user.username, mb: user.username }"
        >
          <label>Username</label>
          <input type="text" class="input" name="username" v-model="username" />
          <p class="error" v-show="!user.username">Username is required</p>
        </div>
        <div
          class="input-group"
          :class="{ invalid: !user.email, mb: user.email }"
        >
          <label>Email</label>
          <input type="email" class="input" name="email" v-model="email" />
          <p class="error" v-show="!user.email">Enter your Email address</p>
        </div>
        <div
          class="input-group"
          :class="{ invalid: !user.password, mb: user.password }"
        >
          <label>Password</label>
          <input
            type="password"
            class="input"
            name="password"
            v-model="password"
            placeholder="At least 6 characters"
          />
          <p class="error" v-show="!user.password">Password is required</p>
        </div>
        <button class="btn">Add</button>
      </form>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import { bus } from '../layouts/default.vue'
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      fullname: '',
      username: '',
      email: '',
      password: '',
      user: {
        fullname: '1',
        username: '1',
        email: '1',
        password: '1',
      },
      show: false,
    }
  },
  methods: {
    login() {
      bus.$emit('showComponent', 'Login')
    },
    setFields() {
      const { user } = this
      user.fullname = this.fullname
      user.username = this.username
      user.email = this.email
      user.password = this.password
    },
    submit() {
      this.setFields()
      const { fullname, username, email, password } = this
      if (fullname && username && email && password) {
        const response = {
          message: 'Signup was successfull',
          success: true,
        }
        bus.$emit('showPopup', response)
      } else {
        const response = {
          message: 'Signup failed,please fill in all fields',
          success: false,
        }
        bus.$emit('showPopup', response)
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
.mbtop {
  margin-top: 8rem;
}
form {
  @include form;
}
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
  border-bottom: 1px solid #eee;
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
