import Product from './Product'
interface ProductExtend extends Product {
  orders: number
  price: number
  _id: string
}
export default ProductExtend
