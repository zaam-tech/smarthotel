<template>
  <div id="register-central">
    <div class="headers">
      <h1>
        Before starting, please make sure you have the following information
        handy
      </h1>
      <h2>We may require additional information or documents later</h2>
    </div>
    <div class="info">
      <div class="info-item">
        <span class="material-icons">home</span>
        <p>Business and Contact Address</p>
      </div>
      <div class="info-item">
        <span class="material-icons">phone</span>
        <p>Mobile or Telephone number</p>
      </div>
      <div class="info-item">
        <span class="material-icons">credit_card</span>
        <p>Chargeable Credit card</p>
      </div>
      <div class="info-item">
        <span class="material-icons">supervisor_account</span>
        <p>Identity Details</p>
      </div>
    </div>
    <div id="form">
      <form @submit.prevent="validateFields">
        <div class="input-group mb">
          <label for="type">Business Location</label>
          <div class="custom-select">
            <select name="businessLocation" @change="setValue($event)">
              <option value="">Select Location</option>
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
          <p class="error" v-show="locationEmpty && businessLocation.invalid">
            Please choose a business Location
          </p>
          <p
            class="success"
            v-show="!locationEmpty && !businessLocation.invalid"
          >
            Business Location is Valid
          </p>
        </div>
        <div class="input-group mb">
          <label for="type">Business Type</label>
          <div class="custom-select">
            <select name="businessType" @change="setValue($event)">
              <option value="">Select Type</option>
              <option
                :value="typeItem.text"
                v-for="typeItem in types"
                :key="typeItem.id"
              >
                {{ typeItem.text }}
              </option>
            </select>
            <span class="custom-arrow"></span>
          </div>
          <p class="error" v-show="typeEmpty && businessType.invalid">
            Please choose a business type
          </p>
          <p class="success" v-show="!typeEmpty && !businessType.invalid">
            Business type is valid
          </p>
        </div>
        <div class="input-group mb">
          <label for="name"
            >Business name, used to register with your state or federal
            government</label
          >
          <input
            type="text"
            class="input"
            placeholder="Business as it appears on business registration documents"
            @change="setValue($event)"
            name="businessName"
          />
        </div>
        <div class="notice">
          <p>
            By clicking on agree and continue you agree to accept the following
            Policies,agreements and notice
          </p>
          <p class="info-text">
            Zaam Service Business Solution Agreement -
            <nuxt-link to="zaam.com">Kenya</nuxt-link>
          </p>
        </div>
        <button class="btn">Agree and Continue</button>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { bus } from '../../layouts/default'
import { mapActions, mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
export default {
  data() {
    return {
      businessLocation: {
        model: '',
        invalid: false,
        error: false,
      },
      businessName: {
        model: '',
        invalid: false,
        error: false,
      },
      businessType: {
        model: '',
        invalid: false,
        error: false,
      },
      errors: [],
    }
  },
  methods: {
    ...mapActions({
      createHotel: 'hotel-registration/createHotel',
    }),
    setErrors() {
      this.errors = []

      if (!this.businessLocation) {
        this.errors.push({
          id: v4(),
          message: 'Enter business location',
        })
      } else {
        this.errors = this.errors.filter(
          (error) => error.message.indexOf('location') === -1
        )
      }
      if (!this.businessName) {
        this.errors.push({
          id: v4(),
          message: 'Enter business name',
        })
      } else {
        this.errors = this.errors.filter(
          (error) => error.message.indexOf('name') === -1
        )
      }

      if (!this.businessType) {
        this.errors.push({
          id: v4(),
          message: 'Enter business type',
        })
      } else {
        this.errors = this.errors.filter(
          (error) => error.message.indexOf('type') === -1
        )
      }
    },
    setValue(event) {
      const target = event.target
      const { name, value } = target
      this[name].model = value
      if (!this[name].model) {
        this[name].invalid = true
        this[name].error = true
      } else {
        this[name].invalid = false
        this[name].error = false
      }
    },
    async validateFields() {
      if (!this.empty) {
        bus.$emit('showLoading')
        try {
          const data = {
            country: this.businessLocation.model,
            businessName: this.businessName.model,
            businessType: this.businessType.model,
          }
          await this.createHotel(data)
          bus.$emit('initSteps')
          bus.$emit('showBar')
        } catch (error) {
          bus.$emit('hideLoading')
          bus.$emit('showPopup', { message: error.message, success: false })
        }
      } else {
        if (!this.businessLocation.model) {
          this.businessLocation.invalid = true
          this.businessLocation.error = true
        } else if (!this.businessName.model) {
          this.businessName.invalid = true
          this.businessName.error = true
        } else {
          this.businessType.invalid = true
          this.businessType.error = true
        }
      }
    },
  },
  computed: {
    ...mapGetters({
      countries: 'countries/countries',
      types: 'business-types/types',
    }),
    empty() {
      if (
        this.businessLocation.model.length < 4 ||
        this.businessName.model.length < 4 ||
        this.businessType.model.length < 4
      ) {
        return true
      } else {
        return false
      }
    },
    locationEmpty() {
      if (!this.businessLocation.model.length < 4) {
        return true
      } else {
        return false
      }
    },
    nameEmpty() {
      if (this.businessName.model && !this.businessName.model.length < 4) {
        return true
      } else {
        return false
      }
    },
    typeEmpty() {
      if (!this.businessType.model.length < 4) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/mixins/index.scss';
#register-central {
  margin: 0.5em;
  padding: 1em;
  margin-right: auto;
  margin-top: 3em;
  width: 100%;
  @include flexColCenterBoth;
  .headers {
    @include headers;
    text-align: center;
    h1 {
      width: 70%;
      margin: 0 auto;
      margin-bottom: 0.5em;
      text-transform: unset !important;
      font-weight: bold;
      font-size: 1.4em;
    }
    h2 {
      text-transform: unset !important;
      font-size: 1em;
      font-weight: normal;
    }
  }
  .info {
    margin-top: 2em;
    width: 60%;
    @include flexSpace;
    .info-item {
      @include flexColCenter;
      max-width: 160px;
      width: max-content;
      .material-icons {
        color: var(--primary);
        border: 1px solid var(--primary);
        padding: 10px;
        @include rounded;
      }
      p {
        font-family: var(--source);
        font-weight: bold;
        margin-top: 1em;
        text-transform: unset;
        text-align: center;
      }
    }
  }
  form {
    @include form;
    margin: 0 auto;
    max-width: 450px;
    box-shadow: none;
    padding-left: 0;
    .notice {
      margin-top: 1em;
    }
    .input-group {
      .custom-select {
        @include custom-select;
      }
    }
  }
  .btn {
    margin-top: 3em;
    @include btn;
    width: auto !important;
  }
  @media screen and (max-width: 768px) {
    width: 100%;
    align-items: flex-start;
    .headers {
      width: 75%;
      h1 {
        width: inherit;
        text-align: left;
        margin: 0;
        margin-bottom: 0.5em;
      }
      h2 {
        width: inherit;
        text-align: left;
      }
    }
    .info {
      @include flexCol;
      .info-item:not(:last-of-type) {
        margin-bottom: 10px;
      }
    }
  }
  @media screen and (min-width: 769px) and (max-width: 1294px) {
    align-items: flex-start;
    .headers {
      width: 75%;
      @include flexColCenter;
      h1 {
        width: inherit;
        text-align: left;
        margin: 0;
        margin-bottom: 0.5em;
      }
      h2 {
        width: inherit;
        text-align: left;
      }
    }
    .info {
      align-self: flex-start;
    }
    form {
      padding-left: 4em;
    }
  }
}
</style>
