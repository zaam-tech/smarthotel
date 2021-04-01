<template>
  <div id="settings">
    <div class="settings">
      <div id="setting">
        <div class="header">
          <h1>Personal Information</h1>
        </div>
        <form id="form-1" @submit.prevent="handleSubmit($event)">
          <div class="input-group first">
            <label>Name</label>
            <input type="text" class="input" v-model="name.model" />
          </div>
          <div class="countries mb second">
            <div class="input-group">
              <label for="type">Country of Birth</label>
              <div class="custom-select">
                <select name="COB" @change="setUserInfo($event)">
                  <option value="">Country</option>
                  <option
                    :value="location.name"
                    v-for="location in countries"
                    :key="location.id"
                  >
                    {{ location.name }}
                  </option>
                </select>
                <span class="custom-arrow"></span>
              </div>
              <p class="error" v-show="birthCountry.invalid">
                Please choose a birth Country
              </p>
            </div>
            <div class="input-group">
              <label>Date Of Birth</label>
              <div class="dates">
                <div class="custom-select">
                  <select name="DOB" @input="setUserInfo($event)">
                    <option>Date</option>
                    <option
                      :value="day"
                      v-for="(day, index) in days"
                      :key="index"
                    >
                      {{ day }}
                    </option>
                  </select>
                  <span class="custom-arrow"></span>
                </div>
                <div class="custom-select">
                  <select name="MOB" @input="setUserInfo($event)">
                    <option>Month</option>
                    <option
                      :value="month"
                      v-for="(month, index) in months"
                      :key="index"
                    >
                      {{ month }}
                    </option>
                  </select>
                  <span class="custom-arrow"></span>
                </div>
                <div class="custom-select">
                  <select name="YOB" @input="setUserInfo($event)">
                    <option>Year</option>
                    <option
                      :value="year"
                      v-for="(year, index) in years"
                      :key="index"
                    >
                      {{ year }}
                    </option>
                  </select>
                  <span class="custom-arrow"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="countries mb third">
            <div class="input-group">
              <label for="type">Proof of Identity</label>
              <div class="id-group">
                <div class="custom-select">
                  <select name="id" v-model="identity.type" id="id">
                    <option value="national_id">National ID</option>
                    <option value="passport">Passport</option>
                  </select>
                  <span class="custom-arrow"></span>
                </div>
                <input
                  type="text"
                  name="identity"
                  class="input"
                  @input="setUserInfo($event)"
                  :placeholder="
                    identity.type === 'national_id'
                      ? 'National ID'
                      : 'Passport No.'
                  "
                />
              </div>
            </div>
            <div class="input-group">
              <label>Expiry Date</label>
              <div class="dates">
                <div class="custom-select">
                  <select name="expDate" @input="setUserInfo($event)">
                    <option>Date</option>
                    <option
                      :value="day"
                      v-for="(day, index) in days"
                      :key="index"
                    >
                      {{ day }}
                    </option>
                  </select>
                  <span class="custom-arrow"></span>
                </div>
                <div class="custom-select">
                  <select name="expMonth" @input="setUserInfo($event)">
                    <option>Month</option>
                    <option
                      :value="month"
                      v-for="(month, index) in months"
                      :key="index"
                    >
                      {{ month }}
                    </option>
                  </select>
                  <span class="custom-arrow"></span>
                </div>
                <div class="custom-select">
                  <select name="expYear" @input="setUserInfo($event)">
                    <option>Year</option>
                    <option
                      :value="year"
                      v-for="(year, index) in years"
                      :key="index"
                    >
                      {{ year }}
                    </option>
                  </select>
                  <span class="custom-arrow"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="input-group mb fourth">
            <label for="type">Country of Issue </label>
            <div class="custom-select country-group">
              <select name="issueCountry" @change="setUserInfo($event)">
                <option value="">Country</option>
                <option
                  :value="location.name"
                  v-for="location in countries"
                  :key="location.id"
                >
                  {{ location.name }}
                </option>
              </select>
              <span class="custom-arrow"></span>
            </div>
            <p class="error" v-show="citiCountry.invalid">
              Issue country is invalid
            </p>
          </div>
          <div class="input-group btns">
            <button class="btn">save</button>
            <button class="btn" @click.prevent="cancelEdit">cancel</button>
          </div>
        </form>
        <div class="icon-container">
          <img src="/edit.svg" @click.prevent="edit($event)" class="icon" />
        </div>
      </div>
      <div id="setting">
        <div class="header">
          <h1>Account Information</h1>
        </div>
        <form id="form-2" @submit.prevent="handleSubmit($event)">
          <div class="input-group">
            <label>Username</label>
            <input type="text" class="input" v-model="username.model" />
          </div>
          <div class="input-group">
            <label>Email address</label>
            <input type="text" class="input" v-model="email.model" />
            <button class="btn-inline">Send email</button>
          </div>
          <div class="input-group phone-input">
            <label>Phone number</label>
            <input
              type="text"
              class="input"
              v-model="phone.model"
              ref="phone"
              id="phone"
            />
            <button class="btn-inline">Send SMS</button>
          </div>
          <div class="input-group btns">
            <button class="btn">save</button>
            <button class="btn" @click.prevent="cancelEdit">cancel</button>
          </div>
        </form>
        <div class="icon-container">
          <img src="/edit.svg" @click.prevent="edit($event)" class="icon" />
        </div>
      </div>
      <div id="setting">
        <div class="header">
          <h1>Address Information</h1>
        </div>
        <form id="form-3" @submit.prevent="handleSubmit($event)">
          <div class="input-group">
            <label for="type">Country</label>
            <div class="custom-select">
              <select name="country" @change="setUserInfo($event)">
                <option value=""></option>
                <option
                  :value="location.name"
                  v-for="location in countries"
                  :key="location.id"
                >
                  {{ location.name }}
                </option>
              </select>
              <span class="custom-arrow"></span>
            </div>
          </div>
          <div class="input-group">
            <label for="type">Postal Code</label>
            <input
              type="text"
              name="postal"
              class="input"
              @input="setUserInfo($event)"
              :class="{
                valid: !postal.invalid && postal.model,
                invalid: postal.error || postal.invalid,
              }"
            />
          </div>
          <div class="input-group">
            <label for="type">Region/State</label>
            <input
              type="text"
              name="state"
              class="input"
              @input="setUserInfo($event)"
              ref="state"
              :class="{
                valid: !state.invalid && state.model,
                invalid: state.error || state.invalid,
              }"
            />
          </div>
          <div class="input-group">
            <label for="type">City/Town</label>
            <input
              type="text"
              name="city"
              class="input"
              ref="city"
              @input="setUserInfo($event)"
              :class="{
                valid: !city.invalid && city.model,
                invalid: city.error || city.invalid,
              }"
            />
          </div>
          <div class="input-group">
            <label for="type">Address Line 1</label>
            <input
              type="text"
              name="address1"
              class="input"
              ref="address1"
              @input="setUserInfo($event)"
              :class="{
                valid: !address1.invalid && address1.model,
                invalid: address1.error || address1.invalid,
              }"
            />
          </div>
          <div class="input-group">
            <label for="type">Address Line 2</label>
            <input
              type="text"
              name="address2"
              class="input"
              ref="address2"
              @input="setUserInfo($event)"
              :class="{
                valid: !address2.invalid && address2.model,
                invalid: address2.error || address2.invalid,
              }"
            />
          </div>
          <div class="input-group btns">
            <button class="btn">save</button>
            <button class="btn" @click.prevent="cancelEdit">cancel</button>
          </div>
        </form>
        <div class="icon-container">
          <img src="/edit.svg" @click.prevent="edit($event)" class="icon" />
        </div>
      </div>
      <div id="setting">
        <div class="header">
          <h1>User Information</h1>
        </div>
        <form id="form-4" @submit.prevent="handleSubmit($event)">
          <div class="logo">
            <label>Profile Pic</label>
            <div class="img">
              <img src="/img_avatar.png" alt="avatar" @click="uploadAvatar" />
            </div>
            <input type="file" name="file" ref="file" hidden="hidden" />
          </div>
          <div class="input-group">
            <label>Password</label>
            <input type="text" class="input" v-model="password.model" />
          </div>
          <div class="input-group">
            <label>Re-type Password</label>
            <input type="text" class="input" v-model="password.repeat" />
          </div>
          <div class="input-group btns">
            <button class="btn">save</button>
            <button class="btn" @click.prevent="cancelEdit">cancel</button>
          </div>
        </form>
        <div class="icon-container">
          <img src="/edit.svg" @click.prevent="edit($event)" class="icon" />
        </div>
      </div>
    </div>
    <div id="footer">
      <footer>
        <div class="footer-items">
          <nuxt-link to="/privacy">privacy</nuxt-link>
          <nuxt-link to="/security">security</nuxt-link>
          <nuxt-link to="/terms">terms of service</nuxt-link>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { v4 } from 'uuid'
import { mapGetters, mapActions } from 'vuex'
import validateEmail from '../utilities/validateEmail'
import validatePassword from '../utilities/validatePassword'
import { bus } from '~/layouts/default.vue'
import generateNumbersArray from '@/utilities/generateNumbers'
import intlTelInput from 'intl-tel-input'
import autoCompleteApi from '@/utilities/auto-complete'

export default {
  head() {
    return {
      // script: [
      //   {
      //     src: `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}&libraries=places`,
      //     async: true,
      //   },
      // ],
    }
  },
  data() {
    return {
      days: [],
      months: [
        'Jan',
        'Feb',
        'Mar',
        'April',
        'May',
        'June',
        'July',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ],
      address1: {
        invalid: false,
        model: '',
        required: false,
      },
      address2: {
        invalid: false,
        model: '',
        required: false,
      },
      birthCountry: {
        invalid: false,
        model: '',
        required: false,
      },
      city: {
        invalid: false,
        model: '',
        required: false,
      },
      citiCountry: {
        invalid: false,
        model: '',
        required: false,
      },
      country: {
        invalid: false,
        model: '',
        required: false,
      },
      COB: {
        invalid: false,
        model: '',
        required: false,
      },
      email: {
        invalid: false,
        model: '',
        required: false,
      },
      file: null,
      name: {
        invalid: false,
        model: '',
        required: false,
      },
      username: {
        invalid: false,
        model: '',
        required: false,
      },
      issueCountry: {
        invalid: false,
        model: '',
        required: false,
      },
      identity: {
        invalid: false,
        model: 0,
        required: false,
        type: 'national_id',
      },
      DOB: {
        invalid: false,
        model: '',
        required: false,
      },
      MOB: {
        invalid: false,
        model: '',
        required: false,
      },
      YOB: {
        invalid: false,
        model: '',
        required: false,
      },
      expDate: {
        invalid: false,
        model: '',
        required: false,
      },
      expMonth: {
        invalid: false,
        model: '',
        required: false,
      },
      expYear: {
        invalid: false,
        model: '',
        required: false,
      },
      phone: {
        invalid: false,
        model: '',
        required: false,
      },
      pin: {
        invalid: false,
        model: '',
        required: false,
      },
      postal: {
        invalid: false,
        model: '',
        required: false,
      },
      password: {
        invalid: false,
        model: '',
        repeat: '',
        required: false,
      },
      state: {
        invalid: false,
        model: '',
        required: false,
      },
      showModal: false,
      years: [],
    }
  },
  computed: {
    ...mapGetters({
      countries: 'countries/countries',
    }),
  },
  methods: {
    ...mapActions({
      updateWebUser: 'auth/updateWebUser',
      uploadImage: 'hotel/uploadImage',
    }),
    edit(event) {
      const { target } = event
      const sibling = target.parentElement.previousElementSibling
      sibling.classList.add('edit')
    },
    cancelEdit(event) {
      const { target } = event
      const parent = target.parentElement.parentElement
      parent.classList.remove('edit')
    },
    setErrors() {},
    uploadAvatar() {
      const { file } = this.$refs
      file.click()
    },
    async handleSubmit(event) {
      const target = event.target
      switch (target.id) {
        case 'form-1':
          try {
            const {
              name,
              COB,
              issueCountry,
              DOB,
              MOB,
              YOB,
              expDate,
              expMonth,
              expYear,
              identity,
            } = this
            const data = {
              fullName: name.model,
              birthCountry: COB.model,
              issueCountry: issueCountry.model,
              DOB: `${DOB.model} ${MOB.model} ${YOB.model}`,
              expiryDate: `${expDate.model} ${expMonth.model} ${expYear.model}`,
              identity: identity.model,
            }
            await this.updateWebUser(data)
            bus.$emit('showPopup', {
              message: 'Update successful',
              success: true,
            })
          } catch (error) {
            bus.$emit('showPopup', {
              message: `${error.message}`,
              success: false,
            })
          }
          break
        case 'form-2':
          try {
            const { email, username, phone } = this
            const data = {
              email: email.model,
              phone: phone.model,
              username: username.model,
            }
            await this.updateWebUser(data)
            bus.$emit('showPopup', {
              message: 'Update successfull',
              success: true,
            })
          } catch (error) {
            bus.$emit('showPopup', {
              message: `${error.message}`,
              success: false,
            })
          }
          break
        case 'form-3':
          try {
            const { city, country, region, postal, address1, address2 } = this
            const data = {
              address1: address1.model,
              address2: address2.model,
              city: city.model,
              country: country.model,
              postal: postal.model,
              region: region.model,
            }
            await this.updateWebUser(data)
            bus.$emit('showPopup', {
              message: 'Update successfull',
              success: true,
            })
          } catch (error) {
            bus.$emit('showPopup', {
              message: `${error.message}`,
              success: false,
            })
          }
          break
        case 'form-4':
          try {
            const file = this.$refs.file?.files[0]
            const formData = new FormData()
            formData.append('image', file)
            if (file) {
              await this.uploadImage(file)
            }
            const { password } = this
            const data = {
              password: password.model,
              rePassword: password.repeat,
            }
            await this.updateWebUser(data)
            bus.$emit('showPopup', {
              message: 'Update successfull',
              success: true,
            })
          } catch (error) {
            bus.$emit('showPopup', {
              message: `${error.message}`,
              success: false,
            })
          }
          break
        default:
          break
      }
    },
    setUserInfo(event) {
      const target = event.target
      const { name, value } = target
      // this.showSuggestions(name)
      this[name].model = value
      if (!this[name].model || this[name].model.length < 4) {
        this[name].invalid = true
        this[name].error = true
      } else {
        this[name].invalid = false
        this[name].error = false
      }
    },
    showSuggestions(name) {
      let input = null
      let autoComplete = null
      switch (name) {
        case 'state':
          input = this.$refs.state
          autoComplete = autoCompleteApi(input, google)
          break
        case 'city':
          input = this.$refs.city
          autoComplete = autoCompleteApi(input, google)
          break
        case 'address1':
          input = this.$refs.address1
          autoComplete = autoCompleteApi(input, google)
          break
        case 'address2':
          input = this.$refs.address2
          autoComplete = autoCompleteApi(input, google)
          break
        default:
          break
      }
    },
  },
  created() {
    this.years = generateNumbersArray(1975, 2050)
    this.days = generateNumbersArray(1, 31)
  },
  mounted() {
    const phoneInput = this.$refs.phone
    const utils = require('../node_modules/intl-tel-input/build/js/utils.js')
    intlTelInput(phoneInput, {
      utilsScript: utils,
    })
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#settings {
  padding-top: 5em;
  .settings {
    background: var(--white);
    padding: 0.5em;
    #setting {
      margin: 0.75em 0;
      padding: 1em;
      background: var(--light_grey);
      @include grid;
      grid-template-columns: 2fr 6.25fr 1fr;
      &:first-of-type {
        margin-top: 0;
      }
      .header {
        grid-column: 1/2;
        h1 {
          font-size: 1.3em;
          font-weight: bold;
        }
      }
      form {
        @include form;
        @include relative;
        grid-column: 2/3;
        grid-row: 2;
        background: transparent !important;
        width: 70% !important;
        max-width: 100% !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        padding: 0;
        label {
          font-weight: normal !important;
        }
        .logo {
          @include flexSpace;
          .img {
            width: 49%;
            margin-right: 70px;
            img {
              max-width: 100px;
              border-radius: 50%;
              cursor: pointer;
              pointer-events: none;
            }
          }
        }
        .input-group {
          flex-direction: row !important;
          @include center;
          @include flexSpace;
          .input {
            width: 49%;
            border-radius: 0 !important;
            margin-right: 70px;
            pointer-events: none;
          }
        }
        .phone-input {
          margin: 10px 0;
          #phone {
            width: 87%;
            padding-left: 3em;
          }
        }

        .custom-select {
          @include custom-select-variant;
          width: 49%;
          margin-right: 70px;
          select {
            pointer-events: none;
          }
        }
        .btns {
          display: none !important;
          .btn {
            display: block;
            @include btn;
            border-radius: 5px;
            min-width: 90px !important;
            width: max-content !important;
            &:last-of-type {
              margin-left: 2em;
            }
          }
        }
      }
      form.edit {
        .btns {
          display: flex !important;
          justify-content: flex-end;
          transform: translateX(-70px);
        }
        .edit-icon {
          display: none;
        }
      }
      #form-1 {
        .second {
          @include flexCol;
        }
        .dates,
        .id-group {
          @include flex;
          transform: translateX(-29%);
          width: 49%;
          .custom-select {
            width: 100%;
            margin-right: 10px;
            select {
              padding-left: 2px !important;
            }
            .custom-arrow {
              width: 1.3em;
              font-size: 12px;
              right: 1.5%;
            }
            &:last-of-type {
              margin-right: 0;
            }
          }
        }
        .third {
          .id-group {
            .input {
              width: 100%;
              margin-right: 0;
            }
          }
        }
      }
      #form-2 {
        .input-group {
          @include relative;
          .btn-inline {
            display: none;
            @include btn;
            @include absolute;
            width: 150px;
            bottom: 0;
            right: -100px;
            border-radius: 5px;
            min-width: 90px !important;
            &:first-of-type {
              padding: 10px 25px !important;
            }
            &:last-of-type {
              margin-left: 2em;
            }
          }
        }
      }
      form.edit {
        .btn-inline {
          display: flex !important;
        }
        .input,
        select,
        img {
          pointer-events: all;
        }
      }
      #form-4 {
        .input-group {
          @include relative;
          .btn-inline {
            @include btn;
            @include absolute;
            width: 150px;
            bottom: 0;
            right: -100px;
            border-radius: 5px;
            min-width: 90px !important;
            &:first-of-type {
              padding: 10px 25px !important;
            }
            &:last-of-type {
              margin-left: 2em;
            }
          }
        }
      }
      .icon-container {
        grid-column: 2/4;
        grid-row: 1;
        justify-self: end;
        .icon {
          width: 20px;
          cursor: pointer;
        }
      }
      @media screen and (max-width: 700px) {
        .header {
          grid-column: 1/3;
        }
        form {
          grid-column: 1/3;
          width: 80% !important;
        }
      }
      @media screen and (min-width: 1300px) {
        .second {
          @include flex;
        }
      }
      @media screen and (min-width: 1367px) {
        .dates,
        .id-group {
          transform: translateX(-5%);
        }
        #phone {
          width: 100%;
          padding-left: 3em;
        }
      }
    }
  }
  #footer {
    padding-top: 1.5em;
    padding-bottom: 2em;
    background: var(--white);
    footer {
      .footer-items {
        @include flexCenterBoth;
        a {
          color: var(--dark);
          text-transform: capitalize;
          @include relative;
          padding: 0 1em;
          &:after {
            content: '';
            @include absolute;
            top: 50%;
            right: 0;
            height: 100%;
            width: 1px;
            background: var(--dark);
            transform: translateY(-50%);
            cursor: none;
            pointer-events: none;
          }
          &:last-of-type::after {
            display: none;
          }
        }
      }
    }
  }
}
</style>
