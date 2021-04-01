<template>
  <div id="order-information">
    <div id="search">
      <form @submit.prevent="search($event)">
        <label>Search orders</label>
        <input type="text" class="input" v-model="searchQuery.model" />
      </form>
    </div>
    <div id="order-card">
      <p>Order #{{ order.orderNumber }}</p>
      <p>{{ order.payment ? 'Yes' : 'No' }}</p>
      <p>{{ order.status === 'pending' ? 'Unfulfiled' : 'Fulfilled' }}</p>
      <p>{{ order.date }}</p>
    </div>
    <div id="order-list">
      <div id="order" v-for="order in productList" :key="order.id">
        <div class="img">
          <img :src="order.image" :alt="order.title" />
        </div>
        <div class="info">
          <h4>{{ order.productName }}</h4>
          <p>{{ order.description }}</p>
        </div>
        <h4>$45.50</h4>
        <h4>1</h4>
        <h4>{{ order.cost }}</h4>
      </div>
    </div>
    <div id="comment">
      <h3>Comment</h3>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reiciendis
        itaque voluptas minima rem alias impedit explicabo odio nobis! Ad
        aperiam blanditiis quo harum hic qui quaerat laboriosam aliquam sequi
        animi.
      </p>
    </div>
    <div id="payment">
      <h3>Payment Summary</h3>
      <p>
        <span>SubTotal</span>
        <span>1200</span>
      </p>
      <p>
        <span>Delivery</span>
        <span>1200</span>
      </p>
      <p>
        <span>Tax</span>
        <span>1200</span>
      </p>
      <div id="paid">
        <p>Total Paid by customer</p>
        <p>1200</p>
      </div>
    </div>
    <div id="customer-info">
      <div class="customer-info info-col">
        <h4>Customer</h4>
        <div class="info">
          <img src="/avatar2.png" alt="customer avatar" />
          <p>{{ customer.name }}</p>
        </div>
      </div>
      <div id="table-info" class="info-col">
        <p>
          <span>Table number</span>
          <span>{{ customer.tableNumber }}</span>
        </p>
      </div>
      <div id="contact-info" class="info-col">
        <h4>Contact Information</h4>
        <p>
          <span class="material-icons">mail</span>
          <span>{{ customer.email }}</span>
        </p>
        <p>
          <span class="material-icons">phone</span>
          <span>{{ customer.phone }}</span>
        </p>
      </div>
      <div id="shipping-address" class="info-col">
        <h4>Shipping address</h4>
        <p>{{ customer.name }}</p>
        <p>{{ customer.phone }}</p>
        <p>{{ customer.address.address1 }}</p>
        <p>{{ customer.address.region }}</p>
        <p>{{ customer.address.postalCode }}</p>
        <p>{{ customer.address.country }}</p>
      </div>
      <div id="billing-address" class="info-col">
        <h4>Billing address</h4>
        <p>{{ customer.name }}</p>
        <p>{{ customer.phone }}</p>
        <p>{{ customer.address.address1 }}</p>
        <p>{{ customer.address.region }}</p>
        <p>{{ customer.address.postalCode }}</p>
        <p>{{ customer.address.country }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import formatDate from '../utilities/formatDate'
import { mapState, mapGetters } from 'vuex'
import { bus } from '../layouts/default.vue'
export default {
  data() {
    return {
      searchQuery: {
        model: '',
        error: '',
      },
      customer: {
        name: 'Rick manny',
        tableNumber: 2550,
        email: 'rickmanny@gmail.com',
        phone: 265555555780,
        address: {
          country: 'Philippines',
          postalCode: 14525,
          region: 'Manila',
          city: 'Manila',
          address1: '101854 Main street',
        },
      },
      order: null,
    }
  },
  computed: {
    date() {
      return formatDate(new Date())
    },
    ...mapState(['orders', 'products']),
    ...mapGetters({
      allOrders: 'orders/allOrders',
    }),
    productList() {
      return this.products.categories[0].products.slice(2, 6)
    },
  },
  methods: {
    search(event) {},
  },
  created() {
    const order = this.allOrders.find(
      (order) => order.id === this.orders.orderId
    )
    this.order = order
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#order-information {
  margin-top: 5em;
  padding: 1em 2em;
  @include grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 50px 45px repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  h3,
  h4 {
    font-weight: bold;
    font-family: var(--rob);
  }
  #search {
    grid-column: 1/5;
    grid-row: 1/2;
    @include flex;
    @include center;
    form {
      @include flex;
      label {
        margin-right: 1em;
      }
      .input {
        border: none;
        border-bottom: 1px solid var(--dark-grey);
        background: transparent;
        &:focus {
          outline: none;
        }
      }
    }
  }
  #order-card {
    grid-column: 1/8;
    grid-row: 2/3;
    @include flexSpace;
    background: var(--white);
    padding: 1em;
  }
  #order-list {
    @include flexCol;
    grid-column: 1/8;
    grid-row: 3/4;
    background: var(--white);
    margin-top: 1em;
    #order {
      @include flexSpace;
      padding: 0.5em;
      border-bottom: 1px solid var(--grey);
      padding-bottom: 0;
      .info {
        h4 {
          margin-bottom: 1em;
          &::first-letter {
            text-transform: capitalize;
          }
        }
      }
      .img {
        width: 150px;
        img {
          width: 100%;
        }
      }
    }
  }
  #comment {
    grid-column: 1/8;
    grid-row: 4/5;
    background: var(--white);
    margin-top: 1em;
    padding: 1em;
    p {
      margin-top: 10px;
    }
  }
  #payment {
    grid-column: 1/8;
    grid-row: 5/6;
    background: var(--white);
    margin-top: 1em;
    padding: 1em;
    h3 {
      margin-bottom: 1em;
      padding-left: 0.45em;
    }
    p {
      @include flexSpace;
      padding: 0.45em;
      span:last-of-type {
        font-weight: bold;
        font-family: var(--rob);
      }
      &:last-of-type {
        border-bottom: 1px solid var(--grey);
      }
    }
    #paid {
      @include flexSpace;
      @include center;
      padding: 0.45em;
      margin-top: 5px;
      background: var(--grey);
      font-weight: bold;
      p {
        &:first-of-type {
          font-family: var(--rob);
        }
      }
    }
  }
  #customer-info {
    grid-column: 8/13;
    grid-row: 2/6;
    background: var(--white);
    @include flexCol;
    padding: 0.5em;
    background: var(--white);
    .info-col {
      padding: 1em;
      border-top: 1px solid var(--grey);
      &:first-of-type {
        border: none;
      }
      h4 {
        margin-bottom: 1em;
      }
    }
    .customer-info {
      .info {
        @include flex;
        @include center;
        p {
          margin-left: 3em;
        }
      }
      img {
        width: 50px;
        border-radius: 50%;
      }
    }
    #table-info {
      p {
        @include flex;
        span:last-of-type {
          margin-left: 3em;
        }
      }
    }
    #contact-info {
      p {
        @include flex;
        @include center;
        .material-icons {
          margin-right: 2em;
        }
        span {
          padding: 0.25em 0;
        }
      }
    }
    #shipping-address,
    #billing-address {
      p {
        padding: 0.25em 0;
        text-transform: capitalize;
      }
    }
  }
  @media screen and (max-width: 640px) {
    #search,
    #order-card,
    #order-list,
    #comment,
    #payment,
    #customer-info {
      grid-column: 1/13;
    }
    #search {
      grid-row: 1/2;
      form {
        .input {
          width: 70%;
        }
      }
    }
    #order-card {
      grid-row: 2/3;
      height: 50px;
    }
    #order-list {
      grid-row: 2/4;
      transform: translateY(15%);
    }
    #comment {
      grid-row: 5/6;
    }
    #payment {
      grid-row: 6/7;
    }
    #customer-info {
      grid-row: 4/5;
    }
  }
}
</style>
