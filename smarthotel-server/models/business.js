const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const businessSchema = new Schema({
    regNo: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    hotelName:{
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: false
    },
    address: {
        country : {
          type: String,
          required: false
        },
        postalCode : {
            type: String,
            required: false
        },
        region : {
            type: String,
            required: false
        },
        city : {
            type: String,
            required: false
        },
        address1 : {
            type: String,
            required: false
        },
        address2 : {
            type: String,
            required: false
        },
    },
    pContact: {
        firstName :  {
          type: String,
          required: false
        },
        secondName :  {
          type: String,
          required: false
        },
        lastName :  {
          type: String,
          required: false
        },
    }
});
module.exports = mongoose.model('BusinessDetail', businessSchema);