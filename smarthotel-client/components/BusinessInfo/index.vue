<template>
  <div id="content">
    <div class="headers">
      <h1>
        Business Information for
        <span class="bold">{{ businessName }}</span>
      </h1>
    </div>
    <div id="form">
      <form @submit.prevent="handleSubmit">
        <div class="input-group mb border bp">
          <label for="reg-number">Company registration number</label>
          <input
            type="text"
            name="regNumber"
            class="input"
            @input="setHotelInfo($event)"
            :class="{
              valid: !regNumber.invalid && regNumber.model,
              invalid: regNumber.error || regNumber.invalid,
            }"
          />
        </div>
        <div class="inputs bp bp">
          <label>Registered business address</label>
          <div class="alert">
            <span class="material-icons">info</span>
            <p>
              We may validate this address by sending you a postcard containing
              a verification code
            </p>
          </div>
          <div class="input-group">
            <div class="custom-select">
              <select name="country" @change="setHotelInfo($event)">
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
          </div>
          <div class="input-group">
            <input
              type="text"
              name="postal"
              class="input"
              @input="setHotelInfo($event)"
              placeholder="Postal Code"
              :class="{
                valid: !postal.invalid && postal.model,
                invalid: postal.error || postal.invalid,
              }"
            />
          </div>
          <div class="input-group">
            <input
              type="text"
              name="city"
              class="input"
              @input="setHotelInfo($event)"
              :class="{
                valid: !city.invalid && city.model,
                invalid: city.error || city.invalid,
              }"
              placeholder="City/Town"
            />
          </div>
          <div class="input-group">
            <input
              type="text"
              name="region"
              class="input"
              @input="setHotelInfo($event)"
              :class="{
                valid: !region.invalid && region.model,
                invalid: region.error || region.invalid,
              }"
              placeholder="State/Region"
            />
          </div>
          <div class="input-group">
            <input
              type="text"
              name="address1"
              class="input"
              placeholder="Address Line 1"
              @input="setHotelInfo($event)"
              :class="{
                valid: !address1.invalid && address1.model,
                invalid: address1.error || address1.invalid,
              }"
            />
          </div>
          <div class="input-group">
            <input
              type="text"
              name="address2"
              class="input"
              placeholder="Address Line 2"
              @input="setHotelInfo($event)"
              :class="{
                valid: !address2.invalid && address2.model,
                invalid: address2.error || address2.invalid,
              }"
            />
          </div>
        </div>
        <div class="input-group mb bp bp">
          <label for="phone">Phone number for verification</label>
          <div class="phone">
            <input
              type="text"
              name="phone"
              class="input"
              ref="phone"
              id="phone"
              @input="setHotelInfo($event)"
              :class="{
                valid: !phone.invalid && phone.model,
                invalid: phone.error || phone.invalid,
              }"
            />
            <button class="btn send">Send SMS</button>
          </div>
        </div>
        <div class="input-group mb bp">
          <label for="contact">Primary Contact Person</label>
          <div class="contact">
            <input
              type="text"
              name="firstName"
              class="input"
              @input="setHotelInfo($event)"
              :class="{
                valid: !firstName.invalid && firstName.model,
                invalid: firstName.error || firstName.invalid,
              }"
              placeholder="First Name"
            />
            <input
              type="text"
              name="middleName"
              class="input"
              @input="setHotelInfo($event)"
              :class="{
                valid: !middleName.invalid && middleName.model,
                invalid: middleName.error || middleName.invalid,
              }"
              placeholder="Middle Name"
            />
            <input
              type="text"
              name="lastName"
              class="input"
              @input="setHotelInfo($event)"
              :class="{
                valid: !lastName.invalid && lastName.model,
                invalid: lastName.error || lastName.invalid,
              }"
              placeholder="Last Name"
            />
          </div>
        </div>
        <p class="info">Enter your name as it appears on your passport or ID</p>
        <div class="arrows">
          <button class="btn">
            <span>Next</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { bus } from '../../layouts/default.vue'
import { mapActions, mapGetters } from 'vuex'
import intlTelInput from 'intl-tel-input';
export default {
  data() {
    return {
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
      businessName: 'Dummy',
      city: {
        invalid: false,
        model: '',
        required: false,
      },
      country: {
        invalid: false,
        model: '',
        required: false,
      },
      phone: {
        invalid: false,
        model: '',
        required: false,
      },
      regNumber: {
        invalid: false,
        model: '',
        required: false,
      },
      region: {
        invalid: false,
        model: '',
        required: false,
      },
      firstName: {
        invalid: false,
        model: '',
        required: false,
      },
      middleName: {
        invalid: false,
        model: '',
        required: false,
      },
      lastName: {
        invalid: false,
        model: '',
        required: false,
      },
      postal: {
        invalid: false,
        model: '',
        required: false,
      },
    }
  },
  methods: {
    ...mapActions({
      addBusiness: 'hotel-registration/addBusiness',
    }),
    setHotelInfo(event) {
      const target = event.target
      const { name, value } = target
      this[name].model = value
      if (!this[name].model || this[name].model.length < 4) {
        this[name].invalid = true
        this[name].error = true
      } else {
        this[name].invalid = false
        this[name].error = false
      }
    },
    async handleSubmit() {
      const {
        address1,
        address2,
        city,
        country,
        phone,
        postal,
        regNumber,
        region,
        firstName,
        middleName,
        lastName,
      } = this
      const hotel = {
        address: {
          address1: address1.model,
          address2: address2.model,
          city: city.model,
          country: country.model,
          region: region.model,
          postalCode: postal.model,
        },
        phoneNumber: phone.model,
        regNo: regNumber.model,
        pContact: {
          firstName: firstName.model,
          middleName: middleName.model,
          lastName: lastName.model,
        },
      }
      try {
        bus.$emit('showLoading')
        await this.addBusiness(hotel)
        bus.$emit('changeComponent', 'forward')
      } catch (error) {
        bus.$emit('hideLoading')
        bus.$emit('showPopup', { message: error.message, success: false })
      }
    },
  },
  computed: {
    ...mapGetters({
      countries: 'countries/countries',
    }),
    empty() {
      if (
        this.firstName &&
        this.middleName &&
        this.lastName &&
        this.regNumber &&
        this.address1 &&
        this.address2 &&
        this.city &&
        this.country &&
        this.phone &&
        this.region &&
        this.postal
      ) {
        return false
      } else {
        return true
      }
    },
  },
  created() {
    bus.$emit('showBar')
    if (process.title === 'browser') {
      const temp = localStorage.getItem('hotel')
      const hotel = JSON.parse(temp)
      if (hotel) {
        this.businessName = hotel.businessName
      }
    }
  },
  mounted(){
    const input = this.$refs.phone;
    const utils = require('../../node_modules/intl-tel-input/build/js/utils.js')
    intlTelInput(input, {
        utilsScript: utils
    });
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/mixins/index.scss';
.headers {
  @include headers;
  h1 {
    color: #000;
  }
}
#content {
  max-width: 1000px;
  margin: 1em auto;
  form {
    @include form;
    max-width: 450px;
    box-shadow: none;
    padding-left: 0;
    padding-top: 0;
    .alert {
      .material-icons {
        font-size: 2em;
      }
    }
    .input-group {
      .custom-select {
        @include custom-select;
      }
    }
    #phone{
      width: 87%;
      padding-left: 3em;
    }
    .arrows {
      @include flex;
      @include centerVariant;
      margin-top: 10px;
      .btn {
        @include btn;
        @include flex;
        @include center;
        @include centerVariant;
        span {
          color: var(--white) !important;
        }
        .material-icons {
          color: var(--white) !important;
          margin-left: 10px;
          width: 20px;
        }
      }
    }
    .info {
      margin: 1em 0;
    }
    .btn {
      min-width: 120px;
      width: max-content;
    }
    .btn.send {
      min-width: 150px;
      width: max-content;
      margin-left: 5px !important;
    }
  }
  @media screen and (max-width: 1200px) {
    width: 80%;
    form {
      width: 70%;
    }
  }
  @media screen and (max-width: 1000px) {
    width: 90%;
    form {
      width: 80%;
    }
  }
  @media screen and (max-width: 650px) {
    form {
      width: 95%;
      .input-group {
        .input {
          width: 80%;
          margin: 0 auto;
          padding: 12px 20px;
        }
        label {
          left: 7%;
        }
      }
    }
  }
}
@media screen and (max-width: 1000px) {
  #content {
    @include flexColCenter;
    margin: 0 auto;
  }
}
</style>
