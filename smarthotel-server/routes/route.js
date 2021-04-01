
const express = require('express');
const crypto = require("crypto");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { cloudinary } = require('../util/cloudinary');
const date = require("date-and-time");
const axios = require("axios");
const io = require("../socket");
const path = require("path");
const otpGenerator = require("otp-generator");
const { generateID } = require("generate-unique-id");
const router = express.Router()
//Import All Mongoose Models
const User = require("../models/user");
const Category = require("../models/category");
const Product = require("../models/product");
const Hotel = require("../models/hotel");
const OrderDetail = require("../models/orderDetail");
const OrderProduct = require("../models/orderProduct");
const Table = require("../models/table");
const Token = require("../models/token");
const geocoder = require('../util/geocoder');
const { clearImage } = require("../util/file");
const generateHtml = require("../util/generateHtml");
const { otpEmail, resetPasswordCodeEmail, welcomeEmail, transporter } = require("../util/generateEmails");


//For creating user account
router.post('/create-user', async (req, res, next) => {
  const { email,password,fullName } = req.body;
    try {
      const errors = [];
      if (!validator.isEmail(email)) {
        errors.push({ message: "Please enter a valid email address." });
      }
      if (validator.isEmpty(password) || !validator.isLength(password, { min: 8 })
      ) {
        errors.push({ message: "Please enter a valid password" });
      }
      if (errors.length > 0) {
        const error = new Error("Invalid inputs.");
        error.data = errors;
        error.code = 401;
        throw error;
      }
      // const existingUser = await User.findOne({ email: email });
      // if (existingUser) {
      //   const error = new Error("This email address is already in use.");
      //   throw error;
      // }
      const OTP = otpGenerator.generate(4, {
        bold: true,
        upperCase: false,
        specialChars: false,
        alphabets: false,
        specialChar: false,
      });
      const hashedPw = await bcrypt.hash(password, 12);
      const user = new User({
        email: email,
        password: hashedPw,
        fullName: fullName,
        isVerified: false,
        verificationToken: OTP,
        verificationTokenExpiryDate: Date.now() + 3600000,
      });
      const createdUser = await user.save();
      transporter.sendMail({
        to: email,
        from: "zaamtechnologies@gmail.com",
        subject: "Verify your new Smart Hotel account",
        html: otpEmail({
          OTP,
        }),
      });
      return res.status(201).json({
        ...createdUser._doc, 
        _id: createdUser._id.toString(),
        // _id:createdUser._doc._id,
        // email:createdUser._doc.email,
        // fullName:createdUser._doc.fullName,
        // isVerified:createdUser._doc.isVerified,
        // verificationToken:createdUser._doc.verificationToken,
        // verificationTokenExpiryDate:createdUser._doc.verificationTokenExpiryDate
      })
    }
    catch(error) {
      res.json({ message: error.message, status:500 })
      next()
    }
  })
//For updating user account
router.patch('/update-user', async (req, res, next) => {
  const {
    fullName,
    email,
    userName,
    password,
    gender,
    DOB,
    identityDoc,
    identity,
    expiryDate,
    issueCountry,
    phoneNumber,
  } = req.body
  try {
    const user = await User.findById(req.userId)
    .populate("orders")
    .populate({
      path: "orders",
      populate: {
        path: "order",
      },
    });
    if (!user) {
      const error = new Error("No user found!");
      error.code = 404;
      throw error;
    }
    user.fullName = fullName;
    user.userName = userName;
    user.gender = gender;
    user.DOB = DOB;
    user.identityDoc = identityDoc;
    user.identity = identity;
    user.expiryDate = expiryDate;
    user.issueCountry = issueCountry;
    user.phoneNumber = phoneNumber;
    const updatedUser = await user.save();
    return res.status(201).json({
      ...updatedUser._doc,
      _id: updatedUser._id.toString(),
    })
  }
  catch(error) {
      res.json({ message: error.message, status:500 })
      next()
    }
})
//For login of user
router.post('/user-login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: "Please enter an email address." });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid inputs.");
      error.data = errors;
      error.code = 401;
      throw error;
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("Please provide a valid email addrerss..");
      error.code = 402;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Please provide a valid passord.");
      error.code = 402;
      throw error;
    }
    if (user.isVerified !== true) {
      const error = new Error("Account verification required");
      error.code = 401;
      throw error;
    }
    const accessToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "amjustsomewheretyingtomakemistakeslifeisfullofstruggles",
      { expiresIn: "1d" });
    const refreshToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "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",
      { expiresIn: "1d" });
    return res.status(201).json({
      refreshToken: refreshToken,
      token: accessToken,
      userId: user._id.toString(),
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
//reseting of password with an otp
router.post('/user-passwordresetcode', async (req, res, next) => {
  const email = req.body
  try {
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: "Please enter a valid email address." });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid inputs.");
      error.data = errors;
      error.code = 401;
      throw error;
    }
    const OTP = otpGenerator.generate(4, {
      bold: true,
      upperCase: false,
      specialChars: false,
      alphabets: false,
      specialChar: false,
    });
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("Invalid Email. Please check your email and try again.");
      error.code = 401;
      throw error;
    }
    user.resetToken = OTP;
    user.resetTokenExpirationDate = Date.now() + 3600000;
    const restPassword = await user.save();
    transporter.sendMail({
      to: user.email,
      from: "zaamtechnologies@gmail.com",
      subject: "Smart Hotel password assistance",
      html: resetPasswordCodeEmail({
        OTP
      })
    });
    return res.status(201).json({
      ...restPassword._doc, 
      _id: restPassword._id.toString()
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
//Resetting password verification  code
router.post('/user-resettokenverfication', async (req, res, next) => {
  const { resetToken } = req.body
  try {
    const errors = [];
    if (validator.isEmpty(resetToken)) {
      errors.push({ message: "Please enter a valid One Time Password" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid inputs.");
      error.data = errors;
      error.code = 401;
      throw error;
    }
    const user = await User.findOne({
      resetToken: resetToken,
      resetTokenExpirationDate: { $gt: Date.now() },
    });
    if (!user) {
      const error = new Error("Invalid OTP. Please check your code and try again.");
      error.code = 406;
      throw error;
    }
    user.resetToken = undefined;
    user.resetTokenExpirationDate = undefined;
    const resetTokenVerification =  await user.save();
    return res.status(201).json({
      ...resetTokenVerification._doc, 
      _id: resetTokenVerification._id.toString() 
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
//for resending an otp code when reseting the password
router.post('/user-resendresettoken', async (req, res, next) => {
  const resetToken = req.body
  try {
    const OTP = otpGenerator.generate(4, {
      bold: true,
      upperCase: false,
      specialChars: false,
      alphabets: false,
      specialChar: false,
    });
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Something went wrong. Please try again after sometime.");
      error.code = 401;
      throw error;
    }
    user.resetToken = OTP;
    user.resetTokenExpirationDate = Date.now() + 3600000;
    const resetToken = await user.save();
    transporter.sendMail({
      to: user.email,
      from: "zaamtechnologies@gmail.com",
      subject: "Smart Hotel password assistance",
      html: resetPasswordCodeEmail({
        OTP
      })
    });
    return res.status(201).json({
      ...resetToken._doc, 
      _id: resetToken._id.toString()
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
//for resending an otp code wqhen verifying user account
router.post('/user-resendverificationtoken', async (req, res, next) => {
  const { email,password,fullName } = req.body
  try {
    const OTP = otpGenerator.generate(4, {
      bold: true,
      upperCase: false,
      specialChars: false,
      alphabets: false,
      specialChar: false,
    });
    //const user = await User.findById(id);
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error(
        "Something went wrong. Please try again after sometime."
      );
      error.code = 401;
      throw error;
    }
    user.isVerified = false;
    user.verificationToken = OTP;
    user.verificationExpirationDate = Date.now() + 3600000;
    const verificationToken = await user.save();
    transporter.sendMail({
      to: user.email,
      from: "zaamtechnologies@gmail.com",
      subject: "Smart Hotel password assistance",
      html: resetPasswordCodeEmail({
        OTP
      })
    });
    return res.status(201).json({
      ...verificationToken._doc, 
      _id: verificationToken._id.toString()
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
//for setting new password after reset
router.post('/user-setnewpassword', async (req, res, next) => {
  const { email,password,fullName } = req.body
  try {
    const errors = [];
    if (validator.isEmpty(password) ||
      !validator.isLength(password, { min: 8 })
    ) {
      errors.push({ message: "Please enter a valid password" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid inputs.");
      error.data = errors;
      error.code = 401;
      throw error;
    }
    //const user = await User.findById(id);
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Something went wrong. Please try again after sometime.");
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (isEqual) {
      const error = new Error("New password can't be the same as old password.");
      error.code = 402;
      throw error;
    }
    const hashedPw = await bcrypt.hash(password, 12);
    user.password = hashedPw;
    user.resetToken = undefined;
    user.resetTokenExpirationDate = undefined;

    const newPassword = await user.save();
    return res.status(201).json({
      ...newPassword._doc,
      _id: newPassword._id.toString()
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
//for acquiring new token after access token expires
router.post('/refresh-token', async (req, res, next) => {
  const refreshToken = req.params
  try {
    //Find the refresh token from the database against the logged user
    const token = await Token.findOne({
      token: refreshToken,
      user_id: req.userId,
    });
    //check for errors
    if (!token) {
      const error = new Error("Something went wrong. Please try again after sometime.");
      error.code = 406;
      throw error;
    }
    //extract payload from refresh token and generate a new access token and send it
    const payload = jwt.verify(
      token.token,
      "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"
    );

    const accessToken = jwt.sign({
      userId: payload,
    },
    "amjustsomewheretyingtomakemistakeslifeisfullofstruggles",
    {
      expiresIn: "1d" 
    });
    return res.status(201).json({
      token: accessToken,
      userId: token.user_id.toString(),
      refreshToken: token.refreshToken
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
//logout of users
router.post('/logout', async (req, res, next) => {
  const { refreshToken } = req.params
  try {
    //delete the refresh token saved in database:
    const token = await Token.findOne({
      token: refreshToken, 
      user_id: req.userId,
    });
    if (!token) {
      const error = new Error("Something is wrong try again");
      error.code = 406;
      throw error;
    }
    await Token.findOneAndDelete({
      token: refreshToken, 
      user_id: req.userId,
    });
    return true;
    // return res.status(201).json({
    //   ...restPassword._doc, 
    //   _id: restPassword._id.toString()
    // })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
//user account verification
router.post('/user-verification', async (req, res, next) => {
  const { verificationToken } = req.body
  try {
    const errors = [];
    if (
      //password must be at least 8 chars long
      validator.isEmpty(verificationToken))
      {errors.push({ message: "Please enter a valid One Time Password" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid inputs.");
      error.data = errors;
      error.code = 401;
      throw error;
    }
    //const now = new true;
    const user = await User.findOne({
      verificationToken: verificationToken,
      verificationTokenExpiryDate: { $gte: Date.now() },
    });
    if (!user) {
      const error = new Error("Invalid OTP. Please check your code and try again.");
      error.code = 406;
      throw error;
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiryDate = undefined;

    const password = await user.save();
    transporter.sendMail({
      to: user.email,
      from: "zaamtechnologies@gmail.com",
      subject: "Welcome to Smart Hotel",
       html: welcomeEmail({
         fullName: user.fullName
      })
    });
    const accessToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "amjustsomewheretyingtomakemistakeslifeisfullofstruggles",
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "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",
      { expiresIn: "1d" }
    );
    await new Token({
      token: refreshToken,
      user_id: user._id.toString(),
    }).save();
    return res.status(201).json({
      refreshToken: refreshToken,
      token: accessToken,
      userId: user._id.toString(),
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
//to get a single hotel details
router.get('/hotel/:id', async (req, res, next) => {
  if (!req.isAuth) {
    const error = new Error('Unauthorized access.');
    error.code = 402;
    throw error;
  }
  try {
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
    if (!hotel) {
      const error = new Error("No records found!");
      error.code = 404;
      throw error;
    }
    return res.status(201).json({
      ...hotel._doc,
      _id: hotel._id.toString(),
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
//to get multiple hotels 
router.get('/hotels', async (req, res, next) => {
  const { email,password,fullName } = req.body
  try {
    const hotel = await Hotel.find()
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
    if (!hotel) {
      const error = new Error("Something is wrong try again!");
      error.code = 404;
      throw error;
    }
    return res.status(201).json({
      hotels: hotel.map((h) => {
        return {
          ...h._doc,
          _id: h._id.toString(),
        };
      }),
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
//to get nearby hotels
router.get('/neary-byhotels', async (req, res, next) => {
  const { email,password,fullName } = req.body
  try {
    const longitude = 36.8270033;
    const latitude = -1.2866743;
    // var longitude = parseFloat(req.query.lng);
    // var latitude = parseFloat(req.query.lat);
    const offset = 10000;
    const limit = 10000;
    const hotel = await Hotel.find({
      //db.createIndex({"location.loc" : "2dsphere"});
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
            //coordinates: [36.8270033, -1.2866743]
          },
          $maxDistance: 3000,
        },
      },
    })
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
    if (!hotel) {
      const error = new Error("Something is wrong try again!");
      error.code = 404;
      throw error;
    }
    return res.status(201).json({
      hotels: hotel.map((h) => {
        return {
          ...h._doc,
          _id: h._id.toString(),
        };
      }),
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
//to get all hotels
router.get('/all-hotels', async (req, res, next) => {
  const { email,password,fullName } = req.body
  try {
    const hotel = await Hotel.find()
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
    if (!hotel) {
      const error = new Error("Something is wrong try again!");
      error.code = 404;
      throw error;
    }
    return res.status(201).json({
      hotels: hotel.map((h) => {
        return {
          ...h._doc,
          _id: h._id.toString(),
        };
      }),
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
//to get maultiple tables in a hotel
router.get('/tables/:hotelId', async (req, res, next) => {
  try {
    const { hotelId } = req.params
    const hotel = await Hotel.findById(hotelId);
    const table = await Table.find({ hotelInfo: hotel }).populate("hotelInfo");
    if (!table) {
      const error = new Error("Something is wrong try again!");
      error.code = 404;
      throw error;
    }
    return res.status(201).json({
      tables: table.map((t) => {
        return {
          ...t._doc,
          _id: t._id.toString(),
        };
      }),
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
//to get  a single table
router.get('/table/:tableId', async (req, res, next) => {
  const { email,password,fullName } = req.body
  try {
    const { tableId } = req.params
    const table = await Table.findById(tableId).populate("hotelInfo");
    if (!table) {
      const error = new Error("No records found!");
      error.code = 404;
      throw error;
    }
    return res.status(201).json({
      ...table._doc,
      _id: table._id.toString(),
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
//to get users details
router.get('/user', async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate("orders")
      .populate({
        path: "orders",
        populate: {
          path: "order",
        },
      });
    if (!user) {
      const error = new Error("No user found!");
      error.code = 404;
      throw error;
    }
    return res.status(201).json({
      ...user._doc,
      _id: user._id.toString(),
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
//to get multiple categories
router.get('/categories/:hotelId', async (req, res, next) => {
  const { email,password,fullName } = req.body
  try {
    const { hotelId } = req.params
    const hotel = await Hotel.findById(hotelId);
    const category = await Category.find({ hotelName: hotel })
      .populate("products")
      .populate("hotelName");
    if (!category) {
      const error = new Error("No food Items found!");
      error.code = 406;
      throw error;
    }
    return res.status(201).json({
      categories: category.map((p) => {
        return { ...p._doc, _id: p._id.toString() };
      }),
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
//get all categories
router.get('/all-categories', async (req, res, next) => {
  const { email,password,fullName } = req.body
  try {
    const category = await Category.find()
    .populate("products")
    .populate("hotelName");
  if (!category) {
    const error = new Error("No food Items found!");
    error.code = 406;
    throw error;
  }
    return res.status(201).json({
      categories: category.map((p) => {
        return { ...p._doc, _id: p._id.toString() };
      }),
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
router.get('/category/:categoryId', async (req, res, next) => {
  try {
    const { categoryId } = req.params
    const category = await Category.findById(categoryId)
      .populate("products")
      .populate("hotelName");
    if (!category) {
      const error = new Error("No food categories found!");
      error.code = 406;
      throw error;
    }
    return res.status(201).json({
      ...category._doc,
      _id: category._id.toString(),
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
router.get('/product/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params
    const product = await Product.findById(productId)
      .populate("category")
      .populate({
        path: "category",
        populate: {
          path: "hotelName",
        },
      });
    if (!product) {
      const error = new Error("No food Items found!");
      error.code = 406;
      throw error;
    }
    return res.status(201).json({
      ...product._doc,
      _id: product._id.toString(),
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
router.get('/products/:hotelId', async (req, res, next) => {
  try {
    const { hotelId } = req.params
    const hotel = await Hotel.findById(hotelId);
    const category = await Category.find({ hotelName: hotel }).populate("hotelName");
    const products = await Product.find({ category: category })
      //const products = await Product.find()
      .populate("category")
      .populate({
        path: "category",
        populate: {
          path: "hotelName",
        },
      });
    return res.status(201).json({
      products: products.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
        };
      }),
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
router.get('/all-products', async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate({
        path: "category",
        populate: {
          path: "hotelName",
        },
      });
    return res.status(201).json({
      products: products.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
        };
      }),
    })
  }
  catch(error) {
    res.json({ message: error.message, status:500 })
    next()
  }
})
router.get('/get-countries', async (req, res, next) => {
  try {
    const Api = axios.create({
      baseURL:"https://restcountries-v1.p.rapidapi.com",
        headers:{
          "x-rapidapi-key": "ae4dbf78a3mshf9e0f7437d18993p1989d8jsn775492093c80",
          "x-rapidapi-host": "restcountries-v1.p.rapidapi.com",
        }
    })
    const countryData = await Api.get('/all')
    const countries = countryData.data
    //.filter(country => country.subregion.toLowerCase().includes('eastern'))
    .map(country =>({
      name:country.name,
      code:country.alpha3Code,
      callingCode:country.callingCodes[0]
    }))
    return res.status(200).json({countries})
  } catch {
    const error = new Error("Couldn't process request")
    error.code = 500
    throw error
  }
})
//Upload Images rest api routes start  here
 //Single Upload
router.post( '/smarthotel-web-single', ( req, res, next ) => {
	profileImgUpload( req, res, ( error ) => {
    if (!req.isAuth) {
      throw new Error('Not authenticated!');
    }
    if (!req.file) {
      return res.status(200).json({ message: 'No file provided!' });
    }
    if (req.body.oldPath) {
      clearImage(req.body.oldPath);
    }
    return res
      .status(201) 
      .json({
        message:'File Stored', 
        imageName: req.file.key, 
        imageLocation: req.file.location
      })
  })
});
router.post( '/smarthotel-mobile-single', ( req, res, next ) => {
	profileImgUpload( req, res, ( error ) => {
    if (!req.isAuth) {
      throw new Error('Not authenticated!');
    }
    if (!req.file) {
      return res.status(200).json({ message: 'No file provided!' });
    }
    if (req.body.oldPath) {
      clearImage(req.body.oldPath);
    }
    return res
      .status(201) 
      .json({
        message:'File Stored', 
        imageName: req.file.key, 
        imageLocation: req.file.location
      })
  })
});
// Multiple File Uploads ( max 4 )
router.post('/smarthotel-web-multiple', ( req, res ) => {
  uploadsBusinessGallery( req, res, ( error ) => {
    if (!req.isAuth) {
      throw new Error('Not authenticated!');
    }
    if (!req.file) {
      return res.status(200).json({ message: 'No file provided!' });
    }
    if (req.body.oldPath) {
      clearImage(req.body.oldPath);
    } else {
      let fileArray = req.files, fileLocation;
      const galleryImgLocationArray = [];
        for ( let i = 0; i < fileArray.length; i++ ) {
          fileLocation = fileArray[ i ].location;
          //console.log( 'filenm', fileLocation );
          galleryImgLocationArray.push( fileLocation )
        }
        // Save the file name into database
        res.json( {
          fileArray,
          galleryImgLocationArray
        });
      }
    });
});
router.post('/smarthotel-mobile-multiple', ( req, res ) => {
  uploadsBusinessGallery( req, res, ( error ) => {
    if (!req.isAuth) {
      throw new Error('Not authenticated!');
    }
    if (!req.file) {
      return res.status(200).json({ message: 'No file provided!' });
    }
    if (req.body.oldPath) {
      clearImage(req.body.oldPath);
    } else {
      let fileArray = req.files, fileLocation;
      const galleryImgLocationArray = [];
        for ( let i = 0; i < fileArray.length; i++ ) {
          fileLocation = fileArray[ i ].location;
          //console.log( 'filenm', fileLocation );
          galleryImgLocationArray.push( fileLocation )
        }
        // Save the file name into database
        res.json( {
          fileArray,
          galleryImgLocationArray
        });
      }
    });
});
//local storage upload
router.put('/post-image', (req, res, next) => {
  // if (!req.isAuth) {
  //   throw new Error('Not authenticated!');
  // }
  if (!req.file) {
    return res.status(200).json({ message: 'No file provided!' });
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  return res
    .status(201)
    .json({ message: 'File stored.', filePath: req.file.path 
  });
});
module.exports = router