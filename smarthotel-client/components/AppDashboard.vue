<template>
  <div id="dashboard">
    <TheSidebar />
    <div id="right">
      <AppBar />
      <app-popup />
      <div class="errors" v-if="errors.length">
        <div class="header">
          <span class="material-icons">warning</span>
          <h2>There was an error</h2>
        </div>
        <ul>
          <li v-for="error in errors" :key="error.id">{{ error.message }}</li>
        </ul>
      </div>
      <div id="right-content">
        <component :is="component"></component>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { bus } from '../layouts/default.vue'
import AddEmployee from '../components/AddEmployee.vue'
import AppAddMenu from '../components/AppAddMenu.vue'
import AppBar from '../components/AppBar.vue'
import AppFeedback from '../components/AppFeedback.vue'
import AppHome from '../components/AppHome.vue'
import AppCashiers from '../components/AppCashiers.vue'
import AppMenuCatalogue from '../components/AppMenuCatalogue.vue'
import AppMenuGrid from '../components/AppMenuGrid.vue'
import AppMenuList from './AppMenuList.vue'
import AppPopup from '../components/AppPopup.vue'
import AppOrder from '../components/AppOrder.vue'
import AppOrders from '../components/AppOrders.vue'
import AppSettings from '../components/AppSettings'
import AppSettingsAndDevices from '../components/AppSettingsAndDevices.vue'
import AppTables from '../components/AppTables'
import OrdersCompleted from '../components/OrdersCompleted'
import OrderList from '../components/OrderList'
import redirect from '../utilities/redirect'
import TheSidebar from '../components/TheSidebar.vue'
import AppAccount from '../components/AppAccount'
import formatNumber from '@/utilities/formatNumber'
import Vue from 'vue'
export default {
  components: {
    AddEmployee,
    AppAccount,
    AppAddMenu,
    AppBar,
    AppCashiers,
    AppFeedback,
    AppHome,
    AppMenuCatalogue,
    AppMenuGrid,
    AppMenuList,
    AppOrder,
    AppOrders,
    AppPopup,
    AppSettings,
    AppSettingsAndDevices,
    AppTables,
    TheSidebar,
    OrdersCompleted,
    OrderList,
  },
  data() {
    return {
      component: 'AppHome',
      errors: [],
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
    }),
  },
  methods: {
    changeComponent(link) {
      switch (link.alias) {
        case 'account':
          this.component = 'AppSettings'
          bus.$emit('changeHeader', 'account & settings')
          break
        case 'my-account':
          this.component = 'AppAccount'
          bus.$emit('changeHeader', 'my account')
          break
        case 'add':
          this.component = 'AddEmployee'
          bus.$emit('changeHeader', 'add user')
          break
        case 'cashiers':
          this.component = 'AppCashiers'
          bus.$emit('changeHeader', 'manage users')
          break
        case 'catalogue':
          this.component = 'AppMenuCatalogue'
          bus.$emit('changeHeader', 'menu catalogue')
          break
        case 'completed-orders':
          this.component = 'OrdersCompleted'
          bus.$emit('changeHeader', 'Completed Orders')
          break
        case 'device':
          this.component = 'AppSettingsAndDevices'
          bus.$emit('changeHeader', 'settings & devices')
          break
        case 'feedback':
          this.component = 'AppFeedback'
          bus.$emit('changeHeader', 'reporting')
          break
        case 'grid':
          this.component = 'AppMenuGrid'
          bus.$emit('changeHeader', 'menu grid')
          break
        case 'home':
          this.component = 'AppHome'
          bus.$emit('changeHeader', 'dashboard')
          break
        case 'list':
          this.component = 'AppMenuList'
          bus.$emit('changeHeader', 'menu list')
          break
        case 'menus':
          this.component = 'AppAddMenu'
          bus.$emit('changeHeader', 'add menus')
          break
        case 'order':
          this.component = 'AppOrder'
          bus.$emit('changeHeader', 'order information')
          break
        case 'order-list':
          this.component = 'AppOrders'
          bus.$emit('changeHeader', 'order management')
          break
        case 'pending-orders':
          this.component = 'OrderList'
          bus.$emit('changeHeader', 'order list online')
          break
        case 'tables':
          this.component = 'AppTables'
          bus.$emit('changeHeader', 'table management')
          break
        default:
          this.component = 'AppHome'
          break
      }
    },
  },
  async created() {
    bus.$on('selectLink', (link) => this.changeComponent(link))
    bus.$on('setErrors', (errors) => {
      this.errors = errors
    })
  },
  mounted() {
    if (process.title === 'browser' && localStorage) {
      const hotel = JSON.parse(localStorage.getItem('hotel'))
      if (hotel && typeof hotel.hotelPhoneNumber === 'string') {
        if (hotel.hotelPhoneNumber.includes('undefined')) {
          this.changeComponent({
            alias: 'account',
          })
        }
      } else if (hotel && !hotel.hotelPhoneNumber) {
        this.changeComponent({
          alias: 'account',
        })
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#dashboard {
  @include flex;
  min-height: 100vh;
  .loader {
    justify-self: center;
  }
}

#right {
  background: #f7f7f7;
  min-height: 100%;
  @include flex;
  @include relative;
  width: 100%;
  .errors {
    position: fixed;
    top: 0px;
    left: 60%;
    transform: translateX(-50%);
    background: var(--white);
    z-index: 500;
  }
  #right-content {
    @include flexCol;
    height: 100%;
    width: 100%;
    background: rgba($color: #f0f0f0, $alpha: 0.2);
  }
}

/* Mobile styles */

@media (min-width: 800px) {
  #right {
    margin-left: 250px;
  }
}
@media (max-width: 768px) {
  #right-content {
    width: 100% !important;
  }
}
</style>
