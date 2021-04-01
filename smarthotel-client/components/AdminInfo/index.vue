<template>
  <div id="content">
    <the-modal :showModal="showModal" v-if="showModal">
      <div class="modal-body" slot="verify-modal">
        <h1 class="verify-header">Enter the PIN we sent via SMS</h1>
        <div class="verify-content">
          <h2>One-time PIN</h2>
          <div class="input-group">
            <input
              type="text"
              name="pin"
              class="input"
              v-model="pin"
              placeholder="Country"
            />
            <button class="btn-modal">Verify</button>
          </div>
          <p class="error" v-show="!pin.invalid">PIN is invalid</p>
        </div>
        <div class="cta">
          <span>Change number or want us to call instead?</span>
          <p @click="toggleModal(false)">Cancel</p>
        </div>
      </div>
    </the-modal>
    <div class="headers border bp">
      <h1>
        Admin Information for
        <span class="bold">{{ name }}</span>
      </h1>
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="input-group mb country-group">
        <label for="type">Country of Citizenship</label>
        <div class="custom-select">
          <select name="citiCountry" @change="setHotelInfo($event)">
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
          Citizenship country is invalid
        </p>
      </div>
      <div class="countries mb">
        <div class="input-group">
          <label for="type">Country of Birth</label>
          <div class="custom-select">
            <select name="COB" @change="setHotelInfo($event)">
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
              <select name="DOB" @input="setHotelInfo($event)">
                <option>Date</option>
                <option :value="day" v-for="(day, index) in days" :key="index">
                  {{ day }}
                </option>
              </select>
              <span class="custom-arrow"></span>
            </div>
            <div class="custom-select">
              <select name="MOB" @input="setHotelInfo($event)">
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
              <select name="YOB" @input="setHotelInfo($event)">
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
      <div class="countries">
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
              @input="setHotelInfo($event)"
              :placeholder="
                identity.type === 'national_id' ? 'National ID' : 'Passport No.'
              "
            />
          </div>
        </div>
        <div class="input-group">
          <label>Expiry Date</label>
          <div class="dates">
            <div class="custom-select">
              <select name="expDate" @input="setHotelInfo($event)">
                <option>Date</option>
                <option :value="day" v-for="(day, index) in days" :key="index">
                  {{ day }}
                </option>
              </select>
              <span class="custom-arrow"></span>
            </div>
            <div class="custom-select">
              <select name="expMonth" @input="setHotelInfo($event)">
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
              <select name="expYear" @input="setHotelInfo($event)">
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
      <div class="input-group mb bp">
        <label for="type">Country of Issue </label>
        <div class="custom-select country-group">
          <select name="issueCountry" @change="setHotelInfo($event)">
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
      <div class="inputs bp padd">
        <label>Residential address</label>
        <div class="inputs padd">
          <div class="addresses">
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
                name="state"
                class="input"
                @input="setHotelInfo($event)"
                :class="{
                  valid: !state.invalid && state.model,
                  invalid: state.error || state.invalid,
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
        </div>
      </div>
      <div class="input-group mb padd phone-group">
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
      <div class="arrows padd">
        <button class="btn" @click.prevent="back">
          <span>Previous</span>
        </button>
        <button class="btn" @click="handleSubmit">
          <span>Next</span>
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'
import { bus } from '../../layouts/default.vue'
import TheModal from '../TheModal'
import { mapActions, mapGetters } from 'vuex'
import generateNumbers from '@/utilities/generateNumbers'
import intlTelInput from 'intl-tel-input';
export default {
  components: {
    TheModal,
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
      state: {
        invalid: false,
        model: '',
        required: false,
      },
      showModal: false,
      years: [],
      name: 'Zaam',
    }
  },
  methods: {
    ...mapActions({
      getUser: 'auth/getUser',
      updateAdminUser: 'hotel-registration/updateAdminUser',
    }),
    back() {
      bus.$emit('changeComponent', 'back')
    },
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
        birthCountry,
        DOB,
        city,
        citiCountry,
        country,
        COB,
        identity,
        issueCountry,
        MOB,
        phone,
        postal,
        state,
        expDate,
        expMonth,
        expYear,
        YOB,
      } = this
      const dob = DOB.model.length < 2 ? `0${DOB.model}` : DOB.model
      const dateExp =
        expDate.model.length < 2 ? `0${expDate.model}` : expDate.model
      const user = {
        address: {
          country: country.model,
          postalCode: postal.model,
          region: state.model,
          city: city.model,
          address1: address1.model,
          address2: address2.model,
        },
        birthCountry: COB.model,
        citizenShip: citiCountry.model,
        DOB: `${dob} ${MOB.model} ${YOB.model}`,
        phoneNumber: phone.model,
        identity: identity.model,
        identityDoc:
          identity.type === 'national_id' ? 'National ID' : 'Passport',
        issueCountry: issueCountry.model,
        expiryDate: `${dateExp} ${expMonth.model} ${expYear.model}`,
      }
      try {
        bus.$emit('showLoading')
        await this.updateAdminUser(user)
        bus.$emit('changeComponent', 'forward')
      } catch (error) {
        bus.$emit('hideLoading')
        bus.$emit('showPopup', { message: error.message, success: false })
      }
    },
    toggleModal(value) {
      this.showModal = value
    },
  },
  computed: {
    ...mapGetters({
      countries: 'countries/countries',
      user: 'auth/user',
    }),
  },
  async created() {
    bus.$emit('showBar')
    this.years = generateNumbers(1975, 2050)
    this.days = generateNumbers(1, 31)
    bus.$on('toggleModal', (val) => this.toggleModal(val))
    try {
      await this.getUser()
    } catch (error) {
      console.log(error)
    }
    if (this.user) {
      this.name = this.user.fullName
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
  max-width: 500px;
  h1 {
    color: #000;
  }
}
#content {
  max-width: 1000px;
  margin: 1em auto;
  form {
    @include form;
    width: 100%;
    max-width: 475px;
    box-shadow: none;
    padding: 0;
    .custom-select {
      @include custom-select;
      select {
        padding: 0 5px 0 5px !important;
      }
      .custom-arrow {
        width: 1.5em;
      }
    }
    .id-group {
      @include flex;
      .custom-select {
        width: 60% !important;
        #id {
          border-right: none !important;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          padding-left: 0.5em !important;
          padding-right: 1.5em;
        }
      }
      .input {
        width: 50%;
        border-left: none !important;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
      .custom-arrow {
        right: 1%;
        &::before {
          display: none;
        }
      }
    }
    .inputs {
      display: block !important;
      .addresses {
        @include flexSpace;
        flex-wrap: wrap;
      }
    }
    .input-group {
      .custom-select {
        @include custom-select;
      }
    }
    .phone{
      #phone{
        padding-left: 3em;
      }
      .btn{
        margin-left: 7px !important;
      }
      justify-content: space-between !important;
    }

    .countries {
      @include flexSpace;
      padding: 1em 0;
      .input-group {
        width: 49%;
      }
      .dates {
        @include flex;
        flex: 1;
        .custom-select {
          select {
            min-width: 82px;
          }
        }
        .custom-select:not(:first-of-type) {
          margin-left: 5px;
        }
      }
    }
    .country-group {
      width: 49%;
    }
    .arrows {
      @include flex;
      @include centerVariant;
      margin-top: 10px;
      .btn {
        width: 150px;
        margin: 0 5px;
        @include flexCenterBoth;
        &:last-of-type {
          @include btn;
          span {
            color: var(--white) !important;
            font-weight: normal !important;
          }
        }
        &:first-of-type {
          @include btn-grey;
          span {
            color: var(--black) !important;
            font-weight: normal !important;
          }
        }
      }
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
  @media screen and (max-width: 1000px) {
    #content {
      @include flexColCenter;
      margin: 0 auto;
    }
  }
  .modal-body {
    padding: 2em;
    max-width: 500px;
    .verify-header {
      font-size: 17px;
      font-weight: bold;
      margin-bottom: 1em;
    }
    h2 {
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 1em;
    }
    .input-group {
      @include flexCenterVariant;
      .input {
        margin-right: 1em;
        width: 100%;
        color: #333;
        border-radius: 5px;
        border: 1px solid var(--grey);
        padding: 10px;
        font-family: var(--open);
        font-size: 15px;
        &:active {
          background: var(--light_grey);
        }
      }
      .btn-modal {
        @include btn-new;
        background: var(--secondary);
      }
    }
    .cta {
      @include flexCenterVariant;
      margin-top: 1em;
      span {
        color: var(--grey);
        &:hover {
          text-decoration: underline;
          cursor: pointer;
        }
      }
      p {
        margin-left: 1em;
        color: var(--primary);
        cursor: pointer;
      }
    }
  }
}
</style>
