<template>
  <div id="users__page">
    <div class="users__page">
      <div class="users__page__form">
        <form @submit.prevent="handleSubmit" ref="form">
          <div
            class="form-group group-1"
            :class="{ 'invalid-field': fullName.error }"
          >
            <label>Full Name</label>
            <input
              type="text"
              class="form-input-1 input"
              name="fullName"
              v-model="fullName.model"
              :class="{
                invalid: fullName.error,
              }"
            />
            <p class="error" v-show="fullName.error">
              <span>{{ fullName.error }}</span>
            </p>
          </div>
          <div
            class="form-group group-2"
            :class="{ 'invalid-field': userType.error }"
          >
            <label>User Type</label>
            <div class="custom-select">
              <select
                name="businessType"
                v-model="userType.model"
                :class="{
                  invalid: userType.error,
                }"
              >
                <option value="">Select Type</option>
                <option
                  :value="typeItem.text"
                  v-for="typeItem in types"
                  :key="typeItem.id"
                  ref="userType"
                >
                  {{ typeItem.text }}
                </option>
              </select>
              <p class="error" v-show="userType.error">
                <span>{{ userType.error }}</span>
              </p>
              <span class="custom-arrow"></span>
            </div>
            <p class="error" v-show="userType.error">{{ userType.error }}</p>
          </div>
          <div
            class="form-group group-3"
            :class="{ 'invalid-field': email.error }"
          >
            <label>Email Address</label>
            <input
              type="text"
              class="form-input-3 input"
              name="email"
              v-model="email.model"
              :class="{
                invalid: email.error,
              }"
            />
            <p class="error" v-show="email.error">
              <span>{{ email.error }}</span>
            </p>
            <p class="error" v-show="email.error">{{ email.error }}</p>
          </div>
          <div
            class="form-group group-4"
            :class="{ 'invalid-field': password.error }"
          >
            <label>Password</label>
            <input
              type="password"
              class="form-input-4 input"
              name="password"
              v-model="password.model"
              :class="{
                invalid: password.error,
              }"
            />
            <p class="error" v-show="password.error">
              <span>{{ password.error }}</span>
            </p>
          </div>
          <div class="users__page__cta">
            <button>
              <span>{{ text }}</span>
            </button>
          </div>
        </form>
      </div>
      <div class="users__page__layout">
        <ul class="users__page__layout__header mobile-header">
          <li>Employee</li>
          <li>Status</li>
        </ul>
        <div class="users__page__layout__header desktop-header">
          <span>Name</span>
          <span>Role</span>
          <span>Email</span>
          <span>Status</span>
          <span class="last-header">Options</span>
        </div>
        <div class="users__page__layout__content desktop" v-if="Users.length">
          <div
            class="users__page__layout__AppCard"
            v-for="user in Users"
            :key="user.id"
          >
            <div class="users__page__layout__profile">
              <div class="users__page__layout__image">
                <img src="/img_avatar.png" alt="" />
              </div>
              <div class="users__page__layout__profile__info">
                <h4>{{ user.fullName }}</h4>
              </div>
            </div>
            <div class="users__page__layout__role">
              <h4>{{ user.userType }}</h4>
            </div>
            <div class="users__page__layout__email">
              <h4>{{ user.email }}</h4>
            </div>
            <div
              class="users__page__layout__status"
              :class="user.online ? 'online' : 'offline'"
            >
              <h4>{{ user.online ? 'online' : 'offline' }}</h4>
            </div>
            <div class="users__page__layout__options">
              <span
                class="material-icons options-icon"
                @click="showOptions($event)"
                v-on-clickaway="hideOptions"
                >more_vert</span
              >
              <div
                class="tools"
                v-show="active && active.email === user.email"
                :ref="user.email"
                :id="user.email"
              >
                <div class="edit">
                  <span @click="editEmployee(user)">edit</span>
                </div>
                <div class="delete">
                  <span @click="deleteEmployee(user)">delete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="users__page__layout__content mobile">
          <div
            class="users__page__layout__AppCard"
            v-for="user in Users"
            :key="user.id"
          >
            <div class="users__page__layout__profile">
              <div class="users__page__layout__image">
                <img src="/avatar2.png" alt="" />
              </div>
              <div class="users__page__layout__profile__info">
                <h3>{{ user.fullName }}</h3>
              </div>
            </div>
            <div
              class="users__page__layout__status"
              :class="user.online ? 'online' : 'offline'"
            >
              <h3>{{ user.online ? 'online' : 'offline' }}</h3>
            </div>
            <div class="users__page__layout__options">
              <span
                class="material-icons options-icon"
                @click="showOptions($event)"
                >more_vert</span
              >
              <div class="tools" v-on-clickaway="hideOptions">
                <div class="edit">
                  <span @click="editEmployee(user)">edit</span>
                </div>
                <div class="delete">
                  <span @click="deleteEmployee(user)">delete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { bus } from '../layouts/default'
import { v4 } from 'uuid'
import validatePassword from '../utilities/validatePassword'
import validateEmail from '../utilities/validateEmail'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  data() {
    return {
      active: null,
      id: '',
      email: {
        invalid: false,
        error: '',
        model: '',
        required: false,
      },
      fullName: {
        invalid: false,
        error: '',
        model: '',
        required: false,
      },
      password: {
        invalid: false,
        error: '',
        model: '',
        required: false,
      },
      text: 'save',
      types: [
        {
          id: v4(),
          text: 'Admin',
        },
        {
          id: v4(),
          text: 'Cashier',
        },
      ],
      userType: {
        invalid: false,
        error: '',
        model: '',
        required: false,
      },
      Users: [],
    }
  },
  mixins: [clickaway],
  computed: {
    ...mapState(['links', 'auth']),
    errors() {
      const { email, fullName, password, userType } = this
      if (email.error || fullName.error || password.error || userType.error) {
        return true
      } else {
        return false
      }
    },
  },
  async created() {
    try {
      await this.getUsers()
      this.Users = this.auth.users
    } catch (error) {
      console.log({ error })
    }
  },
  methods: {
    ...mapActions({
      activateLink: 'links/activateLink',
      createCashier: 'auth/createCashier',
      deleteCashier: 'auth/deleteCashier',
      updateCashier: 'auth/updateCashier',
      getUsers: 'auth/getUsers',
      setUsers: 'auth/setUsers',
    }),
    activate() {
      const activeLink = {
        active: false,
        alias: 'add',
        icon: 'account_box',
        iconClass: 'material-icons',
        text: 'Add Employees',
        textClass: 'link-text',
      }
      this.activateLink(activeLink)
      bus.$emit('selectLink', activeLink)
    },
    async deleteEmployee(user) {
      try {
        await this.deleteCashier(user._id)
        bus.$emit('showPopup', {
          message: 'Cashier deleted',
          success: true,
        })
      } catch (error) {
        bus.$emit('showPopup', {
          message: error.message,
          success: false,
        })
      }
    },
    editEmployee(user) {
      this.email.model = user.email
      this.fullName.model = user.fullName
      this.userType.model = user.userType
      const { userType } = this.$refs
      userType.forEach((type) => {
        if (type.value === user.userType) {
          type.checked = true
        }
      })
      this.id = user._id
      this.text = 'update'
    },
    async handleSubmit() {
      this.setErrors()
      if (!this.errors) {
        if (this.text === 'update') {
          try {
            const cashier = {
              _id: this.id,
              email: this.email.model,
              fullName: this.fullName.model,
              password: this.password.model,
              userType: this.userType.model,
            }
            await this.updateCashier(cashier)
            this.email.model = ''
            this.fullName.model = ''
            this.password.model = ''
            this.userType.model = ''
            this.text = 'save'
            bus.$emit('showPopup', {
              message: 'Cashier updated',
              success: true,
            })
          } catch (error) {
            bus.$emit('showPopup', {
              message: error.message,
              sucess: false,
            })
          }
        } else if (this.text === 'save') {
          try {
            const cashier = {
              email: this.email.model,
              fullName: this.fullName.model,
              password: this.password.model,
              userType: this.userType.model,
            }
            await this.createCashier(cashier)
            this.email.model = ''
            this.fullName.model = ''
            this.password.model = ''
            this.userType.model = ''
            bus.$emit('showPopup', {
              message: 'Cashier created',
              success: true,
            })
          } catch (error) {
            bus.$emit('showPopup', {
              message: error.message,
              success: false,
            })
          }
        }
      }
    },
    hideOptions(event) {
      const { target } = event
      if (
        !target.classList.contains('options-icon') &&
        !target.classList.contains('text') &&
        !target.classList.contains('material-icons')
      ) {
        this.removeClass()
      }
    },
    removeClass() {
      const tools = document.querySelectorAll('.tools.active')
      tools.forEach((tool) => {
        tool.classList.remove('active')
      })
    },
    showOptions(event) {
      const { target } = event
      this.removeClass()
      if (target.classList.contains('options-icon')) {
        target.nextElementSibling.classList.add('active')
      } else {
        target.parentElement.nextElementSibling.classList.add('active')
      }
    },
    setErrors() {
      if (!validateEmail(this.email.model)) {
        this.email.error = 'Enter your email'
      } else {
        this.email.error = ''
      }

      if (!this.fullName.model) {
        this.fullName.error = 'Enter your name'
      } else {
        this.fullName.error = ''
      }

      if (!validatePassword(this.password.model)) {
        this.password.error =
          'Password should be at least 6 characters,1 numbers,1 uppercase letter,1 lowercase letter'
      } else {
        this.password.error = ''
      }

      if (!this.userType.model) {
        this.userType.error = 'Enter usertype'
      } else {
        this.userType.error = ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#users__page {
  margin-top: 5em;
  padding: 1em;
  .users__page {
    &__form {
      @include flexColCenterBoth;
      @include relative;
      .errors {
        margin-top: 0;
        @include absolute;
        top: -90%;
        right: 50%;
        transform: translate(50%, 50%);
        z-index: 150;
      }
      form {
        width: 100%;
        display: grid;
        grid-template-areas:
          'group1 group2'
          'group3 group4'
          'group5 button';
        grid-gap: 20px;
        padding: 1em;
        background: var(--white);
        .form-group {
          @include flexCenterVariant;
          flex-wrap: wrap;
          label {
            @include label;
            flex: 2;
          }
          .custom-select {
            flex: 2;
            @include custom-select;
            select {
              padding-left: 1em;
            }
            min-width: 269px;
          }
          .input {
            color: #333;
            border-radius: 5px;
            border: 1px solid var(--grey);
            padding: 7px;
            font-family: var(--open);
            font-size: 15px;
            flex: 2;
            min-width: 269px;
            &:active,
            &:focus {
              outline: none;
            }
          }
          .error {
            @include absolute;
            right: 0;
            top: 90%;
            color: var(--red-variant);
          }
        }
        .group-1 {
          grid-area: group1;
          .error {
            top: 85%;
          }
        }
        .group-2 {
          grid-area: group2;
          .error {
            top: 100%;
          }
        }
        .group-3 {
          grid-area: group3;
        }
        .group-4 {
          grid-area: group4;
        }

        .users__page__cta {
          grid-area: button;
          justify-self: end;
          button {
            @include flexCenterVariant;
            @include btn;
            background: var(--primary);
            width: auto;
            text-transform: capitalize !important;
          }
        }
      }
    }
    &__layout {
      .active {
        display: flex !important;
        flex-direction: column !important;
      }
      border: 1px solid var(--light_grey);
      border-radius: calc(0.375rem - 1px) calc(0.375rem - 1px) 0 0;
      margin-top: 20px;
      background: var(--white);
      &__heading {
        padding: 1em;
        @include h2_variant;
      }
      &__header {
        background: var(--blue-deep);
        color: var(--white);
        font-weight: bold;
        padding: 0.5em 1em;
        h3:last-of-type {
          text-align: right;
        }
      }
      &__header,
      &__AppCard {
        display: grid;
        grid-template-columns: 2fr 1fr 2fr repeat(2, 1fr);
        align-items: center;
        .last-header {
          text-align: right;
        }
      }
      .mobile,
      .mobile-header {
        display: none;
      }
      @media screen and (max-width: 1000px) {
        &__header,
        &__AppCard {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          align-items: center;
        }
        .mobile {
          @include flexCol;
        }
        .mobile-header {
          display: grid;
        }
        .desktop-header,
        .desktop {
          display: none;
        }
      }
      &__content {
        @include flexCol;
      }
      &__AppCard {
        @include relative;
        border: 0.3px solid var(--grey);
        border-left: 0;
        border-right: 0;
        padding: 1em;
        font-family: var(--open);
        font-size: 15px;
      }
      h4,
      span:not(.material-icons) {
        font-weight: normal;
        text-transform: capitalize;
        width: 100%;
      }
      &__status.online {
        color: var(--green);
      }
      &__status.offline {
        color: var(--red);
      }
      &__profile {
        @include flex;
        justify-self: left;
        &__info {
          padding-left: 1em;
          @include flexCol;
          @include centerVariant;
          h3 {
            text-transform: capitalize;
            font-weight: normal;
            font-size: initial;
          }
        }
      }
      &__image {
        @include flex;
        @include centerVariant;
        img {
          width: 50px;
          border-radius: 50%;
        }
      }
      &__options {
        align-self: flex-start;
        @include absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        .tools {
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          @include absolute;
          top: 25px;
          right: 15px;
          width: 120px;
          margin: 0 auto;
          background: var(--white);
          z-index: 3;
          border-radius: 2px;
          transition: all 0.4s linear;
          @include flexCol;
          .edit,
          .delete {
            padding: 0.5em 1em;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            text-transform: capitalize;
          }
          .material-icons {
            font-size: 20px;
            width: 30px;
          }
        }
      }
    }
  }
}
</style>
