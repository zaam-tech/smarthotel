<template>
  <div id="orders-page">
    <div class="left">
      <div class="top">
        <div class="order-stats">
          <div class="order-stat-1 order-stat">
            <span class="material-icons bg-gradient-red">pie_chart</span>
            <div class="stat-info">
              <span class="label">Orders Received</span>
              <span>{{ orders.orders.length + orders.orders.length }}</span>
            </div>
          </div>
          <div class="order-stat-2 order-stat">
            <span class="material-icons bg-gradient-green">attach_money</span>
            <div class="stat-info">
              <span class="label">Orders Completed</span>
              <span>{{ completedOrders.length }}</span>
            </div>
          </div>
          <div class="order-stat-3 order-stat">
            <span class="material-icons bg-gradient-info">show_chart</span>
            <div class="stat-info">
              <span class="label">Pending Orders</span>
              <span>{{ pendingOrders.length }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div id="order-container">
          <div class="order-top-header">
            <h1>Orders</h1>
            <h3 @click="viewAll($event)" data-name="pending-orders">
              View all
            </h3>
          </div>
          <div id="orders" class="order-col">
            <div class="orders" v-if="incompleteOrders.length">
              <div class="orders-header">
                <span>Order No#</span>
                <span>Date</span>
                <span>Status</span>
                <span>Paid Date</span>
                <span>Amount Paid</span>
                <span>Action</span>
              </div>
              <div
                class="order"
                v-for="order in incompleteOrders"
                :key="order.id"
                @click="showOrder($event, order)"
              >
                <span class="order-number">{{ order.orderNumber }}</span>
                <span class="order-date">{{ order.date }}</span>
                <span class="order-status">{{ order.status }}</span>
                <span class="order-paid-date">{{ order.paidDate }}</span>
                <span class="order-amount">{{
                  order.amount || formatAmount
                }}</span>
                <div class="action">
                  <span
                    class="material-icons options-icon"
                    @click.prevent="showOptions($event)"
                    v-on-clickaway="hideOptions"
                    >more_vert</span
                  >
                  <div class="tools">
                    <div class="edit">
                      <span>edit</span>
                    </div>
                    <div class="delete">
                      <span>delete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h2 v-else>No new Orders</h2>
          </div>
          <div class="order-top-header">
            <h1>Completed Orders</h1>
            <h3 @click="viewAll($event)" data-name="completed-orders">
              View all
            </h3>
          </div>
          <div id="completed-orders" class="order-col">
            <div class="orders" v-if="processedOrders.length">
              <div class="orders-header">
                <span>Order No#</span>
                <span>Date</span>
                <span>Status</span>
                <span>Paid Date</span>
                <span>Amount Paid</span>
                <span>Action</span>
              </div>
              <div
                class="order"
                v-for="order in processedOrders"
                :key="order.id"
                @click="showOrder($event, order)"
              >
                <span class="order-number">{{ order.orderNumber }}</span>
                <span class="order-date">{{ order.date }}</span>
                <span class="order-status">{{ order.status }}</span>
                <span class="order-paid-date">{{
                  order.paidDate || formatNumber
                }}</span>
                <span class="order-amount">{{ order.amount }}</span>
                <div class="action">
                  <span
                    class="material-icons options-icon"
                    @click.prevent="showOptions($event)"
                    v-on-clickaway="hideOptions"
                    >more_vert</span
                  >
                  <div class="tools">
                    <div class="edit">
                      <span>edit</span>
                    </div>
                    <div class="delete">
                      <span>delete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h2 v-else>No Pending Orders</h2>
          </div>
        </div>
        <div id="order-updates-container">
          <h1>Live Updates</h1>
          <div class="updates-list">
            <div class="update" v-for="order in ordersLite" :key="order.id">
              <div class="table-col">
                <span>{{ order.tableNumber }}</span>
              </div>
              <div class="order-info-col">
                <div class="info">
                  <span>Order No#</span>
                  <span :class="order.orderNumber">{{
                    order.orderNumber
                  }}</span>
                </div>
                <div class="info">
                  <span>Amount</span>
                  <span>{{ order.amount }}</span>
                </div>
                <div class="info">
                  <span>Status</span>
                  <span>{{ order.status }}</span>
                </div>
                <div class="info">
                  <span>Date</span>
                  <span>{{ order.date }}</span>
                </div>
                <div class="info">
                  <span>Payment</span>
                  <span>{{ order.payment ? 'Completed' : 'Pending' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'

import moment from 'moment'
import { bus } from '../layouts/default.vue'
import { mixin as clickaway } from 'vue-clickaway'
import toggleOptions from '@/utilities/toggleOptions'
export default {
  mixins: [clickaway],
  data() {
    return {
      active: null,
      username: 'Jonathan Doe',
      incompleteOrders: [],
      processedOrders: [],
    }
  },
  computed: {
    ...mapState(['dates', 'orders']),
    date() {
      return this.dates['date']
    },
    isLoaded() {
      if (this.orders.orders && this.orders.orders.length) {
        return true
      } else {
        return false
      }
    },
    ...mapGetters({
      completedOrders: 'orders/completedOrders',
      pendingOrders: 'orders/pendingOrders',
    }),
    ordersLite() {
      return this.orders.orders.slice(2, 6)
    },
  },
  methods: {
    ...mapActions({
      setOrderId: 'orders/setOrderId',
    }),
    async process(event, order) {
      if (event && event.target && event.target.checked) {
        await this.processOrder(order)
      }
    },
    setPendingOrders() {
      this.incompleteOrders = this.pendingOrders.slice(0, 10)
    },
    setProcessedOrders() {
      this.processedOrders = this.completedOrders.slice(0, 10)
    },
    showOrder(event, order) {
      const { target } = event
      if (!target.classList.contains('material-icons')) {
        this.setOrderId(order.id)
        bus.$emit('selectLink', {
          alias: 'order',
        })
      }
    },
    hideOptions(event) {
      const optionsFunc = toggleOptions(event, this)
      optionsFunc.hideOptions()
    },
    removeClass(event) {
      const optionsFunc = toggleOptions(event, this)
      optionsFunc.removeClass()
    },
    showOptions(event) {
      const optionsFunc = toggleOptions(event, this)
      optionsFunc.showOptions()
    },
    viewAll(event) {
      const { target } = event
      const { name } = target.dataset
      bus.$emit('selectLink', {
        alias: name,
      })
    },
  },
  mounted() {
    this.setPendingOrders()
    this.setProcessedOrders()
  },
  filters: {
    formatNumber(value) {
      return `#${value}`
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#orders-page {
  margin-top: 4em;
  padding: 2em 0.5em;
  @include flex;
  font-family: var(--open);
  .active {
    display: flex !important;
    flex-direction: column !important;
  }
  .left {
    flex: 1;
    width: 100%;
    .top {
      .order-stats {
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(3, minmax(300px, 1fr));
        grid-gap: 2em;
        .order-stat {
          background: var(--white);
          border-radius: 10px;
          padding: 1.25em 1em;
          @include flexCenterVariant;
          font-size: 1.2em;
          .material-icons {
            font-size: 3em;
          }
          .stat-info {
            margin-left: 1em;
            @include flexCol;
            span:not(.label) {
              text-align: center;
              margin-top: 15px;
            }
          }
          .bg-gradient-red {
            color: var(--green);
          }
          .bg-gradient-green {
            color: var(--red);
          }
          .bg-gradient-info {
            color: var(--secondary);
          }
        }
        .order-stat-1 {
          grid-column: 1/2;
        }
        .order-stat-2 {
          grid-column: 2/3;
        }
        .order-stat-3 {
          grid-column: 3/4;
        }
      }
    }
    .bottom {
      margin-top: 1em;
      display: grid;
      grid-template-columns: 2.25fr 1.25fr;
      #order-container {
        grid-column: 1/2;
        @include flexCol;
        padding: 1em 0.5em;
        .order-top-header {
          @include flexSpace;
          @include center;
          padding: 1em;
          padding-left: 0;
          h3 {
            cursor: pointer;
          }
        }
        .order-top-header:first-of-type {
          grid-column: 1;
          grid-row: 1/2;
        }
        .order-top-header:last-of-type {
          grid-column: 1;
          grid-row: 3/4;
        }
        .order-col {
          background: var(--white);
          border-radius: 5px;
          .orders-header {
            padding: 0.5em 0;
            font-weight: bold;
            span:last-of-type {
              justify-self: end;
            }
          }
          .orders-header,
          .order {
            display: grid;
            grid-template-columns: repeat(5, 1fr) 0.5fr;
            padding: 10px;
          }
          .orders-header {
            padding: 15px 10px;
          }
          .order {
            padding: 1em;
            border: 0.3px solid #eee;
            border-left: none;
            border-right: none;
            cursor: pointer;
            @include relative;
            span:not(:last-of-type) {
              text-transform: capitalize;
            }
            span:last-of-type {
              &:hover {
                cursor: pointer;
              }
            }
            .action {
              @include absolute;
              top: 10px;
              right: 10px;
              .material-icons {
                cursor: pointer;
                font-size: 25px;
              }
              .tools {
                @include absolute;
                top: 15px;
                right: 15px;
                width: 120px;
                margin: 0 auto;
                background: var(--white);
                z-index: 3;
                border-radius: 2px;
                transition: all 0.4s linear;
                @include flexCol;
                @include shadow;
                display: none;
                .edit,
                .delete,
                .print {
                  padding: 0.5em 1em;
                  cursor: pointer;
                  @include flexCol;
                  text-transform: capitalize;
                }
              }
              .tools.active {
                display: flex;
              }
            }
          }
          .order-number {
            grid-column: 1/2;
          }
          .order-date {
            grid-column: 2/3;
          }
          .order-status {
            grid-column: 3/4;
          }
          .order-paid-date {
            grid-column: 4/5;
          }
          .order-amount {
            grid-column: 5/6;
          }
          .menu-icon {
            grid-column: 6/7;
            justify-self: end;
          }
        }
      }
      #order-updates-container {
        padding: 1em 0;
        margin-top: 1em;
        grid-column: 2/3;
        @include flexCol;
        .updates-list {
          background: var(--white);
          margin-top: 1em;
          border-radius: 5px;
        }
        .update {
          margin: 1em;
          padding: 1em;
          display: grid;
          grid-template-columns: 1fr 3fr;
          background: var(--light_grey);
          .table-col {
            grid-column: 1/2;
            @include flex;
            @include center;
            margin-right: 10px;
            span {
              background: var(--white);
              padding: 9px 6px;
              border-radius: 50%;
            }
          }
          .order-info-col {
            grid-column: 2/3;
            @include flexCol;
            @include centerVariant;
            .info {
              @include flexSpace;
              padding: 5px 0;
              span {
                text-transform: capitalize;
              }
              span:last-of-type {
                font-weight: bold;
              }
            }
          }
          .action-col {
            grid-column: 2/3;
            grid-row: 2/3;
            justify-self: end;
            align-self: center;
            button {
              background: var(--primary);
              font-family: var(--open);
              border: none;
              padding: 5px 8px;
              color: var(--white);
              border-radius: 5px;
              margin-top: 10px;
              &:hover {
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}
</style>
