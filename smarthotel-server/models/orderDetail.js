const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderDetailSchema = new Schema({
    orderNumber: {
        type: String,
        required: false
    },
    orderDate: {
        type: String,
        required: false
    },
    paidDate: {
        type: String,
        required: false
    },
    totalAmount: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: false
    },
    hotelInfo: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: false
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    order: [
        {
            type: Schema.Types.ObjectId,
            ref: 'OrderProduct',
            required: true
        }
      ]
},
{ timestamps: true });
module.exports = mongoose.model('OrderDetail', orderDetailSchema);
