<template>
  <div id="content">
    <div class="headers bp border">
      <h1>Hotel information</h1>
      <h2>Hotel information and location</h2>
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="input-group mb">
        <label>Hotel name</label>
        <input
          type="text"
          name="name"
          class="input"
          @input="setHotelInfo($event)"
          :class="{
            valid: !name.invalid && name.model,
            invalid: name.invalid,
          }"
        />
      </div>
      <div class="input-group mb">
        <label>Hotel location</label>
        <input
          type="text"
          name="location"
          class="input"
          @input="setHotelInfo($event)"
          ref="input"
          :class="{
            valid: !location.invalid && location.model,
            invalid: location.invalid,
          }"
        />
        <div id="suggestions"></div>
      </div>
      <div class="responsive-container">
        <div class="responsive-iframe">
          <img src="/map.png" alt="map" />
        </div>
      </div>
      <div class="arrows">
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
import { bus } from '../../layouts/default'
import { mapActions } from 'vuex'
import autoCompleteApi from '@/utilities/auto-complete'
export default {
  data() {
    return {
      name: {
        invalid: false,
        model: '',
        required: false,
      },
      location: {
        invalid: false,
        model: '',
        required: false,
      },
    }
  },
  methods: {
    ...mapActions({
      updateHotelInfo: 'hotel/updateHotelInfo',
    }),
    setHotelInfo(event) {
      const input = this.$refs.input
      const autoComplete = autoCompleteApi(input,google)
      const target = event.target
      const { name, value } = target
      this[name].model = value
      if (!this[name].model || this[name].model.length < 4) {
        this[name].invalid = true
        this[name].required = true
      } else {
        this[name].invalid = false
        this[name].required = false
      }
    },
    back() {
      bus.$emit('changeComponent', 'back')
    },
    async handleSubmit() {
      const { name, location } = this
      bus.$emit('showLoading')
      try {
        const hotel = {
          hotelName: name.model,
          address: location.model,
        }
        await this.updateHotelInfo(hotel)
        bus.$emit('changeComponent', 'forward')
      } catch (error) {
        bus.$emit('hideLoading')
        bus.$emit('showPopup', { message: error.message, success: false })
      }
    },
  },
  mounted() {
    bus.$emit('showBar')
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/mixins/index.scss';
.headers {
  @include headers;
  max-width: 500px;
  h1 {
    color: #000;
    font-weight: bold;
    font-size: 1.2em;
  }
}
#content {
  max-width: 1000px;
  margin: 1em auto;
  margin-bottom: 4em;
  form {
    @include form;
    width: 90%;
    width: 500px;
    box-shadow: none;
    padding: 0;
    .arrows {
      @include flex;
      @include centerVariant;
      margin-top: 1em;
      .btn {
        width: 150px;
        margin: 0 5px;
        @include flexCenterBoth;
        &:last-of-type {
          @include btn;
          margin-left: 1em;
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
}
@media screen and (max-width: 1000px) {
  #content {
    @include flexColCenter;
    margin: 0 auto;
  }
}
.responsive-container {
  @include relative;
  overflow: hidden;
  padding-top: 56.25%;
  .responsive-iframe {
    @include absolute;
    margin-bottom: 1em;
    top: 5%;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--grey);
  }
  img {
    width: 100%;
  }
}
</style>
