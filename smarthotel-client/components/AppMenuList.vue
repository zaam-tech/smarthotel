<template>
  <div id="menu-list">
    <div id="search" v-show="showSearch">
      <form>
        <span class="material-icons">search</span>
        <input
          type="text"
          placeholder="Search Menus"
          v-model="searchQuery"
          @input="search"
        />
      </form>
    </div>
    <div id="category-dropdown">
      <form>
        <div class="form-group">
          <div class="custom-select">
            <select @change="filterProducts($event)">
              <option>Select Category</option>
              <option
                :value="categoryItem.categoryName"
                v-for="categoryItem in categories"
                :key="categoryItem._id"
              >
                {{ categoryItem.categoryName }}
              </option>
            </select>
            <span class="custom-arrow"></span>
          </div>
        </div>
      </form>
    </div>
    <div id="category-list" v-show="items.length">
      <div class="header">
        <h4 class="item-id">Item ID</h4>
        <h4 class="item-name">Item name</h4>
        <h4 class="item-desc">Description</h4>
        <h4 class="item-cost">Cost</h4>
        <h4 class="item-status">Status</h4>
      </div>
      <div class="item-list">
        <div class="item" v-for="item in items" :key="item._id">
          <p class="id">123548</p>
          <p class="name">{{ item.productName }}</p>
          <p class="description">{{ item.description }}</p>
          <p class="cost">{{ item.cost }}</p>
          <p class="status">
            {{ item.availability ? 'Available' : 'Not Available' }}
          </p>
          <div class="action">
            <span
              class="material-icons options-icon"
              @click="showOptions($event)"
              v-on-clickaway="hideOptions"
              >more_vert</span
            >
            <div
              class="tools"
              v-show="active && active._id === item._id"
              :ref="item._id"
              :id="item._id"
            >
              <div class="edit">
                <span @click="editMenu(item)">edit</span>
              </div>
              <div class="delete">
                <span @click="deleteMenu(item)">delete</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="no-content" v-show="!items.length">
      <div class="cta">
        <h1>{{ message }}</h1>
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
  </div>
</template>

<script>
import { v4 } from 'uuid'
import { mapGetters, mapActions, mapState } from 'vuex'
import { bus } from '~/layouts/default.vue'
import { mixin as clickaway } from 'vue-clickaway'
import AppEdit from './AppEdit'
export default {
  components: {
    AppEdit,
  },
  mixins: [clickaway],
  data: () => ({
    active: null,
    categoryName: '',
    edit: false,
    items: [],
    product: null,
    searchQuery: '',
  }),
  computed: {
    categories() {
      return this.categoryList.map((category) => ({
        ...category,
        categoryName: category.categoryName.toLowerCase(),
      }))
    },
    ...mapState(['products']),
    ...mapGetters({
      categoryList: 'products/categoryList',
      categorizedProducts: 'products/categorizedProducts',
      getProductByCategory: 'products/getProductByCategory',
      getProductByName: 'products/getProductByName',
    }),
    message() {
      if (this.categoryName) {
        return 'No products in that category'
      } else if (this.showSearch) {
        return 'No products match that query'
      } else {
        return 'No Menus available'
      }
    },
    getProductsByCat(category) {
      return this.getProductsByCategory(category)
    },
    showSearch() {
      if (this.searchQuery) {
        return true
      } else {
        if (this.items.length) {
          return true
        } else {
          return false
        }
      }
    },
  },
  methods: {
    ...mapActions({
      deleteProduct: 'products/deleteProduct',
    }),
    async deleteMenu(item) {
      try {
        await this.deleteProduct(item)
        bus.$emit('showPopup', {
          message: 'Item deleted',
          success: true,
        })
        this.setProducts()
      } catch (error) {
        bus.$emit('showPopup', {
          message: "Could'nt complete action. Try again",
          success: false,
        })
      }
    },
    editMenu(item) {
      this.product = item
      this.edit = true
    },
    filterProducts(event) {
      const target = event.target
      const { text } = target.selectedOptions[0]
      if (text !== 'Select Category') {
        this.categoryName = text
      } else {
        this.categoryName = ''
      }
      this.setProducts()
    },
    hideAddForm() {
      this.edit = false
      this.product = null
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
    showOptions(event) {
      const { target } = event
      this.removeClass()
      if (target.classList.contains('options-icon')) {
        target.nextElementSibling.classList.add('active')
      } else {
        target.parentElement.nextElementSibling.classList.add('active')
      }
    },
    goToAddMenu() {
      bus.$emit('showAddForm', true)
      bus.$emit('selectLink', {
        alias: 'catalogue',
      })
    },
    searchProduct(productName) {
      return this.getProductByName(productName)
    },
    setProducts() {
      if (this.categoryName) {
        this.items = this.categorizedProducts
          .filter(
            (category) =>
              category.categoryName.toLowerCase() === this.categoryName
          )
          .map((category) => category.products)
          .flat(Infinity)
      } else {
        this.items = this.categorizedProducts
          .map((category) => category.products)
          .flat(Infinity)
      }
    },
    search() {
      const searchQuery = this.searchQuery
      if (searchQuery) {
        this.items = this.searchProduct(searchQuery)
      } else {
        this.setProducts()
      }
    },
  },
  mounted() {
    this.setProducts()
  },
  created() {
    bus.$on('productUpdated', () => {
      this.setProducts()
      this.edit = false
    })
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#menu-list {
  margin-top: 4em;
  padding: 2em;
  @include grid;
  grid-template-columns: repeat(12, 1fr);
  #search {
    grid-column: 4/7;
    margin-bottom: 1em;
    @include relative;
    input {
      background: transparent;
      border: none;
      width: 13em;
      border-bottom: 1px solid var(--grey);
      margin-left: 2em;
      font-size: 16px;
      font-family: var(--open);
      padding: 8px 0;
      padding-left: 1.3em;
      &:focus {
        outline: none;
      }
    }
    .material-icons {
      @include absolute;
      top: 49%;
      left: 30px;
      transform: translateY(-50%);
      font-size: 20px;
      color: var(--grey);
    }
  }
  #category-dropdown {
    grid-column: 1/4;
    grid-row: 1;
    margin-bottom: 1em;
    form {
      height: 100%;
      .form-group {
        .custom-select {
          @include custom-select-variant;
          select {
            margin-top: 0 !important;
            height: 35px !important;
          }
          .custom-arrow {
            top: 10% !important;
          }
        }
      }
    }
  }
  #category-list {
    grid-column: 1/13;
    .header,
    .item {
      width: 100%;
      @include grid;
      grid-template-columns: repeat(2, 1fr) 2fr repeat(3, 1fr);
      background: var(--blue-variant);
      color: var(--white);
      padding: 0.5em;
      .item-id,
      .id {
        grid-column: 1/2;
      }
      .item-name,
      .name {
        grid-column: 2/3;
      }
      .item-desc,
      .description {
        grid-column: 3/4;
      }
      .item-cost,
      .cost {
        grid-column: 4/5;
      }
      .item-status,
      .status {
        grid-column: 5/6;
      }
      .action {
        grid-column: 6/7;
        @include relative;
        cursor: pointer;
        justify-self: flex-end;
        .tools {
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          @include absolute;
          top: 0;
          left: -350%;
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
          .material-icons {
            font-size: 20px;
            width: 30px;
          }
        }
      }
      .active {
        display: flex !important;
        flex-direction: column !important;
      }
    }
    .item {
      padding: 1em 0.75em;
      background: var(--white);
      color: var(--black);
      border-bottom: 1.5px solid var(--grey);
      p {
        text-transform: capitalize;
      }
      &:last-of-type {
        border: none;
      }
    }
  }
  #no-content {
    text-align: center;
    grid-column: 1/13;
    margin-top: 2em;
    @include flexCenterBoth;
    .btn-cta {
      @include btn;
      margin-top: 2em;
    }
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
}
</style>
