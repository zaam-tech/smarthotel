require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = { cloudinary };

// // CLOUDINARY_URL=cloudinary://827242541292457:w2M06TmcDHkj1CCQTbSJRE56b5c@shamirjamal


// cloudinary.v2.search
//   .expression('cat')
//   .with_field('context')
//   .with_field('metadata')
//   .with_field('tags')
//   .max_results(10)
//   .execute().then(result=>console.log(result));

//   shirt AND tags=cotton
//   resource_type:image AND width:{200 TO 1028} AND aspect_ratio:"16:9"

//   resource_type:image AND width:{200 TO 1028} AND aspect_ratio:"16:9"