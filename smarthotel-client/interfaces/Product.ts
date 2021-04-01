interface Product {
  availability: boolean
  category: {
    _id: string
    categoryName: string
    source?: string
  }
  cost: string
  description?: string
  productName: string
  imageUrl: string
  _id: string
}
export default Product
