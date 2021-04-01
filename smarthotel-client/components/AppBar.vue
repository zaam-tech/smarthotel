<template>
  <div class="top">
    <div class="menu" @click="showNav">
      <span class="ti ti-menu"></span>
    </div>
    <div class="nav-text">
      <h1>{{ title }}</h1>
      <h3 v-show="title === 'dashboard'">Welcome back, {{ user.name }}</h3>
    </div>
    <div class="right">
      <h2>{{ hotelName }}</h2>
      <div class="account" @click="showAccOptions">
        <img src="/img_avatar.png" alt="Image" />
        <span class="account-name">{{ user.type }}</span>
      </div>
      <div class="acc-options">
        <the-drop-down />
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from '../layouts/default'
import TheDropDown from './TheDropdown.vue'
import { mapState } from 'vuex'
export default {
  components: {
    TheDropDown,
  },
  data() {
    return {
      clicked: false,
      title: 'dashboard',
      hotelName: 'Dummy',
      user: {
        name: '',
        type: '',
      },
    }
  },
  computed: {
    ...mapState(['products']),
    userType() {
      return this.user.type.toLowerCase().includes('admin')
        ? 'Administrator'
        : 'Cashier'
    },
  },
  methods: {
    logout() {},
    showAccOptions() {
      this.clicked = !this.clicked
    },
    showNav() {
      bus.$emit('showNav')
    },
    setHotelData() {
      const hotel = JSON.parse(localStorage.getItem('hotel'))
      const user = JSON.parse(localStorage.getItem('user'))
      if (hotel) {
        this.hotelName = hotel.hotelName
      }
      if (user) {
        this.user.name = user.fullName
        this.user.type = user.userType
      }
    },
  },
  mounted() {
    bus.$on('hideDropdown', () => (this.clicked = false))
    bus.$on('changeHeader', (title) => (this.title = title))
    bus.$on('hotelUpdated', () => this.setHotelData())
    if (process.title === 'browser') {
      if (window && window.localStorage) {
        const hotel = JSON.parse(localStorage.getItem('hotel'))
        this.setHotelData()
        setTimeout(() => {
          this.hotelName = hotel.hotelName
        }, 1000)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
.top {
  @include flex;
  @include flexSpace;
  @include center;
  font-family: var(--open);
  padding: 1rem 2rem;
  background: var(--white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
  @include absolute;
  margin-bottom: 20px;
  top: 0;
  left: 0;
  width: 100%;
  .nav-text {
    @include flexCol;
    h3 {
      font-weight: normal;
      font-size: 15px;
      margin-top: 0.75em;
    }
  }
  h1,h2 {
    @include h2_variant;
    font-size: 1em;
    @include flexCenterVariant;
  }
}
.account {
  cursor: pointer;
  @include flexCenterBoth;
  background: var(--white);
  border-radius: 50px;
}
.acc-options {
  display: none;
}
.account:hover + .acc-options {
  display: block;
}
.acc-options:hover {
  display: block;
}

.right {
  @include flex;
  @include center;
  justify-content: flex-end;
  width: auto;
  padding-right: 1rem;
  @include relative;
}
.btn {
  @include btn;
}
h2 {
  border-right: 1px solid #ddd;
  padding-right: 20px;
}
img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 10px;
}
.menu {
  display: none;
}
@media screen and (max-width: 767px) {
  .top {
    justify-content: space-around;
  }
  .menu {
    display: flex;
    .ti-menu {
      padding: 0.25rem 0.75rem;
      font-size: 1.25rem;
      line-height: 1;
      cursor: pointer;
    }
  }
  .right {
    width: initial;
    padding-right: 0;
    h2 {
      display: none;
    }
  }
}
@media screen and (max-width: 1010px) {
  .account-name {
    display: none;
  }
}
</style>
