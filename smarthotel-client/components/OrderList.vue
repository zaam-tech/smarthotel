<template>
  <div id="orders-container">
    <form>
      <span class="material-icons">search</span>
      <input type="text" placeholder="Search Orders" />
    </form>
    <div id="orders-list">
      <div id="orders" class="order-col">
        <div class="orders" v-if="pendingOrders.length">
          <div class="orders-header">
            <span>Order No#</span>
            <span>Table No#</span>
            <span>Date</span>
            <span>Status</span>
            <span>Payment</span>
            <span>Paid Date</span>
            <span>Amount Paid</span>
            <span>Action</span>
          </div>
          <div
            class="order"
            v-for="(order, index) in pendingOrders"
            :key="order.id"
            :class="{ first: index === 0 }"
          >
            <span class="order-number">{{ order.orderNumber }}</span>
            <span class="order-table-number">{{ order.tableNumber }}</span>
            <span class="order-date">{{ order.date }}</span>
            <span class="order-status">{{
              order.status === 'completed' ? 'completed' : 'Processing'
            }}</span>
            <span class="order-payment">{{
              order.payment === 'completed' ? 'completed' : 'Incomplete'
            }}</span>
            <span class="order-paid-date">{{ order.paidDate }}</span>
            <span class="order-amount">{{ order.amount }}</span>
            <div class="action">
              <span
                class="material-icons options-icon"
                @click="showOptions($event)"
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { bus } from '../layouts/default.vue'
import toggleOptions from '@/utilities/toggleOptions'
import { mixin as clickaway } from 'vue-clickaway'
export default {
  mixins: [clickaway],
  computed: {
    ...mapGetters({
      pendingOrders: 'orders/pendingOrders',
    }),
  },
  showOrder(orderId) {
    bus.$emit('selectLink', {
      alias: 'order',
    })
    bus.$emit('showOrder', orderId)
  },
  methods: {
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
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#orders-container {
  margin-top: 7em;
  form {
    padding: 10px;
    @include relative;
    input {
      background: transparent;
      border: none;
      width: 13em;
      border-bottom: 1px solid var(--light_grey);
      margin-left: 2em;
      font-size: 16px;
      font-family: var(--open);
      padding: 8px 0;
      &:focus {
        outline: none;
      }
    }
    .material-icons {
      @include absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      color: var(--grey);
    }
  }
  #orders-list {
    background: var(--light_grey);
    padding: 10px;
    .order-col {
      border-radius: 5px;
      font-family: var(--open);
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
        grid-template-columns: repeat(7, 1fr) 0.5fr;
        padding: 10px;
      }
      .orders-header {
        padding: 15px 10px;
        background: var(--secondary);
        color: var(--white);
      }
      .order {
        padding: 1em;
        border: 0.3px solid #eee;
        background: var(--white);
        border-left: none;
        border-right: none;
        span:not(:last-of-type) {
          text-transform: capitalize;
        }
        @include relative;
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
      .first {
        margin-top: 1em;
      }
      .order-number {
        grid-column: 1/2;
      }
      .order-table-number {
        grid-column: 2/3;
      }
      .order-date {
        grid-column: 3/4;
      }
      .order-status {
        grid-column: 4/5;
      }
      .order-payment {
        grid-column: 5/6;
      }
      .order-paid-date {
        grid-column: 6/7;
      }
      .order-amount {
        grid-column: 7/8;
      }
      .menu-icon {
        grid-column: 8/9;
        justify-self: end;
      }
    }
  }
}
</style>
