<template>
  <div id="home-page">
    <TheNavbar />
    <div id="intro">
      <div class="intro">
        <div class="intro-text">
          <h1 class="intro-heading">
            Hospitality management platform for leading businesses
          </h1>
          <p>
            Meet the new creative system tailored specifically for the
            hospitality industry. Move from the traditional Point of Sale to a
            complete suite for hospitality management platform that helps your
            business keep up with the pace.
          </p>
          <nuxt-link class="cta" to="/login">
            <span class="text">Get Started</span>
            <ios-arrow-forward-icon class="ion-icon" />
          </nuxt-link>
        </div>
        <div class="image">
          <img src="/dashboard.jpg" class="intro-image" />
        </div>
      </div>
    </div>
    <div id="trusted-by">
      <p>Trusted By a million Hotel Businesses</p>
    </div>
    <div id="how-it-works">
      <h1>Wanna know how it works?</h1>
      <h2>Learn how leading hotel businesses use this well crafted platform</h2>
      <div class="responsive-container">
        <video controls src="/video.mp4" class="responsive-iframe"></video>
      </div>
    </div>
    <div id="steps">
      <div
        class="step"
        v-for="(step, index) in steps"
        :key="index"
        :class="{ middle: index === 1 || index === 3 || index === 5 }"
      >
        <div class="step-text">
          <h1>{{ step.title }}</h1>
          <p>{{ step.text }}</p>
        </div>
        <div class="step-image">
          <img :src="step.image" :alt="step.title" :class="{image: index === 3}"/>
        </div>
      </div>
    </div>
    <div id="info">
      <h2>
        With Smart Hotel you get to let your clients know what you are offering
        from the comfort of their palm any time,anywhere. We list your favorites
        dishes and rooms to stay on the app allowing customers to have a look
        and also give reviews of the best your hotel offers.We help you make
        sure that your discounted packages reach the right market customer as we
        employee analytics algorithms, that help us predict what various
        customers using our apps like and we display that to them.
      </h2>
      <img src="/room.jpg" alt="dashboard image" />
      <h2>
        Smart Hotel users will have first hand insight of what your hotel is
        offering. We display directly to the customer's mobile phone using our
        smart hotel mobile app. Let your clients learn about you from their
        mobile phone anywhere using our Smart Hotel mobile app. Various QR code
        scanners are available on Google Play store. Smart Hotel stands out
        because it offers a single universal mobile app tailored for hospitality
        industry with all the features needed to make customer experience
        better.
      </h2>
      <img src="/menu-image.jpg" alt="dashboard image" />
    </div>
    <div id="try">
      <h1>Try out smarthotel for free today</h1>
      <h2>Get started now and experience first hand modern day hospitality</h2>
      <nuxt-link class="cta" to="/login">
        <span class="text">Get Started</span>
        <ios-arrow-forward-icon class="ion-icon" />
      </nuxt-link>
    </div>
    <TheFooter />
  </div>
</template>

<script>
import Vue from 'vue'
import TheNavbar from './TheNavbar'
import TheFooter from './TheFooter'
import { bus } from '../layouts/default'
import { mapActions } from 'vuex'
export default {
  components: {
    TheNavbar,
    TheFooter,
  },
  data() {
    return {
      page: true,
      steps: [
        {
          title: 'Order Processing',
          text:
            'Smart Hotel uses QR Code Scanner tailored specifically for the hospitality industry giving it a taste of universality that makes it perfect and easy to use with your customers. Let your customers make orders using their smartphone which makes it convenient for them.',
          image: '/qrcode-scanning.jpg',
        },
        {
          title: 'Simple and intuitive UI',
          text:
            'A simple and easy to use user interface that will definitely go a long way to help you get easily acquainted with the system and thus use it better. Ease of use mobile app for your customers offering them a better user experience',
          image: '/UI.jpg',
        },
        {
          title: 'Wider Market Reach',
          text:
            'With increase in android devices smart hotel will help you reach a wider market than using the website. We make sure that we advertise our application while the same time advertising your most favorites food and stay rooms. This helps your business expand its market reach.',
          image: '/market.jpg',
        },
        {
          title: 'Online Payment',
          text:
            'With our payment integrated into the system. Customer are able to pay their bills using the Smart Hotel mobile app giving you the best convenient way to handle transactions as they are updated in real time in your records. Let our system manage payment records for you.',
          image: '/payment.jpg',
        },
        {
          title: 'Online room reservation',
          text:
            'Help your clients make reservations for stays easily from their mobile device giving them a better user experience than on a desktop computer. With smart hotel we will always take the initiative to make sure that your clients get all the benefits of the platform easily.',
          image: '/users.jpg',
        },
        {
          title: 'Front office management',
          text:
            'Our Smart Hotel offers a complete suite for front office management to help your clients check in even without prior online booking and also check out. This convenience can’t be matched by no other except our system.',
          image: '/front.jpg',
        },
      ],
    }
  },
  methods:{
    ...mapActions({
      getCountries:'countries/getCountries'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';

#home-page {
  min-height: 100%;
  @include relative;
  overflow: hidden;
}
h1:not(.intro-heading) {
  max-width: 50%;
  margin: 0 auto;
}
h2 {
  max-width: 60%;
  margin: 0 auto;
}
h1 {
  @include h2;
  @include relative;
  font-size: 1.8em;
  margin: 10px auto;
  color: var(--darkBluey);
  font-family: var(--open);
  text-transform: capitalize;
  line-height: 40px;
  text-align: center;
}
p {
  font-size: 17px;
  color: var(--darkBluey);
  font-family: var(--open);
  line-height: 24px;
  word-spacing: 2px;
}
#intro {
  @include flexCol;
  justify-content: center;
  min-height: 100vh;
  color: var(--white);
  .intro-text {
    margin: 1.2em;
    h1 {
      text-align: left;
    }
  }
  .intro {
    color: var(--white);
    padding: 6em 1em 1em 1em;
    @include flex;
    .intro-text {
      width: 40%;
    }
    .image {
      width: 60%;
      margin: 20px auto 10px auto;
      img {
        width: 100%;
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
      }
      @include relative;
      &:after {
        width: 140%;
        height: 450%;
        border-radius: 50%;
        content: '';
        background: var(--gradient);
        @include absolute;
        z-index: -2;
        transform: rotate(130deg);
        top: -290%;
        right: -50%;
      }
    }
  }
  h1 {
    font-weight: bold;
    &:after {
      @include absolute;
      content: '';
      width: 70px;
      height: 3px;
      background: var(--darkBluey);
      left: 0;
      bottom: -10px;
    }
  }
  p {
    margin-top: 5em;
  }
  .btn-variant + p {
    margin-top: 10px;
    font-family: var(--open);
  }
}
.cta {
  @include btn-variant;
  width: 180px;
  margin-top: 2em;
  background: var(--primary);
  @include flexCenterVariant;
  .ion-icon {
    font-size: 18px;
    margin-left: 5px;
  }
}
.cta:hover .ion-icons {
  transform: translateX(5px);
  transition: all 0.4s;
}
#trusted-by {
  padding: 2em 0;
  background: var(--light_grey);
  p {
    text-transform: uppercase;
    font-family: var(--open);
    color: var(--darkBluey);
    text-align: center;
    font-weight: bold;
  }
}
#steps {
  padding: 1em;
  @include flexColCenter;
  .step {
    margin-top: 1em;
    @include flexCenter;
    .step-text {
      @include flexColCenterBoth;
      width: 50%;
      padding: 3em 5em;
      h1 {
        max-width: 100%;
        margin-bottom: 1em;
        text-transform: capitalize;
        font-size: 2em;
      }
    }
    .step-image {
      margin: 20px auto 10px auto;
      width:45%;
      padding: 0 2em;
      img {
        width: 100%;
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
      }
    }
    .step-image .image{
      width: 500px;
      img{
        height: 356px;
      }
    }
  }
  .step.middle {
    .step-image {
      order: 1;
    }
    .step-text {
      order: 2;
    }
  }
}
#info {
  @include flexColCenter;
  padding: 1em;
  background: #f4f6fa;
  h1 {
    text-transform: capitalize;
    font-size: 1.8em;
  }
  img {
    width: 70%;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
    margin: 2em 1em;
  }
}
h2 {
  font-size: 1em;
  margin: 2em auto;
  color: var(--darkBluey);
  font-weight: normal;
  line-height: 20px;
  text-align: center;
  word-spacing: 2px;
}
#how-it-works {
  padding: 1em 0;
  .responsive-container {
    @include relative;
    overflow: hidden;
    padding-top: 56.25%;
    .responsive-iframe {
      @include absolute;
      top: 5%;
      left: 20%;
      width: 60%;
      height: 60%;
      border: 0;
      box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
    }
  }
}

#try {
  padding: 3em;
  padding-top: 5em;
  background: var(--primary);
  @include flexColCenter;
  h1,
  h2 {
    color: var(--white);
  }
  .cta {
    background: var(--green);
  }
}
@media screen and (max-width: 1000px) {
  .image {
    display: none;
  }
  .intro-text {
    width: 80% !important;
    margin: 0 auto !important;
    text-align: center;
    h1 {
      text-align: center !important;
      &:after {
        display: none;
      }
    }
    @include flexColCenter;
    p {
      margin-top: 2em !important;
    }
  }
  .step {
    @include flexCol;
    margin-top: none !important;
    .step-text {
      width: 100% !important;
      text-align: center;
      padding: 1em !important;
    }
    .step-image {
      display: none;
    }
  }
}
@media screen and (max-width: 786px) {
  .intro-text {
    width: 90% !important;
    p {
      margin-top: 0.5em !important;
    }
  }
  .responsive-iframe {
    width: 80% !important;
    left: 10% !important;
  }
  h1:not(.intro-heading) {
    max-width: 90% !important;
    margin: 0 auto !important;
    font-size: 1.3em !important;
    line-height: 25px;
    margin-bottom: 20px !important;
  }
  h2 {
    max-width: 100% !important;
    margin: 0 auto !important;
  }
}
</style>
