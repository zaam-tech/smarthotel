let nodeGeocoder = require('node-geocoder');
let options = {
    provider: 'openstreetmap'
  };
   
  let geoCoder = nodeGeocoder(options);
  geoCoder.geocode('Luray Caverns')
  .then((res)=> {
    console.log(res);
  })
  .catch((err)=> {
    console.log(err);
  });