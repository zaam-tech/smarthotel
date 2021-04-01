const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cashierSchema = new Schema({
    fullName: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: false
    },
    password: {
      type: String,
      required: false
    },
    userType: {
      type: String,
        required: false
      },
    phoneNumber: {
      type: String,
      required: false
    },
    address      : {
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
    business: {
      type: String,
      required: false
    },
    hotel: {
      type: String,
      required: false
    }

});
module.exports = mongoose.model('CashierUser', cashierSchema);