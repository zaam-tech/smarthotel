import Product from './Product'
interface ProductVariant
  //extends Pick<Product, 'name' | 'category' | 'description' | 'price'> 
  {
  image: string
  price: number
}
export default ProductVariant
