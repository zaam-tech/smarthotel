<template>
  <div id="add-menu">
    <div id="category-form">
      <form @submit.prevent="handleSubmit">
        <h2>Add categories of items</h2>
        <div class="form-group" :class="{ 'invalid-field': catName.error }">
          <label>Category name</label>
          <input
            type="text"
            class="form-input"
            v-model="catName.model"
            :class="{
              invalid: catName.error,
            }"
          />
          <p class="error" v-show="catName.error">
            <span>{{ catName.error }}</span>
          </p>
        </div>
        <div class="form-group" :class="{ 'invalid-field': description.error }">
          <label>Description</label>
          <textarea
            class="form-input"
            v-model="description.model"
            cols="30"
            rows="5"
            :class="{
              invalid: description.error,
            }"
          ></textarea>
          <p class="error" v-show="description.error">
            <span>{{ description.error }}</span>
          </p>
        </div>
        <div class="form-group" :class="{ 'invalid-field': source.error }">
          <label>Source</label>
          <input
            type="text"
            class="form-input"
            v-model="source.model"
            :class="{
              invalid: source.error,
            }"
          />
          <p class="error" v-show="source.error">
            <span>{{ source.error }}</span>
          </p>
        </div>
        <button class="btn">save</button>
      </form>
    </div>
    <div id="categories">
      <div class="header">
        <h4>Category name</h4>
        <h4>Source</h4>
      </div>
      <div class="category-list">
        <div class="category" v-for="category in categories" :key="category.id">
          <p class="name">{{ category.categoryName }}</p>
          <p class="source">{{ category.source }}</p>
        </div>
      </div>
    </div>
    <div id="add-form">
      <AddEdit :categories="categories" :edit="false" :product="product" />
    </div>
    <div id="items">
      <div class="header">
        <h4 class="item-name-header">Item name</h4>
        <h4 class="category-name-header">Category name</h4>
        <h4 class="source-header">Source</h4>
        <h4 class="cost-header">Cost</h4>
        <h4 class="availa-header">Availability</h4>
      </div>
      <div class="item-list">
        <div class="item" v-for="product in productList" :key="product.id">
          <p class="name">{{ product.productName }}</p>
          <p class="category-name">{{ product.category.categoryName }}</p>
          <p class="source">{{ product.category.source }}</p>
          <p class="cost">{{ product.cost }}</p>
          <p class="availability">
            {{ product.availability ? 'available' : 'not available' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 } from 'uuid'
import { mapGetters, mapState, mapActions } from 'vuex'
import AddEdit from './AppEdit'
import { bus } from '../layouts/default'
export default {
  components: {
    AddEdit,
  },
  data() {
    return {
      catName: {
        error: '',
        model: '',
      },
      description: {
        error: '',
        model: '',
      },
      source: {
        error: '',
        model: '',
      },
      product: null,
    }
  },
  methods: {
    ...mapActions({
      createCategory: 'products/createCategory',
      getCategories: 'products/getAllCategories',
    }),
    setErrors() {
      const { catName, source } = this
      if (!catName.model) {
        catName.error = 'Enter category name'
      } else {
        catName.error = ''
      }

      if (!source.model) {
        source.error = 'Enter source'
      } else {
        source.error = ''
      }
    },
    async handleSubmit() {
      this.setErrors()
      const { catName, description, source } = this
      if (!catName.error && !source.error) {
        const data = {
          categoryName: catName.model,
          description: description.model,
          source: source.model,
        }
        try {
          await this.createCategory(data)
          this.catName.model = ''
          this.description.model = ''
          this.source.model = ''
        } catch (error) {
          bus.$emit('showPopup', {
            message: `${error.message}`,
            success: false,
          })
        }
      }
    },
  },
  computed: {
    ...mapState(['products']),
    ...mapGetters({
      categoryList: 'products/categoryList',
      productList: 'products/categorizedProductsList',
    }),
    categories() {
      return this.categoryList.map((category) => ({
        ...category,
        categoryName: category.categoryName.toLowerCase(),
        source: category.source.toLowerCase(),
      }))
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#add-menu {
  margin-top: 5em;
  padding: 1em;
  @include grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 20px;
  #category-form {
    grid-column: 1/8;
    grid-row: 1/2;
    background: var(--white);
  }
  form {
    padding: 1em;
    @include grid;
    grid-template-columns: 1fr 0.5fr 1.25fr;
    h2 {
      grid-column: 1/4;
    }
    .form-group {
      display: grid !important;
      grid-column: 1/4;
      grid-template-columns: 1fr 0.5fr 1.25fr;
      margin: 5px 0;
      label {
        @include label;
        grid-column: 1/2;
        align-self: center;
      }
      .form-input {
        color: #333;
        grid-column: 3/4;
        border-radius: 5px;
        border: 1px solid var(--grey);
        padding: 6px;
        height: 30px;
        font-family: var(--open);
        font-size: 15px;
        &:active,
        &:focus {
          outline: none;
        }
      }
      textarea {
        height: 100% !important;
      }
      .error {
        grid-column: 3/4;
      }
    }
    .invalid-field {
      @include relative;
      padding: 0;
      margin-top: 5px;
      .invalid {
        border-color: #c20404 !important;
      }
      .error {
        color: var(--red-variant);
        margin-top: 10px;
      }
    }
    .btn {
      @include btn;
      width: 100%;
      background: var(--blue-deep);
      margin-top: 1em;
      grid-column: 3/4;
    }
  }
  #categories {
    grid-column: 1/8;
    grid-row: 2/3;
    .category-list {
      max-height: 280px;
      overflow-y: scroll;
    }
    .header,
    .category {
      @include grid;
      grid-template-columns: 2fr 1.25fr;
      background: var(--blue-deep);
      color: var(--white);
      padding: 0.75em;
      h4,
      p {
        grid-column: 1/2;
        &:last-of-type {
          grid-column: 2/3;
        }
      }
      p {
        text-transform: capitalize;
      }
    }
    .category {
      background: var(--white);
      color: var(--dark);
      border-bottom: 1px solid var(--light_grey);
      &:last-of-type {
        border: none;
      }
      p {
        &::first-letter {
          text-transform: capitalize;
        }
      }
    }
  }
  #add-form {
    grid-column: 8/13;
    grid-row: 1/3;
    background: var(--white);
  }
  #items {
    grid-column: 1/13;
    grid-row: 3/4;
    .item-list {
      max-height: 400px;
      overflow-y: scroll;
    }
    .header,
    .item {
      @include grid;
      grid-template-columns: repeat(5, 1fr);
      background: var(--blue-deep);
      color: var(--white);
      padding: 0.75em;
      .item-name-header,
      .item-name {
        grid-column: 1/2;
      }
      .category-name-header,
      .category-name {
        grid-column: 2/3;
      }
      .source-header,
      .source {
        grid-column: 3/4;
      }
      .cost-header,
      .cost {
        grid-column: 4/5;
      }
      .availa-header,
      .availability {
        grid-column: 5/6;
      }
    }
    .item {
      background: var(--white);
      color: var(--dark);
      border-bottom: 1px solid var(--light_grey);
      &:last-of-type {
        border: none;
      }
      p {
        &::first-letter {
          text-transform: capitalize;
        }
      }
    }
  }
  @media screen and (max-width: 640px) {
    #category-form,
    #categories,
    #add-form,
    #items {
      grid-column: 1/13;
    }
    #category-form {
      grid-row: 1/2;
    }
    #categories {
      grid-row: 2/3;
    }
    #add-form {
      grid-row: 3/4;
    }
    #items {
      grid-row: 4/5;
    }
  }
}
</style>
