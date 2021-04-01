const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderProductSchema = new Schema({
    hotel: {
        type: String
    },
    product: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }
      ],
    quantity:  {
        type: String,
        required: true
    },
    amount:  {
        type: String,
        required: true
    },
    comment:  {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('OrderProduct', orderProductSchema);
