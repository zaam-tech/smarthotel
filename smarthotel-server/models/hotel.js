const geocoder = require('../util/geocoder');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const StoreSchema = new mongoose.Schema({
const hotelSchema = new Schema({
    country : {
      type: String,
      required: true
    },
    businessType: {
      type: String,
      required: true
    },
    businessName: {
      type: String,
      required: true
    },
    hotelName: {
      type: String,
      required: false
    },
    homeDelivery: {
      type: Boolean,
      default: "false"
    },
    logoUrl: {
      type: String,
      required: false
    },
    hotelEmail: {
      type: String,
      required: false
    },
    hotelPhoneNumber: {
      type: String,
      required: false
    },
    hotelWebSite: {
      type: String,
      required: false
    },
    isVerified: {
      type : String,
      default: "false"
    },
    address: {
      type: String,
      default: "Tom Mboya Street",
    },
    location: {
      type: {
        //createIndex: true,
        type: String, 
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        createIndex: '2dsphere'
      },
      formattedAddress: String,
      country: String,
      countryCode: String,
      city: String,
      zipcode: String,
      streetName: String,
      streetNumber: String,
      streetAddress: String,
      route: String,
      intersection: String,
      political: String,
      administrativeAreaLevel1: String,
      administrativeAreaLevel2: String,
      administrativeAreaLevel3: String,
      administrativeAreaLevel4: String,
      administrativeAreaLevel5: String,
      colloquialArea: String,
      locality: String,
      ward: String,
      sublocality: String,
      neighborhood: String,
      premise: String,
      subpremise: String,
      postalCode: String,
      naturalFeature: String,
      airport: String,
      park: String,
      pointOfInterest: String,
      provider: String,

    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'WebUser',
      //required: true
    },
    businessInfo: {
      type: Schema.Types.ObjectId,
      ref: 'BusinessDetail',
      required: false
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false
      }
    ],
    orderDetail: [
      {
        type: Schema.Types.ObjectId,
        ref: 'OrderDetail',
        required: false
      }
    ],
    tables: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Table'
      }
    ],
    devices: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Device'
      }
    ]
  },
  
  { timestamps: true });
  //Geocode & create location
  hotelSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    country: loc[0].country,
    countryCode: loc[0].countryCode,
    city: loc[0].city,
    zipcode: loc[0].zipcode,
    streetName: loc[0].streetName,
    streetNumber: loc[0].streetNumber,
    streetAddress: loc[0].streetAddress,
    route: loc[0].route,
    intersection: loc[0].intersection,
    political: loc[0].political,
    administrativeAreaLevel1: loc[0].administrativeAreaLevel1,
    administrativeAreaLevel2: loc[0].administrativeAreaLevel2,
    administrativeAreaLevel3: loc[0].administrativeAreaLevel3,
    administrativeAreaLevel4: loc[0].administrativeAreaLevel4,
    administrativeAreaLevel5: loc[0].administrativeAreaLevel5,
    colloquialArea: loc[0].colloquialArea,
    locality: loc[0].locality,
    ward: loc[0].ward,
    sublocality: loc[0].sublocality,
    neighborhood: loc[0].neighborhood,
    premise: loc[0].premise,
    subpremise: loc[0].subpremise,
    postalCode: loc[0].postalCode,
    naturalFeature: loc[0].naturalFeature,
    airport: loc[0].airport,
    park: loc[0].park,
    pointOfInterest: loc[0].pointOfInterest,
    provider: loc[0].provider,
    
  };
  // Do not save address
  //this.address = undefined;
  //hotelSchema.index({ location: '2dsphere' });
  next();
});
module.exports = mongoose.model('Hotel', hotelSchema);