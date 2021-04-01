const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  categoryName:{
    type: String,
    required: true
  },
  source:{
      type: String,
      required: true
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: false
    }
  ],
  hotelName: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: false
  }
});
module.exports = mongoose.model('Category', categorySchema);
