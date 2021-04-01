<template>
  <div id="settings">
    <div class="settings">
      <div id="setting">
        <div class="header">
          <h1>Hotel Info</h1>
        </div>
        <form id="form-1" @submit.prevent="handleSubmit($event)">
          <div class="logo">
            <label>Logo</label>
            <div class="img">
              <img
                :src="imagePath"
                alt="avatar"
                @click="uploadAvatar"
                :class="{ disabled: !editValue }"
              />
            </div>
            <input type="file" name="file" ref="file" hidden="hidden" />
          </div>
          <div class="input-group">
            <label>Hotel name</label>
            <input type="text" class="input" v-model="hotelName" />
          </div>
          <div class="input-group">
            <label>Hotel Description</label>
            <textarea
              type="text"
              class="input"
              v-model="description"
              cols="30"
              rows="3"
            >
            </textarea>
          </div>
          <div class="input-group delivery">
            <label>Hotel Delivery Support</label>
            <div class="radio-group">
              <div class="radio-item">
                <input
                  type="radio"
                  name="delivery"
                  value="yes"
                  v-model="delivery"
                />
                <label>Yes</label>
              </div>
              <div class="radio-item">
                <input
                  type="radio"
                  name="delivery"
                  value="no"
                  v-model="delivery"
                  checked
                />
                <label>No</label>
              </div>
            </div>
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
          <h1>Business Info</h1>
        </div>
        <form id="form-2" @submit.prevent="handleSubmit($event)">
          <div class="input-group">
            <label>Location</label>
            <div class="custom-select">
              <select v-model="location">
                <option value="">Select Location</option>
                <option
                  :value="option.name"
                  v-for="option in countries"
                  :key="option.id"
                >
                  {{ option.name }}
                </option>
              </select>
              <span class="custom-arrow"></span>
            </div>
          </div>
          <div class="input-group">
            <label>Business type</label>
            <input type="text" class="input" v-model="businessType" />
          </div>
          <div class="input-group">
            <label>Business Name</label>
            <input type="text" class="input" v-model="businessName" />
          </div>
          <div class="input-group">
            <label>Registration No.</label>
            <input type="text" class="input" v-model="regNo" />
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
          <h1>Contact Info</h1>
        </div>
        <form id="form-3" @submit.prevent="handleSubmit($event)">
          <div class="input-group">
            <label>Hotel email address</label>
            <input type="text" class="input" v-model="email" />
          </div>
          <div class="input-group phone-input-group">
            <label>Phone number</label>
            <input
              type="text"
              class="input"
              ref="phone"
              id="phone"
              v-model="phone"
            />
          </div>
          <div class="input-group">
            <label>Website</label>
            <input type="text" class="input" v-model="website" />
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
          <h1>Address</h1>
        </div>
        <form id="form-4" @submit.prevent="handleSubmit($event)">
          <div class="input-group">
            <label>Country</label>
            <div class="custom-select">
              <select
                v-model="country.model"
                :class="{
                  invalid: country.error,
                }"
              >
                <option value="">Select Category</option>
                <option
                  :value="option.name"
                  v-for="option in countries"
                  :key="option.id"
                >
                  {{ option.name }}
                </option>
              </select>
              <span class="custom-arrow"></span>
            </div>
          </div>
          <div class="input-group">
            <label>Postal Code</label>
            <input type="text" class="input" v-model="postal" />
          </div>
          <div class="input-group">
            <label>State/Region</label>
            <input
              type="text"
              class="input"
              name="region"
              @change="setHotelInfo($event)"
              ref="region"
            />
          </div>
          <div class="input-group">
            <label>City/Town</label>
            <input
              type="text"
              class="input"
              name="city"
              @change="setHotelInfo($event)"
              ref="city"
            />
          </div>
          <div class="input-group">
            <label>Address Line 1</label>
            <input
              type="text"
              class="input"
              name="address1"
              @change="setHotelInfo($event)"
              ref="address1"
            />
          </div>
          <div class="input-group">
            <label>Address Line 2</label>
            <input
              type="text"
              class="input"
              name="address2"
              @change="setHotelInfo($event)"
              ref="address2"
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
    </div>
    <div id="footer">
      <footer>
        <div class="footer-items">
          <nuxt-link to="/privay">privacy</nuxt-link>
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
import { bus } from '~/layouts/default.vue'
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
      address1: '',
      address2: '',
      businessName: '',
      businessType: '',
      city: '',
      country: '',
      location: '',
      editValue: false,
      email: '',
      errors: [],
      delivery: null,
      deliveryOptions: [
        {
          id: v4(),
          text: 'Yes',
        },
        {
          id: v4(),
          text: 'No',
        },
      ],
      description: '',
      file: null,
      hotelName: '',
      phone: '',
      postal: '',
      regNo: '',
      region: '',
      website: '',
    }
  },
  computed: {
    ...mapGetters({
      countries: 'countries/countries',
      imagePath: 'hotel/image',
    }),
  },
  methods: {
    ...mapActions({
      setImagePath: 'hotel/setImagePath',
      updateBusiness: 'hotel/updateBusiness',
      updateHotel: 'hotel/updateHotel',
      uploadImage: 'hotel/uploadImage',
    }),
    edit(event) {
      const { target } = event
      const sibling = target.parentElement.previousElementSibling
      sibling.classList.add('edit')
      this.editValue = true
    },
    cancelEdit(event) {
      const { target } = event
      const parent = target.parentElement.parentElement
      parent.classList.remove('edit')
      this.editValue = false
    },
    close() {
      bus.$emit('setErrors', [])
    },
    setHotelInfo(event) {
      const target = event.target
      const { name, value } = target
      // this.showSuggestions(name)
      this[name] = value
    },
    showSuggestions(name) {
      let input = null
      let autoComplete = null
      switch (name) {
        case 'region':
          input = this.$refs.region
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
    setPhoneError() {
      if (!this.phone) {
        bus.$emit('setErrors', [
          {
            id: v4(),
            message: 'Phone is required',
          },
        ])
      }
      setTimeout(() => {
        bus.$emit('setErrors', [])
      }, 5000)
    },
    setDescriptionError() {
      if (!this.description) {
        bus.$emit('setErrors', [
          {
            id: v4(),
            message: 'Description is required',
          },
        ])
      }
      setTimeout(() => {
        bus.$emit('setErrors', [])
      }, 5000)
    },
    uploadAvatar() {
      const { file } = this.$refs
      file.click()
    },
    async handleSubmit(event) {
      const target = event.target
      switch (target.id) {
        case 'form-1':
          this.setDescriptionError()
          const { hotelName, delivery, description } = this
          const image = this.$refs.file?.files[0]
          if (image) {
            try {
              const formData = new FormData()
              formData.append('image', image)
              await this.uploadImage(formData)
              bus.$emit('showPopup', {
                message: 'Upload was successfull',
                success: true,
              })
              const data = {
                hotelName,
                delivery,
                description,
                image: this.imagePath,
              }
              await this.updateHotel(data)
              bus.$emit('hotelUpdated')
              bus.$emit('showPopup', {
                message: 'Update successful',
                success: true,
              })
              this.hotelName = ''
              this.delivery = ''
              this.file = null
              this.image = this.imagePath
            } catch (error) {
              bus.$emit('showPopup', {
                message: `${error.message}`,
                success: false,
              })
            }
          } else if (description) {
            try {
              const data = {
                hotelName,
                delivery,
                description,
              }
              await this.updateHotel(data)
              bus.$emit('hotelUpdated')
              bus.$emit('showPopup', {
                message: 'Update successful',
                success: true,
              })
              this.hotelName = ''
              this.delivery = ''
              this.description = ''
            } catch (error) {
              bus.$emit('showPopup', {
                message: `${error.message}`,
                success: false,
              })
            }
          }
          break
        case 'form-2':
          try {
            const { location, businessName, businessType, regNo } = this
            const regData = {
              regNo,
            }
            const data = {
              businessName,
              businessType,
              location,
            }
            await this.updateBusiness(regData)
            await this.updateHotel(data)
            bus.$emit('showPopup', {
              message: 'Update was successfull',
              success: true,
            })
            this.location,
              this.businessName,
              this.businessType,
              (this.regNo = '')
          } catch (error) {
            bus.$emit('showPopup', {
              message: `${error.message}`,
              success: false,
            })
          }
          break
        case 'form-3':
          this.setPhoneError()
          const { email, phone, website } = this
          if (phone !== '') {
            try {
              const data = {
                phone,
                website,
                email,
              }
              await this.updateHotel(data)
              bus.$emit('showPopup', {
                message: 'Update was successfull',
                success: true,
              })
            } catch (error) {
              bus.$emit('showPopup', {
                message: `${error.message}`,
                success: false,
              })
            }
          }
          break
        case 'form-4':
          try {
            const { country, city, postal, region, address1, address2 } = this
            const data = {
              address1,
              address2,
              city,
              country,
              postalCode: postal,
              region,
            }
            await this.updateBusiness(data)
            bus.$emit('showPopup', {
              message: 'Update was successfull',
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
          return
      }
    },
  },
  mounted() {
    const input = this.$refs.phone
    const utils = require('../node_modules/intl-tel-input/build/js/utils.js')
    intlTelInput(input, {
      utilsScript: utils,
    })
    if (process.title === 'browser' && localStorage) {
      const hotel = JSON.parse(localStorage.getItem('hotel'))
      if (hotel && hotel?.logoUrl) {
        this.setImagePath(hotel.logoUrl)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#settings {
  padding-top: 5em;
  @include relative;
  .settings {
    background: var(--white);
    padding: 0.5em;
    #setting {
      margin: 0.75em 0;
      padding: 1em;
      background: var(--light_grey);
      @include grid;
      grid-template-columns: 1fr 3fr 1fr;
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
        background: transparent !important;
        width: 80% !important;
        max-width: 100% !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        padding: 0;
        label {
          font-weight: normal !important;
          text-transform: capitalize !important;
        }
        .logo {
          @include flexSpace;
          .img {
            width: 45%;
            margin-right: 70px;
            img {
              max-width: 100px;
              border-radius: 2px;
              cursor: pointer;
            }
            img.disabled {
              pointer-events: none;
            }
          }
        }
        .input-group {
          flex-direction: row !important;
          @include center;
          @include flexSpace;
          .input {
            width: 45%;
            margin-right: 70px;
            pointer-events: none;
          }
          textarea {
            height: auto !important;
          }
        }
        .phone-input-group {
          margin: 10px 0;
          #phone {
            width: 100%;
            padding-left: 3em;
          }
        }
        .delivery {
          padding: 0.75em 0;
          .radio-group {
            width: 45%;
            @include flex;

            .radio-item:first-of-type {
              margin-right: 1.5em;
            }
            .radio-item {
              pointer-events: none;
            }
          }
        }
        .custom-select {
          @include custom-select-variant;
          width: 45%;
          margin-right: 70px;
          select {
            pointer-events: none;
          }
        }
        .btns {
          display: none !important;
          .btn {
            @include btn;
            border-radius: 5px;
            min-width: 90px !important;
            width: max-content !important;
          }
          .btn:last-of-type {
            margin-left: 2em;
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
        .input,
        select {
          pointer-events: all;
        }
        .radio-item {
          pointer-events: all !important;
        }
      }
      .icon-container {
        grid-column: 3/4;
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
  @media screen and (max-width: 1367px) {
    .radio-group {
      transform: translateX(-30%);
    }
  }
}
</style>
