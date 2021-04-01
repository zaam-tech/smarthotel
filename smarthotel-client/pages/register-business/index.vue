<template>
  <div id="register-business">
    <div id="top-bar">
      <div class="brand">
        <nuxt-link to="/">
          <img src="/logo.svg" alt="app logo" />
        </nuxt-link>
      </div>
      <div class="settings" @click="showMenu">
        <span>Settings</span>
        <div class="tools" :class="{ shown: show }" @click="logout">Logout</div>
      </div>
    </div>
    <div id="main">
      <div id="indicator-bar" v-show="showBar">
        <div class="bar">
          <div class="progress-steps">
            <li
              v-for="(li, index) in steps"
              :key="index"
              :class="{
                active: index === activeStep,
                complete:
                  index + 1 === activeStep ||
                  index + 2 === activeStep ||
                  index + 3 === activeStep ||
                  index + 4 === activeStep,
              }"
              class="progress-step"
            >
              {{ index + 1 }}
            </li>
          </div>
          <div class="step">
            <span
              v-for="(item, index) in steps"
              :key="index"
              :class="item.class"
              >{{ item.text }}</span
            >
          </div>
        </div>
      </div>
      <div id="content__main">
        <app-popup />
        <keep-alive>
          <component :is="loading ? loadingComponent : component"></component>
        </keep-alive>
        <TheFAQ
          v-show="questionsIndex.length"
          :questions="questionsIndex"
          :absoluteValue="absoluteValue"
        />
      </div>
    </div>
    <FAQFooter />
  </div>
</template>

<script>
import Vue from 'vue'
import RegisterCentral from '../../components/RegisterCentral/index'
import BusinessInfo from '../../components/BusinessInfo/index'
import HotelInfo from '../../components/HotelInfo/index'
import IdVerification from '../../components/IdentityVerification/index'
import AdminInfo from '../../components/AdminInfo/index'
import { bus } from '../../layouts/default'
import TheFAQ from '../../components/TheFAQ'
import FAQFooter from '../../components/FAQFooter'
import Loading from '../../components/loading/index'
import AppPopup from '../../components/AppPopup'
import { v4 as uuidv4 } from 'uuid'
import { mapActions } from 'vuex'
import redirect from '~/utilities/redirect'
export default {
  head() {
    return {
      // script: [
      //       {
      //           src:`https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}&libraries=places`,
      //           async: true
      //       },
      //   ],
    }
  },
  components: {
    AppPopup,
    BusinessInfo,
    FAQFooter,
    IdVerification,
    Loading,
    HotelInfo,
    RegisterCentral,
    TheFAQ,
    AdminInfo,
  },
  data() {
    return {
      absolute: false,
      absoluteValue: 0,
      activeStep: -1,
      component: 'RegisterCentral',
      components: [
        'RegisterCentral',
        'BusinessInfo',
        'AdminInfo',
        'HotelInfo',
        'IdVerification',
      ],
      steps: [
        {
          class: 'item',
          text: 'Business information',
          questions: [
            {
              id: uuidv4(),
              text: 'What is the correct format of the phone number',
              ans:
                'The number must be prefixed with a country code. Example : +254 000 000 000',
            },
            {
              id: uuidv4(),
              text:
                'What should i do if i dont have a mobile number to receive an SMS',
              ans:
                'You can enter a landline phone number and select the call option to receive the phone verification PIN',
            },
            {
              id: uuidv4(),
              text: 'What if i havent received the SMS with the PIN',
              ans:
                'Check if you have entered your phone number in the correct format. And then request for the PIN again',
            },
            {
              id: uuidv4(),
              text:
                'What should i do if my country is not listed on the call option',
              ans:
                'If the call option is not available in your country then select the SMS option',
            },
            {
              id: uuidv4(),
              text: 'How is the primary contact defined?',
              ans:
                'The primary contact is the person who is regarded as the system administrator of the hotel platform on the client side. He provides the primary information about the hotel or business. He is also in charge of adding other users into the system. Zaam Techonologies regard actions taken by the primary contact person as legal',
            },
          ],
        },
        {
          class: 'item',
          text: 'Admin information',
          questions: [
            {
              id: uuidv4(),
              text:
                'Why does a Primary contact person need to provide his/her personal information?',
              ans:
                'The primary contact is the person who is regarded as the system administrator of the hotel platform on the client side. He provides the primary information about the hotel or business. He is also in charge of adding other users into the system. Zaam Techonologies regard actions taken by the primary contact person as legal and thus providing personal information helps Zaam Technologies establish the legality of identification of the SmartHotel platform users.',
            },
          ],
        },
        {
          class: 'item',
          text: 'Hotel information',
          questions: [
            {
              id: uuidv4(),
              text: 'What is a hotel name?',
              ans:
                'A hotel name is the name known by the public or displayed on the entrance of the hotel residence. It will be displayed to your customers or clients.',
            },
            {
              id: uuidv4(),
              text: 'Can i update the hotel name later?',
              ans:
                'Yes you can provide a new name to be displayed by accessing the Settings tab of your SmartHotel account.',
            },
          ],
          // questions:[
          // 	{
          // 		id:uuidv4(),
          // 		text:'Why should i provide my Credit card details?',
          // 		ans:'We will charge your Credit card the subscription fee(if applicable) for the first month,we will charge your SmartHotel account balance in future months or your Credit card if have negative balance in your account at the end of the settlement period',
          // 	},
          // 	{
          // 		id:uuidv4(),
          // 		text:'Can i provide a different Credit card after i have opened my account?',
          // 		ans:"You can provide a new Credit card at any time via 'Account info' under the settings tab of your account",
          // 	},
          // 	{
          // 		id:uuidv4(),
          // 		text:'When will the subscription fee be charged?',
          // 		ans:'The subscription fee will be charged after you complete the registration process of a hotel and your information is verified.',
          // 	},
          // 	{
          // 		id:uuidv4(),
          // 		text:'What happens when i enter my Credit card details?',
          // 		ans:'When you enter a new card or update information for an existing card,Zaam Technologies will ask your bank to verify your identity and validate your Credit card. Zaam Techologies does not actually make the charge',
          // 	},
          // 	{
          // 		id:uuidv4(),
          // 		text:'What are the accepted Credit cards?',
          // 		ans:'We accept the following Credit cards: AMEX,VISA and MasterCard. We do not accept altenative charge methods such as prepaid Credit cards,gift certificates or online payment sytems (PayPal,Stripe)',
          // 	},
          // ],
        },
        {
          class: 'item',
          text: 'Verification',
          questions: [
            {
              id: uuidv4(),
              text: 'Why is verification required?',
              ans:
                'In order to keep our platform protected for both customers and our clients (the hotels) we verify the information of businesses and individuals.',
            },
            {
              id: uuidv4(),
              text: 'How will i know i have been verified',
              ans:
                'We will email you about the progress once verification is complete.',
            },
          ],
        },
      ],
      show: false,
      showBar: false,
      loading: true,
      loadingComponent: 'Loading',
    }
  },
  mounted() {
    bus.$on('initSteps', () => {
      this.activeStep = 0
      this.loading = false
      this.showComponent()
    })
    bus.$on('changeComponent', (position) => {
      this.loading = false
      if (position == 'forward') {
        this.activeStep++
        this.showComponent()
      } else {
        this.activeStep--
        this.showComponent()
      }
    })
    this.retrieveStep()
    this.showComponent()
    bus.$on('showBar', () => (this.showBar = true))
    bus.$on('showLoading', () => {
      this.loading = true
    })
    setTimeout(() => {
      this.loading = false
    }, 2000)
    bus.$on('hideLoading', () => (this.loading = false))
  },
  computed: {
    questionsIndex() {
      return this.activeStep >= 0
        ? this.steps[this.activeStep].questions
        : [
            {
              id: uuidv4(),
              text: 'What should i do about it',
              ans: 'You really should do something about it',
            },
            {
              id: uuidv4(),
              text: 'What should i do about it',
              ans: 'You really should do something about it',
            },
            {
              id: uuidv4(),
              text: 'What should i do about it',
              ans: 'You really should do something about it',
            },
            {
              id: uuidv4(),
              text: 'What should i do about it',
              ans: 'You really should do something about it',
            },
            {
              id: uuidv4(),
              text: 'What should i do about it',
              ans: 'You really should do something about it',
            },
          ]
    },
  },
  created() {
    if (process.title === 'browser') {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        redirect('/login')
      }
      const step = localStorage.getItem('step')
      switch (step) {
        case 'BusinessInfo':
          this.absolute = true
          this.absoluteValue = -125
          break
        case 'AdminInfo':
          this.absolute = true
          this.absoluteValue = -125
          break
        case 'HotelInfo':
          this.absolute = true
          this.absoluteValue = -125
          break
        case 'IdVerification':
          this.absolute = true
          this.absoluteValue = -125
          break
        default:
          this.absolute = false
          this.absoluteValue = 0
          break
      }
    }
  },
  methods: {
    ...mapActions({
      logoutUser: 'auth/logout',
    }),
    async logout() {
      try {
        await this.logoutUser()
        redirect('/')
      } catch (error) {
        bus.$emit('showPopup', {
          message: `${error.message}`,
          success: false,
        })
      }
    },
    showMenu() {
      this.show = !this.show
    },
    showComponent() {
      this.setStep(this.activeStep)
      switch (this.activeStep) {
        case 0:
          this.component = 'BusinessInfo'
          break
        case 1:
          this.component = 'AdminInfo'
          break
        case 2:
          this.component = 'HotelInfo'
          break
        case 3:
          this.component = 'IdVerification'
          break
        default:
          this.component = 'RegisterCentral'
          break
      }
    },
    setStep(step) {
      if (window && window.localStorage) {
        const storage = window.localStorage
        storage.removeItem('step')
        switch (step) {
          case 0:
            storage.setItem('step', 'BusinessInfo')
            break
          case 1:
            storage.setItem('step', 'AdminInfo')
            break
          case 2:
            storage.setItem('step', 'HotelInfo')
            break
          case 3:
            storage.setItem('step', 'IdVerification')
            break
          default:
            storage.setItem('step', 'RegisterCentral')
            break
        }
      }
    },
    retrieveStep() {
      if (window && window.localStorage) {
        const storage = window.localStorage
        const step = storage.getItem('step')
        if (step) {
          switch (step) {
            case 'BusinessInfo':
              this.activeStep = 0
              break
            case 'AdminInfo':
              this.activeStep = 1
              break
            case 'HotelInfo':
              this.activeStep = 2
              break
            case 'IdVerification':
              this.activeStep = 3
              break
            default:
              this.activeStep = -1
              break
          }
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/mixins/index.scss';
#register-business {
  @include flexCol;
  @include relative;
  #top-bar {
    background: #eee;
    padding: 1em;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 5;
    border-bottom: 1px solid #f0f0f0;
    @include flexSpace;
    .brand {
      a {
        color: var(--dark);
        font-family: var(--source);
        text-transform: uppercase;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
      }
    }
    .settings {
      width: 15%;
      @include flexCenterBoth;
      @include relative;
      font-weight: bold;
      &:hover {
        cursor: pointer;
      }
      .tools {
        @include absolute;
        border-top: 5px solid var(--dark);
        background: var(--white);
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
        color: var(--primary);
        display: none;
        top: 30px;
        right: 50px;
        padding: 0.75em 1em;
        font-family: var(--sans);
      }
    }
    .shown {
      display: flex !important;
    }
  }
  #main {
    margin-top: 4.5em;
    font-family: var(--source);
    #indicator-bar {
      @include flex;
      max-width: 1300px;
      margin: 1em auto;
      padding-left: 3em;
      .bar {
        padding: 20px;
        width: 60%;
        min-width: 600px;
        .progress-steps,
        .step {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          align-content: center;
          text-align: center;
          margin: 0 auto;
          counter-reset: step;
        }
        .progress-step {
          border-radius: 50%;
          left: 40%;
          color: var(--white);
          background: var(--green);
          font-weight: bold;
          font-family: var(--source);
          width: 35px;
          height: 35px;
          @include relative;
          border: 1px solid var(--light_grey);
          @include flexCenterBoth;
          &.active {
            background: var(--orange);
            ~ .progress-step {
              color: var(--dark);
              background: var(--white);
            }
            ~ .progress-step::after {
              background: var(--light_grey);
            }
          }
          &.complete {
            background: var(--green);
          }
          &.complete:after {
            background: var(--green);
          }
          &:after {
            content: '';
            @include absolute;
            top: 50%;
            left: 325%;
            transform: translate(-50%);
            height: 2px;
            width: 180px;
            background: var(--light_grey);
            z-index: -1;
          }
          &:last-child::after {
            display: none;
          }
        }
      }
      @media screen and (max-width: 560px) {
        @include flexCol;
        @include centerVariant;
        .bar {
          li {
            &::after {
              top: 50%;
            }
          }
        }
      }
    }
    #content__main {
      @include flexSpace;
      #popup {
        left: 50% !important;
        transform: translateX(-90%) !important;
      }
      .loader {
        width: 100%;
      }
      form {
        margin: 0 auto !important;
      }
    }
  }
}
</style>
