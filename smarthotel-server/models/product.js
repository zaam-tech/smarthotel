const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName:{
    type: String,
    required: true
  },
  description:{
      type: String,
      required: true
  },
  imageUrl:{
    type: String,
    required: false
  },
  cost:{
      type: String,
      required: false
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: false
  }
});
module.exports = mongoose.model('Product', productSchema);
