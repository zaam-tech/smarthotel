// const NodeGeocoder = require('node-geocoder');
// const options = {
//   // provider: process.env.GEOCODER_PROVIDER,
//   // httpAdapter: 'https',
//   // apiKey: process.env.GEOCODER_API_KEY,
//   // formatter: null,
//   provider: 'google',
//   httpAdapter: 'https',
//   apiKey: 'AIzaSyByYqRGmyWK1q67Um3U_XKYd-bX2m-RbII',
//   formatter: null,
// };

// const geocoder = NodeGeocoder(options);

// module.exports = geocoder;


// const NodeGeocoder = require('node-geocoder');

// const options = {
//   provider: 'mapquest',
//   httpAdapter: 'https',
//   apiKey: 'WwXGYvD4p5nfhDGQ9fZ7HGIwpEVLIu4B',
//   formatter: null
// };

// const geocoder = NodeGeocoder(options);

// module.exports = geocoder;
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'openstreetmap'
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;

// let nodeGeocoder = require('node-geocoder');
// let options = {
//     provider: 'openstreetmap'
//   };
   
//   let geoCoder = nodeGeocoder(options);
//   geoCoder.geocode('KCA UNIVERSITY')
//   .then((res)=> {
//     console.log(res);
//   })
//   .catch((err)=> {
//     console.log(err);
//   });