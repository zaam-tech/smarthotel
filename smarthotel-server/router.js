const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Hotel = require('../models/hotel')
const { otpEmail, transporter } = require("../util/generateOTP");
const otpGenerator = require("otp-generator");
const bcrypt = require('bcryptjs')

//POST Route
router.post('/register',async (req,res,next) => {
  try{
    const { email,password,fullName } = req.body
    if(!email){
      const error = new Error('Please enter a valid email address.')
      error.code = 422
      throw error
    }
    if(!password){
      const error = new Error('Please enter a valid password.')
      error.code = 422
      throw error
    }
    if(!fullName){
      const error = new Error('Fullname is required')
      error.code = 422
      throw error
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error = new Error("This email address is already in use.");
      throw error;
    }
    const OTP = otpGenerator.generate(6, {
      bold: true,
      upperCase: false,
      specialChars: false,
      alphabets: false,
      specialChar: false,
    });
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      fullName,
      password: hashedPw,
      isVerified: false,
      verificationToken: OTP,
      verificationTokenExpiryDate: Date.now() + 3600000,
    });
    const createdUser = await user.save();
    // transporter.sendMail({
    //   to: email,
    //   from: "zaamtechnologies@gmail.com",
    //   subject: "Verify your new Smart Hotel account",
    //   html: otpEmail({
    //     OTP,
    //   }),
    // });
    const newUser = {
      _id:createdUser._doc._id,
      email:createdUser._doc.email,
      fullName:createdUser._doc.fullName,
      isVerified:createdUser._doc.isVerified,
      verificationToken:createdUser._doc.verificationToken,
      verificationTokenExpiryDate:createdUser._doc.verificationTokenExpiryDate
    }
    res.status(201).json(newUser)
  }catch(error){
    res.json({ message:error.message, status:500 })
    next()
  }
})

//GET Route
router.get('/hotel/:id',async (req,res,next) => {
  try{
    if (!req.isAuth) {
      const error = new Error('Unauthorized access.');
      error.code = 402;
      throw error;
    }
    const { id } = req.params
    const hotel = await Hotel.findById(id)
      .populate("creator")
      .populate("businessInfo")
      .populate("categories")
      .populate({
        path: "categories",
        populate: {
          path: "products",
        },
      })
      .populate("orderDetail")
      .populate({
        path: "orderDetail",
        populate: {
          path: "order",
        },
      })
      .populate("tables");
    if(!hotel){
      const error = new Error('No such hotel found')
      error.code = 404
      throw error
    }
    const newHotel = {
      ...hotel._doc,
      creator:{
        userType: hotel._doc.creator.userType,
        _id: hotel._doc.creator._id,
        email: hotel._doc.creator.email,
        fullName: hotel._doc.creator.fullName,
        hotelName: hotel._doc.creator.hotelName
      }
    }
    res.status(200).json(newHotel)
  }catch(error){
    // const error = new Error('An error occurred. Try again')
    // error.code = 500
    //Use next() to call next middleware or throw error
  }
})


module.exports = router
