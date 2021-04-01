const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const webUserSchema = new Schema({
    fullName: {
      type: String,
      required: true
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
      required: true
    },
    resetToken:{ 
      type: String
    },
    resetTokenExpirationDate: {
      type: Date
    },
    isVerified: {
      type: Boolean
      //default: "False",
    },
    verificationToken: {
      type: String
    },
    verificationTokenExpiryDate: {
      type: Date
    },
    userType: {
      type: String,
      default: "Master Admin",
      required: false
      },
    citizenShip:{
      type: String,
      required: false
    },
    birthCountry: {
      type: String,
      required: false
    },
    DOB: {
      type: String,
      required: false
    },
    identityDoc: {
      type: String,
      required: false
    },
    identity: {
      type: String,
      required: false
    },
    expiryDate: {
      type: String,
      required: false
    },
    issueCountry: {
      type: String,
      required: false
    },
    phoneNumber: {
      type: String,
      required: false
    },
    address : {
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
    hotelName: {
      type: Schema.Types.ObjectId,
      ref: 'Hotel'
    },
   
});
module.exports = mongoose.model('WebUser', webUserSchema);