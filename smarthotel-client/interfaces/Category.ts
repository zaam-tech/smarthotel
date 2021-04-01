import Product from './Product'

export default interface Category {
  active: boolean
  name: string
  icon: string
  _id: string
  categoryName: string
  products: Array<Product>
  source: string
}
