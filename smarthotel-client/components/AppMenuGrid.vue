<template>
  <div id="menu-grid">
    <div id="content">
      <div class="grid-container">
        <div class="categories" v-if="hasCategories" ref="categories">
          <span
            class="category"
            v-for="category in categories"
            :key="category._id"
            :class="{
              active: category.active,
            }"
            @click="activateCurrentCategory(category)"
            >{{ category.categoryName }}</span
          >
        </div>
        <div class="grid-content" v-show="hasContent">
          <div class="grid-header">
            <h4>Item Name</h4>
            <h4>Description</h4>
            <h4>Cost</h4>
          </div>
          <div
            class="grid-item"
            v-for="product in productList"
            :key="product._id"
          >
            <span class="item-name">{{ product.productName }}</span>
            <span class="item-description">{{ product.description }}</span>
            <span class="item-cost">{{ product.cost }}</span>
            <div class="item-actions">
              <span class="add-item">Add</span>
              <span class="item-quantity">1</span>
              <span class="item-remove">Remove</span>
            </div>
            <div class="actions">
              <span
                class="material-icons options-icon"
                @click="showOptions($event)"
                v-on-clickaway="hideOptions"
                >more_vert</span
              >
              <div
                class="tools"
                v-show="active && active.productName === product.productName"
              >
                <div class="edit">
                  <span>Add</span>
                </div>
                <div class="delete">
                  <span>Remove</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="no-content"
          v-show="!hasContent"
          :class="{ center: !isCategoriesShown }"
        >
          <p v-show="!isActive">Click on category to the left to see items</p>
          <p v-show="isActive">No items in this category</p>
        </div>
      </div>
      <form class="form-container">
        <div class="form-upper">
          <div class="input-group">
            <label>Bill No.</label>
            <input type="text" class="input" />
          </div>
          <div class="input-group">
            <label>Room</label>
            <input type="text" class="input" />
          </div>
          <div class="input-group">
            <label>Guest</label>
            <input type="text" class="input" />
          </div>
          <div class="input-group">
            <label>Pending</label>
            <input type="text" class="input" />
          </div>
          <div class="input-group">
            <label>Waiter</label>
            <input type="text" class="input" />
          </div>
          <div class="input-group">
            <label>Order No.</label>
            <input type="text" class="input" />
          </div>
          <div class="input-group">
            <label>Table</label>
            <input type="text" class="input" />
          </div>
        </div>
        <div class="form-bottom">
          <div id="order-container">
            <div class="order-container">
              <h4>Station</h4>
              <h4>Takeaway</h4>
              <h4>Delivery</h4>
            </div>
            <div class="order-content">
              <div class="order-header">
                <span class="order-item-header">Item</span>
                <span class="order-item-quantity">Qty</span>
                <span class="order-item-price">Price</span>
                <span class="order-item-total">Total</span>
              </div>
              <div class="order-item" v-for="order in orders" :key="order._id">
                <p class="order-name">{{ order.name }}</p>
                <p class="order-quantity">{{ order.quantity }}</p>
                <p class="order-price">{{ order.price }}</p>
                <p class="order-total">{{ order.total }}</p>
              </div>
            </div>
          </div>
          <div class="info">
            <div class="quantity-info">
              <span>Quantity</span>
              <p>10</p>
            </div>
            <div class="total-info">
              <span>Total</span>
              <p>$500</p>
            </div>
          </div>
          <div class="order-actions">
            <button>Send Order</button>
            <button>Print Bill</button>
            <button>Clear</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import { v4 } from 'uuid'
export default {
  data() {
    return {
      active: null,
      categoryName: 'nothing',
      categoryList: [],
      isCategoriesShown: true,
      productList: [],
      orders: [
        {
          _id: v4(),
          name: 'Burger 1',
          price: '$50',
          quantity: 5,
          total: 15,
        },
        {
          _id: v4(),
          name: 'Burger 2',
          price: '$50',
          quantity: 5,
          total: 15,
        },
        {
          _id: v4(),
          name: 'Burger 3',
          price: '$50',
          quantity: 5,
          total: 15,
        },
        {
          _id: v4(),
          name: 'Burger 4',
          price: '$50',
          quantity: 5,
          total: 15,
        },
        {
          _id: v4(),
          name: 'Burger 5',
          price: '$50',
          quantity: 5,
          total: 15,
        },
        {
          _id: v4(),
          name: 'Burger 6',
          price: 'KES 200',
          quantity: 5,
          total: 15,
        },
        {
          _id: v4(),
          name: 'Burger 7',
          price: '$50',
          quantity: 5,
          total: 15,
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      getProductByCategory: 'products/getProductByCategory',
      products: 'products/categorizedProductsList',
      categories: 'products/categoryList',
    }),
    hasContent() {
      return this.productList.length > 0
    },
    isActive() {
      return this.categories.some(
        (category) => category && category.active === true
      )
    },
    hasCategories() {
      return this.categories.length != -1
    },
  },
  mixins: [clickaway],
  methods: {
    ...mapActions({
      activateCategory: 'products/activateCategory',
    }),
    activateCurrentCategory(category) {
      this.activateCategory(category)
      this.setCategories(category.categoryName)
    },
    hideOptions(event) {
      const { target } = event
      if (
        !target.classList.contains('options-icon') &&
        !target.classList.contains('text') &&
        !target.classList.contains('material-icons')
      ) {
        this.removeClass()
      }
    },
    removeClass() {
      const tools = document.querySelectorAll('.tools.active')
      tools.forEach((tool) => {
        tool.classList.remove('active')
      })
    },
    setCategories(category) {
      let currentCategory = null
      if (category) {
        currentCategory = this.getProductByCategory(category)[0]
      } else {
        const { categoryName } = this
        currentCategory = this.getProductByCategory(categoryName)[0]
      }
      if (currentCategory?.products) {
        const { products } = currentCategory
        this.productList = products
      } else {
        this.productList = []
      }
    },
    showOptions(event) {
      const { target } = event
      this.removeClass()
      if (target.classList.contains('options-icon')) {
        target.nextElementSibling.classList.add('active')
      } else {
        target.parentElement.nextElementSibling.classList.add('active')
      }
    },
  },
  mounted() {
    this.setCategories(this.categoryName)
    const categories = this.$refs.categories
    if (!categories) {
      this.isCategoriesShown = false
    } else {
      this.isCategoriesShown = true
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#menu-grid {
  margin-top: 3em;
  padding: 2em 0.5em;
  background: var(--white);
  #content {
    @include grid;
    grid-template-columns: repeat(12, 1fr);
    min-height: 80vh;
    --bg: rgba(0, 0, 0, 0.04);
    --bg-var: rgba(0, 0, 0, 0.05);
    --color: #828282;
    --color-var: #666;
    --color-accent: #999;
    .grid-container {
      grid-column: 1/8;
      @include flexSpace;
      background: var(--bg-var);
      padding-top: 10px;
      .categories {
        @include flexCol;
        padding: 0 5px 10px 5px;
        margin-right: 5px;
        width: 30%;
        height: auto;
        .category {
          background: var(--white);
          color: var(--color);
          font-size: 16px;
          margin: 5px 0;
          padding: 10px 0 10px 10px;
          border-radius: 2px;
          cursor: pointer;
          text-transform: lowercase;
          &:first-letter {
            text-transform: uppercase;
          }
          &:first-of-type {
            margin-top: 0;
          }
        }
        .category.active {
          background: var(--secondary);
          color: var(--white);
        }
      }
      .grid-content {
        width: 70%;
        p,
        span:not(.material-icons),
        h4 {
          text-transform: capitalize;
        }
        .grid-header {
          margin-top: 0 !important;
          h4 {
            font-size: 18px;
          }
        }
        .grid-header,
        .grid-item {
          @include grid;
          grid-template-columns: 1.5fr 2fr 1fr 0.5fr;
          align-items: center;
          background: var(--white);
          padding: 10px;
          background: var(--white);
          margin: 5px 5px 5px 0;
          padding: 10px;
          .item-name {
            grid-column: 1/2;
          }
          .item-description {
            grid-column: 2/3;
            text-transform: unset;
          }
          .item-cost {
            grid-column: 3/4;
          }
          .item-actions {
            grid-column: 4/5;
            @include flexCenterBoth;
            .add-item,
            .item-remove {
              min-width: max-content;
              padding: 10px;
              &:hover {
                color: var(--color);
                cursor: pointer;
              }
            }
            .item-quantity {
              margin: 0 7px;
              background: var(--color);
              padding: 7px;
            }
          }
          .actions {
            @include relative;
            grid-column: 4/5;
            top: 0;
            right: 0;
            cursor: pointer;
            .material-icons {
              font-size: 20px;
              text-align: right;
            }
            .tools {
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              @include absolute;
              top: 25px;
              right: -20px;
              width: 120px;
              margin: 0 auto;
              background: var(--white);
              z-index: 3;
              border-radius: 2px;
              transition: all 0.4s linear;
              @include flexCol;
              .edit,
              .delete {
                padding: 0.5em 1em;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                text-transform: capitalize;
              }
            }
            .tools.active {
              display: flex !important;
            }
          }
        }
      }
      .no-content {
        width: 70%;
        text-align: center;
      }
      .no-content.center {
        width: 100%;
      }
    }
    .form-container {
      @include form-variant;
      grid-column: 8/13;
      width: 100%;
      max-width: 100% !important;

      border: none !important;
      .form-upper {
        @include flexSpace;
        flex-wrap: wrap;
        .input-group {
          margin-bottom: 5px;
          @include flex;
          width: 50%;
          .input {
            grid-column: 2/3;
            width: 95%;
          }
        }
      }
      .form-bottom {
        #order-container {
          margin-top: 10px;
          .order-container {
            @include flex;
            padding: 10px;
            justify-content: space-between;
            border: 1px solid var(--color);
            border-bottom: none;
            h4 {
              text-transform: uppercase;
            }
          }

          .order-content {
            border: 1px solid var(--black);

            background: var(--color-accent);
            padding: 10px 5px;
            .order-header {
              span {
                text-transform: uppercase;
                font-size: 13px;
                font-weight: bold;
              }
            }
            .order-header,
            .order-item {
              span,
              p {
                color: var(--color-var);
              }
              @include grid;
              grid-template-columns: repeat(4, 1fr);
              background: var(--white);
              font-size: 16px;
              margin: 5px 0;
              padding: 10px 0 10px 10px;
              border-radius: 2px;
            }
            .order-item {
              cursor: pointer;
              text-transform: capitalize;
              .order-item-name,
              .order-name {
                grid-column: 1/2;
              }
              .order-item-quantity,
              .order-quantity {
                grid-column: 2/3;
              }
              .order-item-price,
              .order-price {
                grid-column: 3/4;
              }
              .order-item-total,
              .order-total {
                grid-column: 4/5;
              }
            }
          }
        }
        .info {
          @include flexCol;
          align-items: flex-end;
          margin: 1em 0;
          .quantity-info,
          .total-info {
            @include flexSpace;
            width: 150px;
            margin: 5px 0;
            span {
              color: var(--color-var);
              margin-right: 1em;
            }
          }
        }
        .order-actions {
          @include flexCenterBoth;
          button {
            min-width: max-content !important;
            @include btn-grey;
            padding: 12px;
            height: 32px !important;
            margin-right: 10px;
            background: var(--color-accent);
            &:hover {
              background: var(--color);
              border-color: var(--color);
            }
            &:last-of-type {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
}

//Mobile styles
@media screen and (max-width: 1367px) {
  .grid-item {
    .item-actions {
      display: none !important;
    }
  }
}
@media screen and (min-width: 1367px) {
  .grid-item {
    grid-template-columns: 1fr 2fr 1fr 2fr;
    .actions {
      display: none !important;
    }
    .item-actions {
      display: flex !important;
    }
  }
  .form-upper {
    .input-group {
      @include flexSpace;
      flex-direction: row !important;
      .input {
        grid-column: 2/3;
        width: 75%;
      }
    }
  }
}
</style>
