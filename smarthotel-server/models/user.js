const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
      fullName: {
        type: String,
        required: false
      },
      email: {
        type: String,
        required: false
      },
      userName: {
        type: String,
        required: false
      },
      password: {
        type: String,
        required: false
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
      gender: {
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
      phoneNumber:{
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
      orders: [
        {
          type: Schema.Types.ObjectId,
          ref: 'OrderDetail',
          required: false
        }
      ],

});
module.exports = mongoose.model('User', userSchema);
