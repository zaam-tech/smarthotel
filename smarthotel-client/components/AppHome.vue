<template>
  <div id="home-content">
    <div class="main">
      <div class="top">
        <div class="notification">
          <h2>Notifications</h2>
          <p>
            Starting January 2021 the system will launch. Expect more features
            to come
          </p>
        </div>
        <div class="cards">
          <div class="stat card" v-for="stat in allStats" :key="stat.id">
            <div class="stat-header">
              <span
                :class="stat.cssClass"
                v-if="stat.cssClass.includes('material-icons')"
                >{{ stat.icon }}</span
              >
              <component
                :is="stat.icon"
                :class="{ [stat.cssClass]: true, ['ion-icon']: true }"
                v-else
              />
              <span>{{ stat.name }}</span>
            </div>
            <div class="total">
              <span>{{ stat.total }}</span>
            </div>
          </div>
        </div>
        <div class="info">
          <div class="card">
            <h2>Sales Summary</h2>
            <h5>Realtime Updates</h5>
            <h5>Ordered Product Sales</h5>
            <h5>Units</h5>
            <div class="stat" v-for="stat in monthlyStats" :key="stat.id">
              <p class="stat-time">{{ stat.time }}</p>
              <p class="stat-total">{{ stat.total }}</p>
              <p class="stat-units">{{ stat.units }}</p>
            </div>
          </div>
        </div>
        <div id="menu-container" v-show="productsLoaded">
          <div class="menu-container">
            <div class="headers">
              <h3>Today's Hot Menu</h3>
              <h4 @click="viewAll($event)" data-name="hey">View All</h4>
            </div>
            <div class="menu-items">
              <div
                class="menu-item"
                v-for="product in productsVariant"
                :key="product.id"
              >
                <div class="img">
                  <img :src="product.imageUrl" :alt="product.productName" />
                </div>
                <div class="item-body">
                  <h4>{{ product.productName }}</h4>
                  <h5>{{ product.description }}</h5>
                </div>
                <div class="item-info">
                  <h6>{{ product.cost }}</h6>
                </div>
              </div>
            </div>
          </div>
          <div class="order-list">
            <div class="headers">
              <h3>Online Order List</h3>
              <h4 @click="viewAll($event)" data-name="pending-orders">
                View All
              </h4>
            </div>
            <div class="product-list">
              <div class="menu-items">
                <div
                  class="menu-item"
                  v-for="product in productsVariant"
                  :key="product.id"
                >
                  <div class="img">
                    <img :src="product.imageUrl" :alt="product.productName" />
                  </div>
                  <div class="item-body">
                    <h4>{{ product.productName }}</h4>
                    <h5>{{ product.description }}</h5>
                  </div>
                  <div class="item-info">
                    <h6>{{ product.cost }}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="no-content" v-show="!productsLoaded">
          <h1>No Content Available yet</h1>
        </div>
      </div>
      <div class="bottom" v-show="productsLoaded">
        <div class="trending-orders">
          <h3>Top Trending Orders</h3>
          <div class="trending-list">
            <div
              class="trending-item"
              v-for="product in slicedProducts"
              :key="product.id"
            >
              <div class="img">
                <img :src="product.imageUrl" :alt="product.productName" />
              </div>
              <div class="item-header">
                <h4>{{ product.productName }}</h4>
                <h5>{{ product.cost }}</h5>
              </div>
              <div class="item-info">
                <div class="item">
                  <p>Orders</p>
                  <span>15</span>
                </div>
                <div class="item">
                  <p>Income</p>
                  <span>$175</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 } from 'uuid'
import { mapState, mapActions, mapGetters } from 'vuex'
import { bus } from '~/layouts/default.vue'
export default {
  data() {
    return {
      allProducts: [],
      allStats: [],
      monthlyStats: [
        {
          id: v4(),
          time: 'today',
          total: 1200,
          units: 25,
        },
        {
          id: v4(),
          time: '7 Days',
          total: 1200,
          units: 25,
        },
        {
          id: v4(),
          time: '15 Days',
          total: 1200,
          units: 25,
        },
        {
          id: v4(),
          time: '30 Days',
          total: 1200,
          units: 25,
        },
      ],
    }
  },
  computed: {
    ...mapState(['tabs', 'products', 'stats']),
    isLoaded() {
      if (this.stats && this.stats.allStats.length) {
        return true
      } else {
        return false
      }
    },
    productsLoaded() {
      return this.allProducts.length > 0 ? true : false
    },
    ordersLoaded() {
      return this.allOrders.length > 0 ? true : false
    },
    ...mapGetters({
      categorizedProductsList: 'products/categorizedProductsList',
      allOrders: 'orders/allOrders',
    }),
    slicedProducts() {
      return this.allProducts.slice(2, 7)
    },
    productsVariant() {
      return this.allProducts.slice(0, 10)
    },
    slicedOrders() {
      return this.allOrders.slice(0, 10)
    },
  },
  methods: {
    ...mapActions({
      activateLink: 'links/activateLink',
      selectTab: 'tabs/selectTab',
      getCategories: 'products/getAllCategories',
    }),
    activate(activeLink) {
      this.activateLink('links/activateLink', activeLink)
    },
    select(tab) {
      this.selectTab('tabs/selectTab', tab)
    },
    viewAll(event) {
      const { target } = event
      const { name } = target.dataset
      bus.$emit('selectLink', {
        alias: name,
      })
    },
  },
  async mounted() {
    this.allStats = this.stats.allStats
    this.allProducts = this.categorizedProductsList
    try {
      await this.getCategories()
    } catch (error) {
      bus.$emit('showPopup', {
        message: 'Network Error. Check your connection',
        success: false,
      })
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#home-content {
  padding: 1.2em 0.95em;
  margin-top: 50px;
  .main {
    @include flexCol;
    padding: 1.5em 0;
    h3 {
      margin-bottom: 1rem;
      font-size: 1rem;
      font-family: var(--open);
      font-weight: bold;
      text-transform: uppercase;
      color: #65686b;
    }
    .top {
      display: grid;
      width: 100%;
      grid-template-columns: repeat(12, 1fr);
      grid-template-rows: 70px 100px 200px 300px;
      grid-gap: 15px;
      #no-content {
        grid-column: 1/13;
        @include flexCenterBoth;
      }
      .notification {
        grid-column: 1 / 9;
        grid-row: 1/ 1;
        background: var(--white);
        padding: 1em;
        border-radius: 10px;
        @include flexCenterVariant;
        h2 {
          margin-right: 1em;
          color: var(--dark);
        }
      }
      .cards {
        grid-column: 1 / 9;
        display: grid;
        grid-row: 2 / 3;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 5px;
        .stat {
          @include card;
          padding: 1em 0.5em;
          @include flexColCenter;
          .stat-header {
            @include flexColCenterBoth;
            margin-bottom: 10px;
            span:not(.material-icons) {
              text-transform: capitalize;
              margin-top: 10px;
            }
            .ion {
              svg {
                height: 2.2em !important;
                width: 2.2em !important;
              }
            }
            .material-icons {
              color: var(--green);
            }
          }
        }
      }
      .headers {
        @include flexSpace;
        h3 {
          margin-bottom: 1em;
          font-size: 1.3em;
          font-family: var(--open);
          font-weight: normal;
          text-transform: unset;
          color: var(--dark);
        }
        h4 {
          font-weight: normal;
          color: var(--dark);
          cursor: pointer;
        }
      }
      .card {
        @include card;
        @include grid;
        grid-template-columns: 1.5fr 1.25fr 1fr;
        width: 100%;
        padding: 15px;
        h2 {
          grid-column: 1/4;
          margin-bottom: 10px;
          font-weight: normal;
        }
        h5 {
          &:first-of-type {
            grid-column: 1/2;
          }
          &:nth-of-type(2) {
            grid-column: 2/3;
            text-align: right;
          }
          &:last-of-type {
            grid-column: 3/4;
            text-align: right;
          }
        }
        .stat {
          grid-column: 1/4;
          padding: 2px 0;
          @include grid;
          grid-template-columns: 1.5fr 1.25fr 1fr;
          &:first-of-type {
            margin-top: 10px;
          }
          .stat-time {
            grid-column: 1/2;
            text-transform: capitalize;
          }
          .stat-total {
            grid-column: 2/3;
            text-align: right;
            font-weight: bold;
          }
          .stat-units {
            grid-column: 3/4;
            text-align: right;
            font-weight: bold;
          }
        }
      }
      .info {
        grid-column: 9 / 13;
        grid-row: 1 / 2;
        .text {
          font-family: var(--open);
        }
        .phone {
          color: var(--primary);
        }
        .email {
          color: var(--green);
        }
        .address {
          color: var(--red);
        }
        .info-container {
          @include flex;
          padding: 10px 0;
        }
        .info-text {
          @include flexCol;
        }
        .info-title {
          text-transform: uppercase;
          color: var(--dark);
          font-weight: bold;
          font-size: 13px;
          margin-bottom: 5px;
        }
        .icon {
          padding: 10px;
          width: 50px;
        }
      }
      #menu-container {
        grid-column: 1/13;
        @include flex;
      }
      .menu-items {
        @include flexCol;
        background: var(--white);
        border-radius: 5px;
        max-height: 400px;
        overflow-y: scroll;
        .menu-item {
          @include flexSpace;
          padding: 1em;
          h4,
          h5,
          h6 {
            font-family: var(--open);
            font-weight: normal;
            font-size: 14px;
            &::first-letter {
              text-transform: uppercase;
            }
          }
          h4 {
            margin-bottom: 0.75em;
            font-weight: bold;
          }
          h6 {
            font-weight: bold;
            text-transform: uppercase;
          }
          .img {
            flex: 1;
            img {
              width: 50px;
              height: 50px;
              border-radius: 50px;
            }
          }
          .item-body {
            flex: 3;
          }
          .item-info {
            flex: 1;
            text-align: right;
            h6 {
              text-transform: unset;
              display: block;
            }
          }
        }
        .menu-item:not(:last-of-type) {
          border-bottom: 1px solid var(--light_grey);
        }
      }
      .menu-container {
        margin-right: 1%;
      }
      .menu-container,
      .order-list {
        margin-top: 2em;
        width: 49%;
      }
    }
    #no-content {
      h1 {
        color: var(--dark);
      }
    }
    .bottom {
      .trending-orders {
        padding: 1em 0.25em;
        background: var(--white);
        border-radius: 5px;
        h3 {
          border-bottom: 1px solid var(--grey);
          margin-bottom: 1em;
          padding-bottom: 0.5em;
          font-size: 1.3em;
          font-family: var(--open);
          font-weight: normal;
          text-transform: unset;
          color: var(--dark);
        }
        .trending-list {
          @include grid;
          grid-gap: 10px;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));

          .trending-item {
            @include flexCol;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            border: 1px solid var(--light_grey);
            padding-bottom: 1em;
            .img {
              width: 100%;
              flex: 1;
              img {
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                height: 100%;
                width: 100%;
              }
            }
            .item-header {
              @include center;
              @include flexSpace;
              padding: 0.75em;
              h4 {
                text-transform: capitalize;
                font-weight: bold;
              }
              h5 {
                text-transform: capitalize;
                font-weight: bold;
                color: var(--green);
              }
            }
            .item-info {
              @include flexSpace;
              padding: 0 0.75em;
              p {
                color: var(--dark-grey);
                margin-bottom: 0.75em;
              }
              span {
                color: var(--red-variant);
                font-family: var(--open);
              }
            }
          }
        }
      }
    }
  }
}
</style>
