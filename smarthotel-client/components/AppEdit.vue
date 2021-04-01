<template>
  <div id="add-form" @click="stopPropagation($event)">
    <form @submit.prevent="handleSubmit">
      <h2>Add items to the menu</h2>
      <div class="form-group" :class="{ 'invalid-field': category.error }">
        <label>Category name</label>
        <div class="custom-select" :class="{ disabled: editing }">
          <select
            @change="setCategory($event)"
            :class="{
              invalid: category.error,
            }"
          >
            <option value="" ref="select">Select Category</option>
            <option
              :value="categoryItem.categoryName"
              v-for="categoryItem in categories"
              :key="categoryItem.id"
            >
              {{ categoryItem.categoryName }}
            </option>
          </select>
          <span class="custom-arrow"></span>
        </div>
      </div>
      <div class="form-group" :class="{ 'invalid-field': itemName.error }">
        <label>Item name</label>
        <input
          type="text"
          class="form-input"
          v-model="itemName.model"
          :class="{
            invalid: itemName.error,
          }"
        />
        <p class="error" v-show="itemName.error">
          <span>{{ itemName.error }}</span>
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
      <div class="form-group" :class="{ 'invalid-field': cost.error }">
        <label>Cost</label>
        <input
          type="text"
          class="form-input"
          v-model="cost.model"
          :class="{
            invalid: cost.error,
          }"
        />
        <p class="error" v-show="cost.error">
          <span>{{ cost.error }}</span>
        </p>
      </div>
      <div class="form-group" :class="{ 'invalid-field': file.error }">
        <span class="custom-span">Image</span>
        <div class="input-group custom-file">
          <input
            type="file"
            class="form-input custom-file-input"
            @change="selectFile"
            ref="file"
          />
          <label class="custom-file-label"></label>
        </div>
        <p class="error" v-show="file.error">
          <span>{{ file.error }}</span>
        </p>
      </div>
      <div class="form-group" :class="{ 'invalid-field': status.error }">
        <div class="toggle-container">
          <span>Availability</span>
          <label for="status-toggle" class="toggle">
            <input
              type="checkbox"
              class="toggle-input"
              id="status-toggle"
              v-model="status.model"
            />
            <div class="toggle-fill"></div>
          </label>
        </div>
        <p class="error" v-show="status.error">
          <span>{{ status.error }}</span>
        </p>
      </div>
      <button class="btn">save</button>
    </form>
  </div>
</template>

<script>
import { bus } from '~/layouts/default.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    categories: {
      type: Array,
      required: true,
    },
    edit: {
      type: Boolean,
      required: false,
    },
    product: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      category: {
        error: '',
        model: '',
      },
      cost: {
        error: '',
        model: '',
      },
      editing: false,
      description: {
        error: '',
        model: '',
      },
      id: '',
      itemName: {
        error: '',
        model: '',
      },
      file: {
        image: null,
        error: '',
      },
      status: {
        error: false,
        model: false,
      },
    }
  },
  methods: {
    ...mapActions({
      createProduct: 'products/createProduct',
      uploadImage: 'hotel/uploadImage',
      updateProduct: 'products/updateProduct',
    }),
    async handleSubmit() {
      this.setErrors()
      if (this.isValid) {
        const matchedCategory = this.categories.find(
          (category) => category.categoryName === this.category.model
        )
        let matchedProduct = this.categorizedProductsList.find(
          (product) => product._id === this.id
        )
        const { category, itemName, description, cost, status } = this
        if (!this.editing && matchedCategory) {
          const image = this.$refs.file?.files[0]
          if (image) {
            try {
              const formData = new FormData()
              formData.append('image', image)
              await this.uploadImage(formData)
              const data = {
                availability: status.model,
                id: matchedCategory._id,
                description: description.model,
                cost: cost.model,
                productName: itemName.model,
                image: this.image,
              }
              await this.createProduct(data)
              this.setProduct(null)
              this.resetCategory()
              bus.$emit('showAddForm', false)
              bus.$emit('showPopup', {
                message: 'Product created',
                success: true,
              })
            } catch (error) {
              bus.$emit('showPopup', {
                message: error.message,
                success: false,
              })
            }
          }
        } else if (this.editing && matchedProduct) {
          const price = cost.model.split(' ')[1]
          try {
            const data = {
              availability: status.model,
              cost: price ? price : cost.model,
              description: this.description.model,
              _id: matchedProduct._id,
              imageUrl: matchedProduct.imageUrl,
              productName: itemName.model,
            }
            await this.updateProduct(data)
            this.setProduct(null)
            bus.$emit('productUpdated')
            bus.$emit('showPopup', {
              message: 'Product updated',
              success: true,
            })
          } catch (error) {
            bus.$emit('showPopup', {
              message: error.message,
              success: false,
            })
          }
        }
      }
    },
    resetCategory() {
      const { select } = this.$refs
      select.click()
    },
    setCategory(event) {
      this.category.model = event.target.value
    },
    selectFile() {
      const { file } = this.$refs
      this.file.image = file.files[0]
    },
    setProduct(product) {
      if (product) {
        const {
          availability,
          category,
          cost,
          description,
          imageUrl,
          productName,
          _id,
        } = product
        this.category.model = category.categoryName
        this.cost.model = cost
        this.description.model = description
        this.file.image = imageUrl
        this.itemName.model = productName
        this.id = _id
        this.status.model = availability
      } else {
        this.category.model = ''
        this.cost.model = ''
        this.description.model = ''
        this.file.image = ''
        this.itemName.model = ''
        this.id = ''
        this.status.model = false
      }
      this.editing = !this.editing
    },
    setErrors() {
      const { category, itemName, description, cost, file, editing } = this
      if (!itemName.model) {
        itemName.error = 'Enter item name'
      } else {
        itemName.error = ''
      }
      if (!description.model) {
        description.error = 'Enter description'
      } else {
        description.error = ''
      }
      if (!cost.model) {
        cost.error = 'Enter cost'
      } else {
        cost.error = ''
      }
      if (!editing) {
        if (!category.model) {
          category.error = 'Enter category'
        } else {
          category.error = ''
        }
        if (!file.image) {
          file.error = 'Image is required'
        } else {
          file.error = ''
        }
      }
    },
    stopPropagation(event) {
      event.stopPropagation()
    },
  },
  mounted() {},
  watch: {
    edit(newValue, oldValue) {
      if (newValue === false) {
        const { category, itemName, description, cost, file } = this
        category.error = ''
        itemName.error = ''
        description.error = ''
        cost.error = ''
        file.error = ''
      }
    },
    product(newValue, oldValue) {
      if (newValue) {
        this.setProduct(newValue)
      } else {
        this.setProduct()
      }
    },
  },
  computed: {
    isValid() {
      const {
        category,
        itemName,
        description,
        cost,
        file,
        status,
        editing,
      } = this
      if (editing) {
        if (itemName.model && status.model && cost.model) {
          return true
        } else {
          return false
        }
      } else {
        if (
          category.model &&
          itemName.model &&
          status.model &&
          cost.model &&
          file.image
        ) {
          return true
        } else {
          return false
        }
      }
    },
    ...mapGetters({
      image: 'hotel/image',
      categorizedProductsList: 'products/categorizedProductsList',
    }),
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#add-form {
  background: var(--white);
  max-width: 435px;
  form {
    padding: 1em;
    @include flexCol;
    .form-group {
      label {
        @include label;
        flex: 1;
      }
      textarea {
        height: auto !important;
      }
      .form-input {
        color: #333;
        border-radius: 5px;
        border: 1px solid var(--grey);
        font-family: var(--open);
        font-size: 15px;
        flex: 1;
        &:active,
        &:focus {
          outline: none;
        }
        &:last-of-type {
          margin-top: 10px;
        }
      }
      @include flexCol;
      margin: 10px 0;
      .custom-file {
        @include relative;
        margin-top: 10px;
        height: 30px;
      }
      .custom-file-input {
        @include relative;
        cursor: pointer;
        z-index: 2;
        width: 100%;

        margin: 0;
        opacity: 0;
      }
      .custom-span {
        @include label;
      }

      .custom-file-input:lang(en) ~ .custom-file-label::after {
        content: 'Browse';
      }

      .custom-file-label {
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        z-index: 1;
        height: 31px;
        padding: 0.375rem 0.75rem;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        border-radius: 0.25rem;
        border-top: 1px solid #ced4da;
        border-bottom: 1px solid #ced4da;
        border-left: 1px solid #ced4da;
      }

      .custom-file-label::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 3;
        display: block;
        height: 30px;
        padding: 0 0.75rem;
        line-height: 1.7;
        color: #495057;
        content: 'Browse';
        background-color: #e9ecef;
        border-radius: 0 0.25rem 0.25rem 0;
        border-right: 1px solid #ced4da;
        border-bottom: 1px solid #ced4da;
      }
      .toggle-container {
        @include center;
        @include flexSpace;
        span {
          @include label;
          display: block;
        }
        .toggle {
          --width: 45px;
          --height: calc(var(--width) / 2);
          --border-radius: calc(var(--height) / 2);
          display: block;
          cursor: pointer;
        }
        .toggle-input {
          display: none;
        }
        .toggle-fill {
          @include relative;
          margin-left: 86%;
          width: var(--width);
          height: var(--height);
          border-radius: var(--border-radius);
          background: var(--light_grey);
          transition: background 0.2s;
          &::after {
            @include absolute;
            content: '';
            background: var(--white);
            top: 0;
            left: 0;
            height: var(--height);
            width: calc(var(--height) + 1px);
            border-radius: var(--border-radius);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s;
          }
        }
        .toggle-input:checked + .toggle-fill {
          background: var(--primary);
        }
        .toggle-input:checked ~ .toggle-fill::after {
          transform: translateX(var(--height));
        }
      }
    }
    .invalid-field {
      @include relative;
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
      background: var(--color);
      margin-top: 1em;
    }
    .custom-select {
      @include custom-select;
      option {
        padding: 5px;
      }
    }
    .disabled {
      pointer-events: none;
    }
  }
}
</style>
