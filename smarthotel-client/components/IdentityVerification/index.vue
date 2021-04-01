<template>
  <div id="id-verification">
    <transition name="fade" appear>
      <the-modal :showModal="showModal">
        <div class="modal-body" v-if="showModal" slot="help-modal">
          <h1 class="modal-title">Uploading Instructions</h1>
          <div class="modal-content">
            <ul>
              <li v-for="detail in details" :key="detail.id">
                {{ detail.text }}
              </li>
            </ul>
          </div>
          <div class="buttons">
            <button class="button" @click="toggleModal">Cancel</button>
            <button class="button" @click="selectFile">Continue</button>
          </div>
        </div>
      </the-modal>
    </transition>

    <div id="content">
      <div class="headers">
        <h1>Identity Verification</h1>
      </div>
      <h4>Upload Document</h4>
      <form @submit.prevent="validateFields">
        <div class="content">
          <div class="header">
            <span>Name</span>
            <span>Date Of Birth</span>
            <span>Country of Birth</span>
            <span>Country of Citizenship</span>
            <span class="identity">Identity Data</span>
          </div>
          <div class="info">
            <div class="first">
              {{ name }}
            </div>
            <div class="country">{{ dob }}</div>
            <div class="country">{{ cob }}</div>
            <div class="country">{{ coi }}</div>
            <div>
              <p>
                <strong>{{ idData.title }}</strong>
                <span>: {{ idData.id }}</span>
              </p>
              <p>
                <strong>Expiration Date</strong>
                <span>: {{ idData.expDate }}</span>
              </p>
              <p>
                <strong>Country Of Issue</strong>
                <span>: {{ idData.coi }}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="header">
            <span>Identity Document</span>
          </div>
          <div class="info buttons">
            <input
              type="file"
              name="id-front"
              class="input-field"
              hidden
              ref="front"
              @change="add"
            />
            <button class="button" @click="toggleModal" data-name="front">
              Upload front side
            </button>
            <input
              type="file"
              name="id-back"
              class="input-field"
              hidden
              ref="back"
              @change="add"
            />
            <button class="button" @click.prevent="toggleModal" data-name="back">
              Upload back side
            </button>
            <p>Upload the back side even if its blank</p>
            <p class="error" v-if="error">{{ message }}</p>
          </div>
        </div>
        <div class="content">
          <div class="header">
            <span>Residential Address</span>
          </div>
          <div class="info">
            <div>
              <p>
                <strong>Country</strong>
                <span>: {{ residentialAddress.country }}</span>
              </p>
              <p>
                <strong>Region</strong>
                <span>: {{ residentialAddress.region }}</span>
              </p>
              <p>
                <strong>City</strong>
                <span>: {{ residentialAddress.city }}</span>
              </p>
              <p>
                <strong>Postal Code</strong>
                <span>: {{ residentialAddress.postalCode }}</span>
              </p>
              <p>
                <strong>Address line 1</strong>
                <span>: {{ residentialAddress.address1 }}</span>
              </p>
              <p v-show="residentialAddress.address2">
                <strong>Address line 2</strong>
                <span>: {{ residentialAddress.address2 }}</span>
              </p>
            </div>
          </div>
        </div>
        <!-- <div class="content">
                    <div class="header">
                        <span>Additional Document</span>
                    </div>
                    <div class="info">
                        <p>Choose a document type from the drop-down list</p>
                        <div class="custom-select">
                            <select name="statement">
                                <option>Bank Account Statement</option>
                                <option>Credit Card Statement</option>
                            </select>
                            <span class="custom-arrow"></span>
                        </div>
                        <button>Upload Additional Document</button>
                    </div>
                </div> -->
        <div class="content">
          <div class="header">
            <span>Business Address</span>
          </div>
          <div class="info">
            <div>
              <p>
                <strong>Country</strong>
                <span>: {{ country }}</span>
              </p>
              <p>
                <strong>Region</strong>
                <span>: {{ region }}</span>
              </p>
              <p>
                <strong>City</strong>
                <span>: {{ city }}</span>
              </p>
              <p>
                <strong>Postal Code</strong>
                <span>: {{ postalCode }}</span>
              </p>
              <p>
                <strong>Address line 1</strong>
                <span>: {{ address1 }}</span>
              </p>
              <p v-show="address2">
                <strong>Address line 2</strong>
                <span>: {{ address2 }}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="header">
            <span>Business Name</span>
            <span>Company Registration Number</span>
          </div>
          <div class="info">
            <div>
              {{ businessName }}
            </div>
            <div>
              {{ regNumber }}
            </div>
          </div>
        </div>
        <div class="arrows">
          <button @click.prevent="back">
            <span>Previous</span>
          </button>
          <button @click="validateFields">
            <span>Submit</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import TheModal from '../TheModal'
import { bus } from '../../layouts/default'
import { mapActions } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import redirect from '@/utilities/redirect'
export default {
  data() {
    return {
      address1: '1554',
      address2: '1554',
      residentialAddress: {
        address1:'',
        address2:'',
        country:'',
        city:'',
        postalCode:'',
        region:''
      },
      businessName: 'Sitranet Telecomms',
      cob: 'Kenya',
      coi: 'Kenya',
      country: 'Kenya',
      city: 'Nairobi',
      dob: '16 Sept 1995',
      id: {
        front: null,
        back: null,
      },
      idData: {
        id: 34748027,
        expDate: '19 Nov 2038',
        coi: 'Kenya',
        title: 'National Id',
      },
      name: 'GIDEON OCHIENG OKWACHI',
      regNumber: '',
      details: [
        {
          id: uuidv4(),
          text: 'Details on the document should match given details',
        },
        {
          id: uuidv4(),
          text:
            'Scan the original document in color or take a picture using your mobile device. Do not submit a screenshot',
        },
        {
          id: uuidv4(),
          text:
            'The document image must be high quality, colored and unobstructed. The image must show a full document page or in case of national ID, both of the card',
        },
        {
          id: uuidv4(),
          text: 'The document must be in English or Kiswahili',
        },
        {
          id: uuidv4(),
          text: 'The document should be less than 10 MB in size',
        },
        {
          id: uuidv4(),
          text: 'Accepted formats are .png, .jpg, .jpeg,. pdf',
        },
      ],

      fields: {
        front: {},
        back: {},
      },
      postalCode: '1230',
      region: 'Kenya',
      side: '',
      showModal: false,
      message: '',
      error: false,
    }
  },
  components: {
    TheModal,
  },
  methods: {
    ...mapActions({
      upload: 'hotel-registration/uploadImages',
    }),
    async add(event) {
      const file = event.target.files[0]
      const MAX_SIZE = 100000
      const tooLarge = file.size > MAX_SIZE
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpeg',
        'application/pdf',
      ]
      if (allowedTypes.includes(file.type) && !tooLarge) {
        if (this.side === 'front') {
          this.id.front = file
          try {
            const response = await this.upload(this.id.front)
          } catch (error) {
            console.log(error)
          }
        } else {
          this.id.back = file
          try {
            const response = await this.upload(this.id.back)
          } catch (error) {
            console.log(error)
          }
        }
        this.message = ''
        this.error = false
      } else {
        this.message = tooLarge
          ? `File is too big. Max size is ${MAX_SIZE / 1000}MB's`
          : 'File selected is not an image'
        this.error = true
      }
    },
    back() {
      bus.$emit('changeComponent', 'back')
    },
    toggleModal(event) {
      this.showModal = !this.showModal
    },
    selectFile() {
      if (this.side === 'front') {
        const { front } = this.$refs
        const File = front
        File.click()
      } else {
        const { back } = this.$refs
        const File = back
        File.click()
      }
    },
    validateFields() {
      localStorage.removeItem('step')
      localStorage.removeItem('hotel')
      redirect('/dashboard')
    },
  },
  mounted() {
    bus.$on('toggeModal', (val) => (this.showModal = val))
    if (process.title === 'browser' && localStorage) {
      const temp = localStorage.getItem('hotel')
      const hotel = JSON.parse(temp)
      this.name = hotel.creator.fullName
      const {
        business: { address },
      } = hotel
      const { address1, address2, country, city, postalCode, region } = address
      this.address1 = address1
      this.address2 = address2
      const creatorAddress = hotel.creator.address
      this.residentialAddress.address1 = creatorAddress.address1
      this.residentialAddress.address2 = creatorAddress.address2
      this.residentialAddress.country = creatorAddress.country
      this.residentialAddress.city = creatorAddress.city
      this.residentialAddress.postalCode = creatorAddress.postalCode
      this.residentialAddress.region = creatorAddress.region
      this.businessName = hotel.businessName
      this.cob = hotel.creator.birthCountry
      this.ci = hotel.creator.citizenShip
      this.city = city
      this.country = country
      this.region = region
      this.postalCode = postalCode
      this.dob = hotel.creator.DOB
      this.idData.expDate = hotel.creator.expiryDate
      this.idData.id = hotel.creator.identity
      this.idData.title =
        hotel.creator.identityDoc.toLowerCase() === 'passport'
          ? hotel.creator.identityDoc
          : 'National ID #'
      this.regNumber = hotel.business.regNo
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/mixins/index.scss';
#id-verification {
  max-width: 1000px;
  margin: 1em auto;
  #content {
    margin-top: 1em;
    min-width: 500px;
    max-width: 670px;
    .headers {
      max-width: 650px;
      h1 {
        color: var(--charcoal);
        text-align: center;
      }
    }
    h3 {
      text-align: center;
      margin: 2em;
      color: var(--charcoal);
      @include flexCol;
      font-size: 16px;
      font-weight: normal;
      font-family: var(--open);
      .help {
        align-self: flex-end;
        color: var(--primary);
        cursor: pointer;
      }
    }
    h4 {
      font-family: var(--open);
      font-weight: bold;
    }
    form {
      padding-left: 0;
      box-shadow: none;
      border: none;
      button.button {
        @include button;
      }
      .content {
        display: grid;
        grid-template-columns: 40% 60%;
        grid-template-rows: 3fr;
        margin: 2em 0;
        font-family: var(--open);
        color: #000;
        border: 1px solid #d9d9d9;
        .first-header {
          padding: 12px 15px;
        }
        .header,
        .info {
          font-size: 15px;
          border-bottom: none;
          font-weight: normal;
          @include flexCol;
          div {
            @include flexCenterVariant;
            flex-wrap: wrap;
            padding: 12px 15px;
            border-top: 1px solid #d9d9d9;
            width: 100%;
            &:first-of-type {
              border-top: none;
            }
            &:last-of-type {
              height: auto;
              @include flexCol;
              align-items: flex-start;
            }
            p {
              @include flexCenterVariant;
            }
          }

          button + p {
            margin: 1.5em 0;
            color: var(--charcoal);
          }
        }
        .buttons {
          padding: 1.5em;
        }
        .header {
          background: #f3f3f3;
          span {
            padding: 12px 15px;
            border-top: 1px solid #d9d9d9;
            &:first-of-type {
              border-top: none;
            }
          }
          .identity {
            height: 82px;
          }
        }
      }
      .arrows {
        text-align: center;
        @include flexCenterVariant;
        @include centerVariant;
        button:first-of-type {
          @include btn-grey;
        }
        button:last-of-type {
          @include btn;
          margin-left: 0.5em;
          border-radius: 2px;
        }
        button {
          width: 150px;
        }
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
