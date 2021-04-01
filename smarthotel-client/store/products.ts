import Category from '@/interfaces/Category'
import Product from '@/interfaces/Product'
import Api from '@/services/apiService'
import formatCurrency from '~/utilities/formatCurrency'
const { v4 } = require('uuid')

export const state = () => ({
  categories: [
    {
      _id: v4(),
      categoryName: 'appertizers',
      source: 'kitchen',
      products: [
        {
          availability: true,
          _id: v4(),
          productName: 'hamburger',
          description: 'This is tastiest food there is. You really gotta try',
          imageUrl: '/hamburger.jpg',
          category: {
            _id: v4(),
            categoryName: 'appertizers',
          },
          cost: '4500',
        },
        {
          availability: true,
          _id: v4(),
          productName: 'hamburger',
          description: 'This is tasty food',
          imageUrl: '/hamburger.jpg',
          category: {
            _id: v4(),
            categoryName: 'appertizers',
          },
          cost: '50',
        },
        {
          availability: true,
          _id: v4(),
          productName: 'hamburger',
          description: 'This is tasty food',
          imageUrl: '/hamburger.jpg',
          category: {
            _id: v4(),
            categoryName: 'appertizers',
          },
          cost: '75',
        },
        {
          availability: true,
          _id: v4(),
          productName: 'hamburger',
          description: 'This is tasty food',
          imageUrl: '/hamburger.jpg',
          category: {
            _id: v4(),
            categoryName: 'appertizers',
          },
          cost: '175',
        },
        {
          availability: true,
          _id: v4(),
          productName: 'hamburger',
          description: 'This is tasty food',
          imageUrl: '/hamburger.jpg',
          category: {
            _id: v4(),
            categoryName: 'appertizers',
          },
          cost: '320',
        },
      ],
    },
    {
      _id: v4(),
      categoryName: 'breakfast',
      source: 'kitchen',
      products: [
        {
          availability: true,
          _id: v4(),
          productName: 'waffles',
          description: 'This is tasty food',
          imageUrl: '/waffles.jpg',
          category: {
            _id: v4(),
            categoryName: 'breakfast',
          },
          cost: '450',
        },
        {
          availability: true,
          _id: v4(),
          productName: 'waffles',
          description: 'This is tasty food',
          imageUrl: '/waffles.jpg',
          category: {
            _id: v4(),
            categoryName: 'breakfast',
          },
          cost: '450',
        },
        {
          availability: true,
          _id: v4(),
          productName: 'waffles',
          description: 'This is tasty food',
          imageUrl: '/waffles.jpg',
          category: {
            _id: v4(),
            categoryName: 'breakfast',
          },
          cost: '450',
        },
        {
          availability: true,
          _id: v4(),
          productName: 'waffles',
          description: 'This is tasty food',
          imageUrl: '/waffles.jpg',
          category: {
            _id: v4(),
            categoryName: 'breakfast',
          },
          cost: '450',
        },
        {
          availability: true,
          _id: v4(),
          productName: 'waffles',
          description: 'This is tasty food',
          imageUrl: '/waffles.jpg',
          category: {
            _id: v4(),
            categoryName: 'breakfast',
          },
          cost: '450',
        },
      ],
    },
    {
      _id: v4(),
      categoryName: 'lunch',
      source: 'kitchen',
    },
    {
      _id: v4(),
      categoryName: 'dinner',
      source: 'kitchen',
    },
    {
      _id: v4(),
      categoryName: 'pizza',
      source: 'bar',
    },
    {
      _id: v4(),
      categoryName: 'beverages',
      source: 'kitchen',
    },
  ],
})

export const mutations = {
  ACTIVATE_CATEGORY(state: any, activeCategory: Category) {
    state.categories = state.categories.map((category: Category) => {
      if (category._id === activeCategory._id) {
        category.active = activeCategory.categoryName === category.categoryName
      } else {
        category.active = false
      }
      return category
    })
    console.log(state.categories)
  },
  CREATE_CATEGORY: (state: any, category: Category) => {
    const newCategory = {
      ...category,
      active: false,
    }
    state.categories.push(newCategory)
  },
  CREATE_PRODUCT: (state: any, data: any) => {
    const { id, product } = data
    const category = state.categories.find(
      (category: Category) => category._id === id
    )
    if (category) {
      const newProduct = {
        ...product,
        cost: formatCurrency(product.cost),
      }
      category.products.push(newProduct)
    }
  },
  DELETE_CATEGORY: (state: any, categoryId: string) => {
    state.categories = state.categories.filter(
      (category: any) => category._id !== categoryId
    )
  },
  DELETE_PRODUCT: (state: any, product: any) => {
    state.categories = state.categories.map((category: Category) => {
      if (product.category.categoryName === category.categoryName) {
        const newProducts = category.products.filter(
          (p) => p._id !== product._id
        )
        category.products = newProducts
        return category
      }
      return category
    })
  },
  SELECT_CATEGORY: (state: any, selectedCat: Category) => {
    state.categories.forEach((cat: Category) => {
      cat.active = selectedCat.name === cat.name
    })
  },
  SEARCH_PRODUCT: (state: any, term: string) => {
    const filteredProducts = state.products.filter((product: Product) => {
      return product.productName.toLowerCase().includes(term.toLowerCase())
    })
    if (filteredProducts.length > 0) {
      state.selectedProducts = filteredProducts
      state.response = {
        message: 'Not true',
        success: true,
      }
    } else {
      state.response = {
        message: `Could'nt find the product`,
        success: false,
      }
    }
  },
  SET_CATEGORIES: (state: any, categories: Array<Category>) => {
    state.categories = categories.map((category: Category) => ({
      ...category,
      active: false,
      products: category.products.map((product: Product) => ({
        ...product,
        cost: formatCurrency(product.cost),
      })),
    }))
  },
  UPDATE_CATEGORY: (state: any, category: any) => {
    state.categories = state.categories.map((cat: any) => {
      if (category._id !== cat._id) {
        cat = category
        return cat
      }
      return cat
    })
  },
  UPDATE_PRODUCT: (state: any, updatedProduct: Product) => {
    state.categories = state.categories.map((category: Category) => {
      if (updatedProduct.category.categoryName === category.categoryName) {
        const index = category.products.findIndex(
          (product: Product) => product._id === updatedProduct._id
        )
        if (index !== -1) {
          category.products[index] = {
            ...category.products[index],
            availability: updatedProduct.availability,
            productName: updatedProduct.productName,
            description: updatedProduct.description,
            imageUrl: updatedProduct.imageUrl,
            category: {
              ...category.products[index].category,
            },
            cost: formatCurrency(updatedProduct.cost),
          }
        }
      }
      return category
    })
  },
}

export const actions = {
  activateCategory(store: any, category: Category) {
    store.commit('ACTIVATE_CATEGORY', category)
  },
  async createCategory(store: any, data: any) {
    try {
      const temp: any = localStorage.getItem('hotel')
      const hotel = JSON.parse(temp)
      const id = hotel._id
      if (id) {
        const query = `
            mutation {
                createCategory(hotelId:"${id}",categoryInput:{
                  categoryName: "${data.categoryName}"
                  description:"${data.description}"
                  source: "${data.source}"
                }){
                  _id
                  categoryName
                  description
                  source
                }
          }`
        const request: any = await Api.makeQuery(query)
        if (request.response) {
          const errors = request.response.data.errors
          if (errors && errors.length) {
            const error = errors[0]
            throw error
          }
        } else if (request.data) {
          const {
            data: {
              data: { createCategory },
            },
          } = request
          if (createCategory) {
            store.commit('CREATE_CATEGORY', createCategory)
          } else {
            throw new Error("Couldn't process your request. Try again later")
          }
        } else {
          throw new Error('Network Error')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async createProduct(store: any, data: any) {
    try {
      const query = `
          mutation {
              createProduct(categoryId:"${data.id}",productInput:{
                availability:${data.availability}            
                productName: "${data.productName}"
                description: "${data.description}"
                imageUrl: "${data.image}"
                cost: "${data.cost}"
              }){
                _id
                availability
                category{
                  _id
                  categoryName
                  source
                }                                
              cost
              description
              imageUrl
              productName
            }
        }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        const errors = request.response.data.errors
        if (errors && errors.length) {
          const error = errors[0]
          throw error
        }
      } else if (request.data) {
        const {
          data: {
            data: { createProduct },
          },
        } = request
        if (createProduct) {
          store.commit('CREATE_PRODUCT', {
            id: data.id,
            product: createProduct,
          })
        } else {
          throw new Error("Couldn't process your request. Try again later")
        }
      } else {
        throw new Error('Network Error')
      }
    } catch (error) {
      throw error
    }
  },
  async deleteProduct(store: any, product: Product) {
    try {
      const query = `
          mutation {
              deleteProduct(productId:"${product._id}")
            }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        const errors = request.response.data.errors
        if (errors && errors.length) {
          const error = errors[0]
          throw error
        }
      } else if (request.data) {
        const {
          data: {
            data: { deleteProduct },
          },
        } = request
        if (!deleteProduct) {
          throw new Error("Couldn't process your request. Try again later")
        } else {
          store.commit('DELETE_PRODUCT', product)
        }
      } else {
        throw new Error('Network Error')
      }
    } catch (error) {
      throw error
    }
  },
  async deleteCategory(store: any, data: any) {
    try {
      const temp: any = localStorage.getItem('hotel')
      const hotel = JSON.parse(temp)
      const id = hotel._id
      if (id) {
        const query = `
            mutation {
                deleteCategory(categoryId:"${data.id}")
              }`
        const request: any = await Api.makeQuery(query)
        if (request.response) {
          const errors = request.response.data.errors
          if (errors && errors.length) {
            const error = errors[0]
            throw error
          }
        } else if (request.data) {
          const {
            data: {
              data: { deleteCategory },
            },
          } = request
          if (deleteCategory) {
            store.commit('DELETE_CATEGORY', data.id)
          } else {
            throw new Error("Couldn't process your request. Try again later")
          }
        } else {
          throw new Error('Network Error')
        }
      }
    } catch (error) {
      throw error
    }
  },
  getProductbyCategory(store: any, category: string) {
    store.commit('getProductbyCategory', category)
  },
  selectCategory(store: any, category: Category) {
    store.commit('SELECT_CATEGORY', category)
  },
  searchProduct(store: any, searchTerm: string) {
    store.commit('SEARCH_PRODUCT', searchTerm)
  },
  async getAllCategories(store: any) {
    try {
      const temp: any = localStorage.getItem('hotel')
      const hotel = JSON.parse(temp)
      const id = hotel._id
      const query = `{
         categories(hotelId:"${id}"){
           categories{
            _id
            categoryName,
            source,  
            description           
            products{
              category{
                categoryName
                _id
                source                
              }
              availability
              _id
              productName
              description
              imageUrl
              cost
            }
          }
         }
       }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else if (request.data) {
        const {
          data: {
            categories: { categories },
          },
        } = request.data
        if (categories) {
          store.commit('SET_CATEGORIES', categories)
        }
      } else {
        throw new Error('Network Error. Try again later')
      }
    } catch (error) {
      throw error
    }
  },
  async getAllProducts(store: any) {
    try {
      const temp: any = localStorage.getItem('hotel')
      const hotel = JSON.parse(temp)
      const id = hotel._id
      const query = `{
        products(hotelId: ${id}) {
            products {
                _id
                category {
                    _id
                    categoryName
                    source
                }
                availability
                cost
                description
                imageUrl
                productName
            }
        }
      }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else if (request.data) {
        const {
          data: {
            products: { products },
          },
        } = request.data
        if (products) {
          console.log(products)
        }
      } else {
        throw new Error('Network Error. Try again later')
      }
    } catch (error) {
      throw error
    }
  },
  async getProduct() {
    try {
      const query = `{
        product(id:"5f85deeb27bd871d34e6edd6"){
          image
          productName
          id
          description
        }
      }
      `
      const response: any = await Api.makeQuery(query)
      const { data } = response
      console.log(data.data.product)
    } catch (error) {
      console.log(error)
    }
  },
  async updateCategory(store: any, data: any) {
    try {
      const temp: any = localStorage.getItem('hotel')
      const hotel = JSON.parse(temp)
      const id = hotel._id
      if (id) {
        const query = `
            mutation {
                updateCategory(categoryId:"${data.id}",categoryInput:{
                  categoryName: "${data.categoryName}"
                  source: "${data.source}"
                }){
                  _id
                  categoryName
                  source
                  products{
                    id
                    category {
                        id
                        categoryName
                        source
                    }
                    productName
                    description
                    imageUrl
                    cost
                  }
                  hotelName{
                    _id
                  }
                }
          }`
        const request: any = await Api.makeQuery(query)
        if (request.response) {
          const errors = request.response.data.errors
          if (errors && errors.length) {
            const error = errors[0]
            throw error
          }
        } else if (request.data) {
          const {
            data: {
              data: { updateCategory },
            },
          } = request
          if (updateCategory) {
            store.commit('UPDATE_CATEGORY', updateCategory)
          } else {
            throw new Error("Couldn't process your request. Try again later")
          }
        } else {
          throw new Error('Network Error')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async updateProduct(store: any, data: any) {
    try {
      const query = `
          mutation {
              updateProduct(productId:"${data._id}",productInput:{
                availability:${data.availability}
                productName: "${data.productName}"
                description: "${data.description}"
                imageUrl: "${data.imageUrl}"
                cost: "${data.cost}"
              }){
                _id
                availability
                category{
                  _id
                  categoryName
                  source                  
                }
                productName
                description
                imageUrl
                cost
              }
        }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        const errors = request.response.data.errors
        if (errors && errors.length) {
          const error = errors[0]
          throw error
        }
      } else if (request.data) {
        const {
          data: {
            data: { updateProduct },
          },
        } = request
        if (updateProduct) {
          store.commit('UPDATE_PRODUCT', updateProduct)
        } else {
          throw new Error("Couldn't process your request. Try again later")
        }
      } else {
        throw new Error('Network Error')
      }
    } catch (error) {
      throw error
    }
  },
}

export const getters = {
  categoryList(store: any) {
    return store.categories.map((category: Category) => ({
      active: category.active !== undefined ? category.active : false,
      categoryName: category.categoryName,
      _id: category._id,
      source: category.source,
      products: category.products,
    }))
  },
  categorizedProducts(store: any) {
    const allCategories = store.categories
    const temp = allCategories
      .map((category: Category) => ({
        categoryName: category.categoryName,
        products: category.products,
      }))
      .filter((el: any) => !!el.products)
    return temp
  },
  categorizedProductsList(store: any) {
    const allCategories = store.categories
    const temp = allCategories
      .map((category: Category) => category.products)
      .filter((el: Array<Product>) => !!el)
      .flat(Infinity)
    return temp
  },
  categoriesWithProducts(store: any) {
    const allCategories = store.categories
    const temp = allCategories.filter(
      (category: Category) => category.products.length > 0
    )
    return temp
  },
  getProductByCategory: (store: any) => (category: string) => {
    return store.categories
      .map((category: Category) => ({
        _id: category._id,
        active: category.active,
        categoryName: category.categoryName,
        products: category.products,
      }))
      .filter((el: any) => !!el.products)
      .filter((product: Category) => {
        return product.categoryName.toLowerCase() === category.toLowerCase()
      })
  },
  getProductByName: (store: any) => (query: string) => {
    return store.categories
      .map((category: Category) => category.products)
      .filter((el: Array<Product>) => !!el)
      .flat(Infinity)
      .filter((product: Product) => {
        const productName = query.toLowerCase()
        return product.productName.toLowerCase().includes(productName)
      })
  },
  productsWithSource(store: any) {
    const allCategories = store.categories
    const temp = allCategories
      .map((category: Category) => ({
        source: category.source,
        products: category.products,
      }))
      .filter((el: any) => !!el.products)
      .flat(Infinity)
    return temp
  },
}
