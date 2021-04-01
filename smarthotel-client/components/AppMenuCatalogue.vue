<template>
  <section id="products-page">
    <div class="products-page">
      <div
        v-show="loaded && category"
        class="products"
        v-for="(category, index) in productList"
        :key="category._id"
        :class="{ 'first-category': index === 0 }"
      >
        <div class="products-category">
          <h1>
            {{ category.categoryName }}
          </h1>
          <button class="btn" @click="goToAddMenu">add menu</button>
        </div>
        <div class="product-list">
          <div
            class="product"
            v-for="product in category.products"
            :key="product._id"
          >
            <div class="img">
              <img :src="product.imageUrl" :alt="product.productName" />
            </div>
            <div class="product-body">
              <div class="top">
                <h2>{{ product.productName }}</h2>
                <h3>{{ product.cost }}</h3>
              </div>
              <div class="content">
                {{ product.description }}
              </div>
              <div class="tools">
                <div class="delete">
                  <span @click="deleteItem(product)" class="remove"
                    >Remove</span
                  >
                </div>
                <div class="edit">
                  <span @click="editProduct(product)" class="edit">Edit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="no-content" v-show="!loaded">
      <div class="cta">
        <h1>No Menus available</h1>
        <button class="btn-cta" @click="goToAddMenu">Add Menus</button>
      </div>
    </div>
    <div class="app-add" v-show="edit" @click="hideAddForm">
      <AppEdit
        :categories="categoryList"
        :product="product"
        :edit="edit"
        ref="addForm"
      />
    </div>
  </section>
</template>

<script>
import AppEdit from './AppEdit.vue'
import { bus } from '../layouts/default'
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import formatCurrency from '@/utilities/formatCurrency'

export default {
  components: {
    AppEdit,
  },
  computed: {
    ...mapState(['products']),
    ...mapGetters({
      categorizedProducts: 'products/categorizedProducts',
      categoriesWithProducts: 'products/categoriesWithProducts',
    }),
    categoryList() {
      return this.products.categories
    },
    loaded() {
      if (this.length > 0) {
        return true
      } else {
        return false
      }
    },
  },
  data() {
    return {
      categories: [],
      productList: [],
      length: 0,
      text: 'add menu',
      active: null,
      edit: false,
      product: {},
    }
  },
  async created() {
    this.setProducts()
    bus.$on('productUpdated', () => {
      this.setProducts()
      this.edit = false
    })
    bus.$on('showAddForm', (value) => {
      this.edit = value
    })
  },
  methods: {
    ...mapActions({
      deleteProduct: 'products/deleteProduct',
    }),
    async deleteItem(product) {
      try {
        await this.deleteProduct(product)
        this.setProducts()
      } catch (error) {
        bus.$emit('showPopup', {
          message: error.message,
          success: false,
        })
      }
    },
    editProduct(product) {
      this.product = product
      this.edit = true
    },
    goToAddMenu() {
      this.edit = !this.edit
    },
    hideAddForm() {
      this.edit = false
    },
    setCategories() {},
    setProducts() {
      this.productList = this.categoriesWithProducts
      this.length = this.categoriesWithProducts
        .map((category) => category.products)
        .flat(Infinity).length
    },
    showOptions(product, event) {
      if (this.active === null) {
        this.active = product
      } else {
        this.active = null
      }
    },
  },
  filters: {
    slice(value) {
      return value.slice(2, 6)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#products-page {
  position: none !important;
  height: 100%;
  .btn {
    display: none;
  }
  .no-content {
    @include flexCenterBoth;
    min-height: 70vh;
    .btn-cta {
      @include btn;
      margin-top: 2em;
    }
  }
  .products-page {
    margin-top: 3em;
    padding: 2em 0.5em;
  }
}
.products {
  @include grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 1em 0;
  .products-category {
    grid-column: 1/5;
    grid-row: 1/2;
    margin-bottom: 1em;
    text-transform: capitalize;
    h1 {
      font-family: var(--open);
      padding: 1em 0;
      color: var(--dark);
    }
  }
  .product-list {
    grid-column: 1/5;
    grid-row: 2/3;
    @include grid;
    justify-items: center;
    grid-gap: 15px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 250px));
    padding-right: 1em;
    .product {
      @include flexCol;
      background: var(--white);
      box-shadow: 0 3px 5px 3px rgba($color: #000000, $alpha: 0.1);
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      .img {
        img {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          width: 100%;
          height: 130px;
        }
      }
      .product-body {
        padding: 1em 0.75em;
        @include flexCol;
        justify-content: space-between;
        flex: 1;
        .top {
          @include flexSpace;
          @include center;
          h2,
          h3 {
            font-family: var(--mont);
            font-weight: bold;
            font-size: 16px;
            text-transform: capitalize;
          }
        }
        .content {
          margin-top: 1em;
        }
        .tools {
          @include flexSpace;
          @include center;
          margin-top: 2em;
          span {
            @include btn-variant;
            padding: 7px 15px;
            text-transform: capitalize;
            border-radius: 5px;
          }
          .remove {
            background: var(--orange);
          }
          .edit {
            background: var(--black);
          }
        }
      }
    }
  }
}
.products.first-category {
  .products-category {
    @include flexSpace;
    @include center;
    padding-right: 1em;
    .btn {
      @include centerVariant;
      @include btn;
      height: 33px !important;
      padding: 11px 30px !important;
      background: var(--blue-variant);
      width: 200px;
      text-align: center;
      display: flex !important;
      grid-column: 4/5;
    }
  }
}
.no-content {
  margin-top: 3em;
  padding: 2em 0.5em;
}
.app-add {
  @include absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background: rgba($color: #000000, $alpha: 0.9);
  z-index: 499;
  padding: 2em 0;
  @include flexColCenterBoth;
  #add-form {
    width: 90%;
  }
}
</style>
