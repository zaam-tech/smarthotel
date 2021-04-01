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

//Import All Mongoose Models
const User = require("../models/user");
const WebUser = require("../models/webUser");
const Category = require("../models/category");
const Product = require("../models/product");
const Hotel = require("../models/hotel");
const OrderDetail = require("../models/orderDetail");
const OrderProduct = require("../models/orderProduct");
const BusinessDetail = require("../models/business");
const Table = require("../models/table");
const Token = require("../models/token");
const Qrcode = require("../models/qrcode");
//const Store = require('../models/store');
const geocoder = require('../util/geocoder');
const { clearImage } = require("../util/file");
const generateHtml = require("../util/generateHtml");
const { otpEmail, resetPasswordCodeEmail, welcomeEmail, transporter } = require("../util/generateEmails");

const base64_encode = (file) => {
  var bitmap = fs.readFileSync(path.join(__dirname, "../public/", file));
  return Buffer.from(bitmap).toString("base64");
};


module.exports = {
  // //Qr Code Generation
  // generateQrCode: async function ({ id }, req) {
  //   // if (!req.isAuth) {
  //   //   const error = new Error('Unauthorized access.');
  //   //   error.code = 402;
  //   //   throw error;
  //   // }
  //   //Get the table details to be encoded
  //   const table = await Table.findById(id).populate("hotelInfo");
  //   if (!table) {
  //     const error = new Error("No records found!");
  //     error.code = 404;
  //     throw error;
  //   }
  //   //declare varriables to hold data used to be encoded
  //   const data = {
  //     tableId: table._id,
  //     tableNumber: table.tableNumber,
  //     hotelInfo: table.hotelInfo
  //   };
  //   //Declare qr code options needed to generate the qr code
  //   var opts = {
  //     type: "image/png", 
  //     // errorCorrectionLevel : 'M',
  //     // version: 3,
  //   }
  //   //Generate the QR Code
  //   const newQrcode = await QrCodeGenerator.toString(JSON.stringify(data), opts);
  //   // const newQrcode = await QrCodeGenerator.toString(JSON.stringify(data), {
  //   //   //type: "image/png",
  //   //   type: "terminal"
  //   // });
  //   console.log(newQrcode)
  //   //Update the QR Code field in the table collection on SmartHotel Database
  //   table.qrCode = newQrcode;
  //   const updatedTable = await table.save();

  //   return {
  //     ...updatedTable._doc,
  //     _id: updatedTable._id.toString(),
  //   };
  // },
  pdfGeneration: async ({ tableId, hotelId }) => {
    try {
      const hotel = await Hotel.findById(hotelId);
      const table = await Table.findById(tableId);

      if (!hotel) {
        const error = new Error("hotel does not exist");
        throw error;
      }
      if (!table) {
        const error = new Error("table does not exist");
        throw error;
      }
      const business = await BusinessDetail.findOne({
        business: hotel.businessInfo,
      });
      if (!business) {
        const error = new Error("business does not exist");
        throw error;
      }
      const qrcodeImage = table.qrCode;
      const logo = `data:image/png;base64,${base64_encode("avatar2.png")}`;
      const {
        address: { address1, postalCode, city, country },
      } = business;
      const { hotelName, businessName } = hotel;
      const html = generateHtml({
        logo,
        hotelName,
        address1,
        postalCode,
        city,
        country,
        qrcodeImage,
        businessName,
      });
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html);
      const filePath = path.join(__dirname, "../public");
      const pdfPath = `${filePath}/${businessName.toLowerCase()}.pdf`;
      await page.pdf({
        path: pdfPath,
        width: 700,
        height: 670,
      });

      await browser.close();

      return true;
    } catch (error) {
      console.log(error);
    }
  },
  
  generatePdf: async ({ tableId, hotelId }) => {
    try {
      const hotel = await Hotel.findById(hotelId);
      const table = await Table.findById(tableId);

      if (!hotel) {
        const error = new Error("hotel does not exist");
        throw error;
      }
      if (!table) {
        const error = new Error("table does not exist");
        throw error;
      }
      const business = await BusinessDetail.findOne({
        business: hotel.businessInfo,
      });
      if (!business) {
        const error = new Error("business does not exist");
        throw error;
      }
      const qrcodeImage = table.qrCode;
      const logo = `data:image/png;base64,${base64_encode("avatar2.png")}`;
      const {
        address: { address1, postalCode, city, country },
      } = business;
      const { hotelName, businessName } = hotel;
      const html = generateHtml({
        logo,
        hotelName,
        address1,
        postalCode,
        city,
        country,
        qrcodeImage,
        businessName,
      });
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html);
      const filePath = path.join(__dirname, "../public");
      const pdfPath = `${filePath}/${businessName.toLowerCase()}.pdf`;
      await page.pdf({
        path: pdfPath,
        width: 700,
        height: 670,
      });

      await browser.close();

      return true;
    } catch (error) {
      console.log(error);
    }
  },

  //Resolver ednpoint for creating admin user/ adding users to the database
  //Used for during account creation on Hotel Registration
  createAdminUser: async function ({ webUserInput }, req) {
    const errors = [];
    if (!validator.isEmail(webUserInput.email)) {
      errors.push({ message: "Please enter a valid email address." });
    }
    if (
      //password must be at least 8 chars long
      validator.isEmpty(webUserInput.password) ||
      !validator.isLength(webUserInput.password, { min: 8 })
    ) {
      errors.push({ message: "Please enter a valid password" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid inputs.");
      error.data = errors;
      error.code = 401;
      throw error;
    }
    const existingUser = await WebUser.findOne({ email: webUserInput.email });
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
    const hashedPw = await bcrypt.hash(webUserInput.password, 12);
    const adminUser = new WebUser({
      email: webUserInput.email,
      fullName: webUserInput.fullName,
      password: hashedPw,
      userType: webUserInput.userType,
      isVerified: false,
      verificationToken: OTP,
      verificationTokenExpiryDate: Date.now() + 3600000,
    });
    const createdUser = await adminUser.save();
    //Send the email to the created account
    transporter.sendMail({
      to: adminUser.email,
      from: "zaamtechnologies@gmail.com",
      subject: "Verify your new Smart Hotel account",
       html: otpEmail({
        OTP
      })
    });
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  //Resolver endpoint for updating  admin user
  //Used for during account creation on Hotel Registration
  updateAdminUser: async function ({ id, webUserInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access. Kindly contact system adminstrator');
    //   error.code = 402;
    //   throw error;
    // }
    const errors = [];
    // if (validator.isEmpty(webUserInput.citizenShip)) {errors.push({ message: "Please select citizenship country." });}
    // if (validator.isEmpty(webUserInput.birthCountry)) {errors.push({ message: "Please select country of birth." });}
    // if (validator.isEmpty(webUserInput.DOB)) {errors.push({ message: "Please enter a valid date of birth." });}
    // if (validator.isEmpty(webUserInput.identityDoc)) {errors.push({ message: "Please select a valid identity." });}
    // if (validator.isEmpty(webUserInput.identity)) {errors.push({ message: "Please enter a valid identity." });}
    // if (validator.isEmpty(webUserInput.expiryDate)) {errors.push({ message: "Please enter a valid date of expiry." });}
    // if (validator.isEmpty(webUserInput.issueCountry)) {errors.push({ message: "Please select a valid country of issue." });}
    // if (validator.isEmpty(webUserInput.phoneNumber)) {errors.push({ message: "Please enter a valid phone number." });}
    // if (errors.length > 0) {
    //   const error = new Error("Invalid inputs.");
    //   error.data = errors;
    //   error.code = 401;
    //   throw error;
    // }
    const admin = await WebUser.findById(req.userId).populate("hotelName");
    if (!admin) {
      const error = new Error("No records found");
      error.code = 404;
      throw error;
    }
    if (webUserInput.citizenShip !== undefined) {
      admin.citizenShip = webUserInput.citizenShip;
    }
    if (webUserInput.birthCountry !== undefined) {
      admin.birthCountry = webUserInput.birthCountry
    }
    if (webUserInput.DOB !== undefined) {
      admin.DOB = webUserInput.DOB;
    }
    if (webUserInput.identityDoc !== undefined) {
      admin.identityDoc = webUserInput.identityDoc;
    }
    if (webUserInput.identity!== undefined) {
      admin.identity = webUserInput.identity;
    } 
    if (webUserInput.expiryDate !== undefined) {
      admin.expiryDate = webUserInput.expiryDate;
    }
    if (webUserInput.issueCountry !== undefined) {
      admin.issueCountry = webUserInput.issueCountry;
    }
    if (webUserInput.phoneNumber !== undefined) {
      admin.phoneNumber = webUserInput.phoneNumber;
    } 
    if (webUserInput.address !== undefined) {
      admin.address = {
        country: webUserInput.address.country,
        postalCode: webUserInput.address.postalCode,
        region: webUserInput.address.region,
        city: webUserInput.address.city,
        address1: webUserInput.address.address1,
        address2: webUserInput.address.address2,
      };
    }
    const updatedAdmin = await admin.save();

    return {
      ...updatedAdmin._doc,
      _id: updatedAdmin._id.toString(),
    };
  },
  //Resolver endpoint for updating hotel users
  //Used to update the hotel user records when they are logged in.
  updateWebUser: async function ({ webUserInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access. Kindly contact system adminstrator');
    //   error.code = 402;
    //   throw error;
    // }
    const errors = [];
    // if (validator.isEmpty(webUserInput.fullName)) {errors.push({ message: "Please enter a valid name." });}
    // if (validator.isEmail(webUserInput.email)) {errors.push({ message: "Please enter a valid email address." });}
    // if (validator.isEmpty(webUserInput.userName)) {errors.push({ message: "Please enter a valid username." });}
    // if (validator.isEmpty(webUserInput.userType)) {errors.push({ message: "Please select account user type." });}
    // if (validator.isEmpty(webUserInput.citizenShip)) {errors.push({ message: "Please select citizenship country." });}
    // if (validator.isEmpty(webUserInput.birthCountry)) {errors.push({ message: "Please select country of birth." });}
    // if (validator.isEmpty(webUserInput.DOB)) {errors.push({ message: "Please enter a valid date of birth." });}
    // if (validator.isEmpty(webUserInput.identityDoc)) {errors.push({ message: "Please select a valid identity." });}
    // if (validator.isEmpty(webUserInput.identity)) {errors.push({ message: "Please enter a valid identity." });}
    // if (validator.isEmpty(webUserInput.expiryDate)) {errors.push({ message: "Please enter a valid date of expiry." });}
    // if (validator.isEmpty(webUserInput.issueCountry)) {errors.push({ message: "Please select a valid country of issue." });}
    // if (validator.isEmpty(webUserInput.phoneNumber)) {errors.push({ message: "Please enter a valid phone number." });}
    // if (errors.length > 0) {
    //   const error = new Error("Invalid inputs.");
    //   error.data = errors;
    //   error.code = 401;
    //   throw error;
    // }
    const user = await WebUser.findById(req.userId).populate("hotelName");
    if (!user) {
      const error = new Error("No records found");
      error.code = 404;
      throw error;
    }
    if (webUserInput.fullName !== undefined) {
      user.fullName = webUserInput.fullName;
    }
    if (webUserInput.email !== undefined) {
      user.email = webUserInput.email;
    }
    if (webUserInput.userName !== undefined) {
      user.userName = webUserInput.userName;
    }
    if (webUserInput.userType !== undefined) {
      user.userType = webUserInput.userType;
    }
    if (webUserInput.citizenShip !== undefined) {
      user.citizenShip = webUserInput.citizenShip;
    }
    if (webUserInput.birthCountry !== undefined) {
      user.birthCountry = webUserInput.birthCountry
    }
    if (webUserInput.DOB !== undefined) {
      user.DOB = webUserInput.DOB;
    }
    if (webUserInput.identityDoc !== undefined) {
      user.identityDoc = webUserInput.identityDoc;
    }
    if (webUserInput.identity!== undefined) {
      user.identity = webUserInput.identity;
    } 
    if (webUserInput.expiryDate !== undefined) {
      user.expiryDate = webUserInput.expiryDate;
    }
    if (webUserInput.issueCountry !== undefined) {
      user.issueCountry = webUserInput.issueCountry;
    }
    if (webUserInput.phoneNumber !== undefined) {
      user.phoneNumber = webUserInput.phoneNumber;
    } 
    if (webUserInput.address !== undefined) {
      user.address = {
        country: webUserInput.address.country,
        postalCode: webUserInput.address.postalCode,
        region: webUserInput.address.region,
        city: webUserInput.address.city,
        address1: webUserInput.address.address1,
        address2: webUserInput.address.address2,
      };
    }
   
    const updatedUser = await user.save();

    return { ...updatedUser._doc, _id: updatedUser._id.toString() };
  },
  //Resolver endpoint for creating cashier user/ adding users to the database.
  //Used by the Hotel admin to add users into the system.
  createCashierUser: async function ({ webUserInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const errors = [];
    // if (validator.isEmpty(webUserInput.fullName)) {errors.push({ message: "Please enter a valid name." });}
    // if (validator.isEmail(webUserInput.email)) {errors.push({ message: "Please enter a valid email address." });}
    // if (validator.isEmpty(webUserInput.userName)) {errors.push({ message: "Please enter a valid username." });}
    // if (validator.isEmpty(webUserInput.userType)) {errors.push({ message: "Please select account user type." });}
    // if (validator.isEmpty(webUserInput.citizenShip)) {errors.push({ message: "Please select citizenship country." });}
    // // if (validator.isEmpty(webUserInput.birthCountry)) {errors.push({ message: "Please select country of birth." });}
    // // if (validator.isEmpty(webUserInput.DOB)) {errors.push({ message: "Please enter a valid date of birth." });}
    // // if (validator.isEmpty(webUserInput.identityDoc)) {errors.push({ message: "Please select a valid identity." });}
    // // if (validator.isEmpty(webUserInput.identity)) {errors.push({ message: "Please enter a valid identity." });}
    // // if (validator.isEmpty(webUserInput.expiryDate)) {errors.push({ message: "Please enter a valid date of expiry." });}
    // // if (validator.isEmpty(webUserInput.issueCountry)) {errors.push({ message: "Please select a valid country of issue." });}
    // if (validator.isEmpty(webUserInput.phoneNumber)) {errors.push({ message: "Please enter a valid phone number." });}
    // if (errors.length > 0) {
    //   const error = new Error("Invalid inputs.");
    //   error.data = errors;
    //   error.code = 401;
    //   throw error;
    // }
    const existingUser = await WebUser.findOne({ email: webUserInput.email });
    if (existingUser) {
      const error = new Error("This email address is already in use.");
      throw error;
    }
    const hotel = await Hotel.findOne({ creator: req.userId })
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
      const error = new Error("Kindly login.");
      error.code = 403;
      throw error;
    }
    const user = await WebUser.findById(req.userId).populate("hotelName");
    if (!user) {
      const error = new Error("Invalid user.");
      error.code = 404;
      throw error;
    }
    const hashedPw = await bcrypt.hash(webUserInput.password, 12);
    const cashierUser = new WebUser({
      email: webUserInput.email,
      fullName: webUserInput.fullName,
      password: hashedPw,
      userType: webUserInput.userType,
      userName: webUserInput.userName,
      phoneNumber: webUserInput.phoneNumber,
      hotelName: hotel,
    });
    const createdCashier = await cashierUser.save();
    // io.getIO().emit("users", {
    //   action: "createUser",
    //   createdCashier: {
    //     ...createdCashier._doc,
    //     _id: createdCashier._id.toString(),
    //   },
    // });
    return {
      ...createdCashier._doc,
      _id: createdCashier._id.toString(),
    };
  },
  //Resolver endpoint for updating web users
  //Used by the hotel admin to update the basic records of the users.
  updateCashierUser: async function ({ id, webUserInput }, req) {
    if (!req.isAuth) {
      const error = new Error(
        "Unauthorized access. Kindly contact system adminstrator"
      );
      error.code = 402;
      throw error;
    }
    const cashier = await WebUser.findById(id).populate("hotelName");
    if (!cashier) {
      const error = new Error("No records found");
      error.code = 404;
      throw error;
    }
    if (webUserInput.fullName !== undefined) {
      cashier.fullName = webUserInput.fullName;
    }
    if (webUserInput.email !== undefined) {
      cashier.email = webUserInput.email;
    }
    if (webUserInput.citizenShip !== undefined) {
      cashier.citizenShip = webUserInput.citizenShip;
    }
    if (webUserInput.birthCountry !== undefined) {
      cashier.birthCountry = webUserInput.birthCountry
    }
    if (webUserInput.DOB !== undefined) {
      cashier.DOB = webUserInput.DOB;
    }
    if (webUserInput.identityDoc !== undefined) {
      cashier.identityDoc = webUserInput.identityDoc;
    }
    if (webUserInput.identity!== undefined) {
      cashier.identity = webUserInput.identity;
    } 
    if (webUserInput.expiryDate !== undefined) {
      cashier.expiryDate = webUserInput.expiryDate;
    }
    if (webUserInput.issueCountry !== undefined) {
      cashier.issueCountry = webUserInput.issueCountry;
    }
    if (webUserInput.phoneNumber !== undefined) {
      cashier.phoneNumber = webUserInput.phoneNumber;
    } 
    if (webUserInput.address !== undefined) {
      cashier.address = {
        country: webUserInput.address.country,
        postalCode: webUserInput.address.postalCode,
        region: webUserInput.address.region,
        city: webUserInput.address.city,
        address1: webUserInput.address.address1,
        address2: webUserInput.address.address2,
      };
    }
    const updatedCashier = await cashier.save();
    // io.getIO().emit("users", {
    //   action: "updateUser",
    //   updatedCashier: {
    //     ...updatedCashier._doc,
    //     _id: updatedCashier._id.toString(),
    //   },
    // });
    return { ...updatedCashier._doc, _id: updatedCashier._id.toString() };
  },
  //Resolver endpoint for deleting hotel user from the system.
  deleteCashierUser: async function ({ id }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const user = await WebUser.findById(id).populate("hotelName");
    if (!user) {
      const error = new Error("Something is wrong try again!");
      error.code = 404;
      throw error;
    }
    if (user.userType !== "Master Admin") {
      const error = new Error("Unauthorized access");
      error.code = 404;
      throw error;
    }
    if (user.userType == "Master Admin") {
      const error = new Error(`Master Admin account can't be deleted`);
      error.code = 404;
      throw error;
    }
    await WebUser.findByIdAndDelete(id);
    io.getIO().emit("users", {
      action: "deleteUser",
      deleteCashier: true,
    });
    return true;
  },
  //Resolver endpoint for creating mobile users/ adding users to the database
  //Used by mobile application to create an account
  createUser: async function ({ userInput }, req) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "Please enter a valid email address." });
    }
    if (
      //password must be at least 8 chars long
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 8 })
    ) {
      errors.push({ message: "Please enter a valid password" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid inputs.");
      error.data = errors;
      error.code = 401;
      throw error;
    }
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error("This email address is already in use.");
      throw error;
    }
    const OTP = otpGenerator.generate(4, {
      bold: true,
      upperCase: false,
      specialChars: false,
      alphabets: false,
      specialChar: false,
    });
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      fullName: userInput.fullName,
      password: hashedPw,
      isVerified: false,
      verificationToken: OTP,
      verificationTokenExpiryDate: Date.now() + 3600000,
    });
    const createdUser = await user.save();
    transporter.sendMail({
      to: user.email,
      from: "zaamtechnologies@gmail.com",
      subject: "Verify your new Smart Hotel account",
       html: otpEmail({
        OTP
      })
    });
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  //Resolver endpoint for updating user account
  //Used by the mobile application to update or edit users records
  updateUser: async function ({ id, userInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Please login to edit your account.');
    //   error.code = 402;
    //   throw error;
    // }
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
    if (userInput.fullName !== undefined) {
      user.fullName = userInput.fullName;
    }
    if (userInput.email !== undefined) {
      user.email = userInput.email;
    }
    if (userInput.userName !== undefined) {
      user.userName = userInput.userName;
    }
    if (userInput.gender !== undefined) {
      user.gender = userInput.gender;
    }
    if (userInput.DOB !== undefined) {
      user.DOB = userInput.DOB;
    }
    if (userInput.identityDoc !== undefined) {
      user.identityDoc = userInput.identityDoc;
    }
    if (userInput.identity!== undefined) {
      user.identity = userInput.identity;
    } 
    if (userInput.expiryDate !== undefined) {
      user.expiryDate = userInput.expiryDate;
    }
    if (userInput.issueCountry !== undefined) {
      user.issueCountry = userInput.issueCountry;
    }
    if (userInput.phoneNumber !== undefined) {
      user.phoneNumber = userInput.phoneNumber;
    } 
    if (userInput.address !== undefined) {
      user.address = {
        country: userInput.Address.country,
        postalCode: userInput.Address.postalCode,
        region: userInput.Address.region,
        city: userInput.Address.city,
        address1: userInput.Address.address1,
        address2: userInput.Address.address2,
      };
    }

    const updatedUser = await user.save();
    io.getIO().emit("users", {
      action: "updatedUser",
      updatedUser: {
        ...updatedUser._doc,
        _id: updatedUser._id.toString(),
      },
    });
    return {
      ...updatedUser._doc,
      _id: updatedUser._id.toString(),
    };
  },
  //Resolver endpoint for creating Hotel
  //Used by the system admin to register hotel account into the system.
  createHotel: async function ({ id, hotelInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Please login to edit your account.');
    //   error.code = 402;
    //   throw error;
    // }
    const errors = [];
    //node --print "http.STATUS_CODES"
    const existingHotel = await Hotel.findOne({ creator: req.userId })
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
    if (existingHotel) {
      const error = new Error("Please proceede to hotel registration!");
      throw error;
    }
    const user = await WebUser.findById(req.userId);
    //const user = await WebUser.findById('5fe883bfc88aa42728ef37bc')
    if (!user) {
      const error = new Error(
        "Login please to continue with creating account."
      );
      error.code = 404;
      throw error;
    }
    const hotel = new Hotel({
      country: hotelInput.country,
      businessType: hotelInput.businessType,
      businessName: hotelInput.businessName,
      creator: user,
    });
    //db.createIndex({"location.loc" : "2dsphere"});
    const createdHotel = await hotel.save();
    user.hotelName = createdHotel;
    await user.save();
    return {
      ...createdHotel._doc,
      _id: createdHotel._id.toString(),
    };
  },
  //Resolver endpoint for adding business informatipon of a hotel
  //Used to add business information of a hotel inot the system
  addBusiness: async function ({ id, businessInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    //const errors = [];
    const user = await WebUser.findById(req.userId);
    if (!user) {
      const error = new Error("Invalid user.");
      error.code = 404;
      throw error;
    }
    const hotel = await Hotel.findOne({ creator: req.userId })
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
      error.code = 403;
      throw error;
    }
    const business = new BusinessDetail({
      regNo: businessInput.regNo,
      phoneNumber: businessInput.phoneNumber,
      address: {
        country: businessInput.address.country,
        postalCode: businessInput.address.postalCode,
        region: businessInput.address.region,
        city: businessInput.address.city,
        address1: businessInput.address.address1,
        address2: businessInput.address.address2,
      },
      pContact: {
        firstName: businessInput.pContact.firstName,
        secondName: businessInput.pContact.secondName,
        lastName: businessInput.pContact.lastName,
      },
      hotelName: hotel,
    });
    const createdBusiness = await business.save();
    hotel.businessInfo = createdBusiness;
    await hotel.save();
    return {
      ...createdBusiness._doc,
      _id: createdBusiness._id.toString(),
    };
  },
  //Resolver endpoint for updating business information of the hotel
  //Used by the system admin to update business infomation of the hotel
  updateBusiness: async function ({ id, businessInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const errors = [];
    if (validator.isEmpty(businessInput.regNo)) {
      errors.push({ 
        message: "Please enter a valid business registration number." });
      }
    if (validator.isEmpty(businessInput.phoneNumber)) {
      errors.push({ 
        message: "Please enter a valid phone number." });
      }
    if (errors.length > 0) {
      const error = new Error("Invalid inputs.");
      error.data = errors;
      error.code = 401;
      throw error;
    }
    const business = await BusinessDetail.findById(id);
    if (!business) {
      const error = new Error("Somethig is wrong try again!");
      error.code = 405;
      throw error;
    }
    const hotel = await Hotel.findOne({ creator: req.userId })
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
    if (hotel.creator._id.toString() !== req.userId) {
      const error = new Error("Unauthorized access");
      error.code = 404;
      throw error;
    }
    if (businessInput.regNo !== undefined) {
      business.regNo = businessInput.regNo;
    }
    if (businessInput.phoneNumber !== undefined) {
      business.phoneNumber = businessInput.phoneNumber;
    }
    business.address = {
      country: businessInput.address.country,
      postalCode: businessInput.address.postalCode,
      region: businessInput.address.region,
      city: businessInput.address.city,
      address1: businessInput.address.address1,
      address2: businessInput.address.address2,
    };
    business.pContact = {
      firstName: businessInput.pContact.firstName,
      secondName: businessInput.pContact.secondName,
      lastName: businessInput.pContact.lastName,
    };
    const updatedBusiness = await business.save();
    return {
      ...updatedBusiness._doc,
      _id: updatedBusiness._id.toString(),
    };
  },
  //Resolver endpoint for updating hotel information
  //Used by the system admin to add hotel infomation into the system during registration
  updateHotelInfo: async function ({ id, hotelInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
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
      const error = new Error("Somethig is wrong try again!");
      error.code = 403;
      throw error;
    }
    // if (hotel.creator._id.toString() !== req.userId.toString()) {
    //   const error = new Error('Unauthorized access');
    //   error.code = 404;
    //   throw error;
    // }
   
    if (hotelInput.hotelName !== undefined) {
      hotel.hotelName = hotelInput.hotelName;
    }
    if (hotelInput.address !== undefined) {
      hotel.address = hotelInput.address;
    }
    const updatedHotel = await hotel.save();
  
    return {
      ...updatedHotel._doc,
      _id: updatedHotel._id.toString(),
      createdAt: updatedHotel.createdAt.toISOString(),
      updatedAt: updatedHotel.updatedAt.toISOString(),
    };
  },
  updateHotel: async function ({ id, hotelInput }, req) {
     // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
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
      const error = new Error("Somethig is wrong try again!");
      error.code = 403;
      throw error;
    }
    // if (hotel.creator._id.toString() !== req.userId.toString()) {
    //   const error = new Error('Unauthorized access');
    //   error.code = 404;
    //   throw error;
    // }
    if (hotelInput.country !== undefined) {
      hotel.country = hotelInput.country;
    }
    if (hotelInput.businessType !== undefined) {
      hotel.businessType = hotelInput.businessType;
    }
    if (hotelInput.businessName !== undefined) {
      hotel.businessName = hotelInput.businessName;
    }
    if (hotelInput.hotelName !== undefined) {
      hotel.hotelName = hotelInput.hotelName;
    }
    if (hotelInput.homeDelivery !== undefined) {
      hotel.homeDelivery = hotelInput.homeDelivery;
    }
    if (hotelInput.logoUrl !== undefined) {
      hotel.logoUrl = hotelInput.logoUrl;
    }
    if (hotelInput.hotelEmail !== undefined) {
      hotel.hotelEmail = hotelInput.hotelEmail
    }
    if (hotelInput.hotelPhoneNumber !== undefined) {
      hotel.hotelPhoneNumber = hotelInput.hotelPhoneNumber;
    }
    if (hotelInput.hotelWebSite !== undefined) {
      hotel.hotelWebSite = hotelInput.hotelWebSite;
    }
    if (hotelInput.address !== undefined) {
      hotel.address = hotelInput.address;
    }
    const updatedHotel = await hotel.save();
    return {
      ...updatedHotel._doc,
      _id: updatedHotel._id.toString(),
      createdAt: updatedHotel.createdAt.toISOString(),
      updatedAt: updatedHotel.updatedAt.toISOString(),
    };
  },
  //Resolver endpoint for creating items category
  //used to add categories of food items into the system
  createCategory: async function ({ hotelId, categoryInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const errors = [];
    if (validator.isEmpty(categoryInput.categoryName)) {errors.push({ message: "Please enter a valid item category." });}
    if (validator.isEmpty(categoryInput.source)) {errors.push({ message: "Please enter a valid source of category." });}
    if (errors.length > 0) {
      const error = new Error("Invalid inputs.");
      error.data = errors;
      error.code = 401;
      throw error;
    }
    const hotel = await Hotel.findById(hotelId)
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
      const error = new Error("Something is wrong, try again .");
      error.code = 403;
      throw error;
    }
    const category = new Category({
      categoryName: categoryInput.categoryName,
      source: categoryInput.source,
      hotelName: hotel,
    });
    const createdCategory = await category.save();
    hotel.categories.push(createdCategory);
    await hotel.save();
    // io.getIO().emit("category", {
    //   action: "updatedCategory",
    //   createdCategory: {
    //     ...createdCategory._doc,
    //     _id: createdCategory._id.toString(),
    //   },
    // });
    return {
      ...createdCategory._doc,
      _id: createdCategory._id.toString(),
    };
  },
  updateCategory: async function ({ categoryId, categoryInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const category = await Category.findById(categoryId)
      .populate("products")
      .populate("hotelName");
    if (!category) {
      const error = new Error("Something is wrong try again!");
      error.code = 406;
      throw error;
    }
    //const errors = [];
    if (categoryInput.categoryName !== undefined) {
      category.categoryName = categoryInput.categoryName;
    }
    if (categoryInput.source !== undefined) {
      category.source = categoryInput.source;
    }
    const updatedCategory = await category.save();
    // io.getIO().emit("category", {
    //   action: "updatedCategory",
    //   updatedCategory: {
    //     ...updatedCategory._doc,
    //     _id: updatedCategory._id.toString(),
    //   },
    // });
    return {
      ...updatedCategory._doc,
      _id: updatedCategory._id.toString(),
    };
  },
  //Resolver endpoint to delete category of items in the hotel system
  //Used by the admin to delete categories of items in their hotels
  deleteCategory: async function ({ categoryId }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const category = await Category.findById(categoryId)
      .populate("products")
      .populate("hotelName");
    if (!category) {
      const error = new Error("No category found!");
      error.code = 406;
      throw error;
    }
    await Category.findByIdAndRemove(categoryId);
    //Find the category id  in the Hotel Object and delete too
    //const hotel = await Hotel.findById(categoryId);
    const hotel = await Hotel.findOne({ creator: req.userId });
     if (!hotel) {
      const error = new Error("Something is wrong try again!");
      error.code = 406;
      throw error;
    }
    hotel.categories.pull(categoryId);
    await hotel.save();
    
    //Find the category of the product in the Product Object and delete too
    const product = await Product.findById(categoryId);
    product.category.pull(categoryId);
    await product.save();
    return true;
  },
  //Resolver endpoint toa dd Items into the system
  //Used to add food items into the system togther with their categries
  addProduct: async function ({ categoryId, productInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    //const errors = [];
    const category = await Category.findById(categoryId)
      .populate("products")
      .populate("hotelName");
    if (!category) {
      const error = new Error("Something is wrong, try again .");
      error.code = 406;
      throw error;
    }
    const product = new Product({
      productName: productInput.productName,
      description: productInput.description,
      imageUrl: productInput.imageUrl,
      cost: productInput.cost,
      category: category,
    });
    const createdProduct = await product.save();
    category.products.push(createdProduct);
    await category.save();
    io.getIO().emit("product", {
      action: "createdProduct",
      createdProduct: {
        ...createdProduct._doc,
        _id: createdProduct._id.toString(),
      },
    });
    return {
      ...createdProduct._doc,
      _id: createdProduct._id.toString(),
    };
  },
  //Resolver endpoint for creating restaurant tables into the system.
  //Used to add tables number into the system
  createTable: async function ({ hotelId, tableInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const errors = [];
    if (validator.isEmpty(tableInput.tableName)) {errors.push({ message: "Please enter a valid table name." });}
    if (validator.isEmpty(tableInput.tableNumber)) {errors.push({ message: "Please enter a valid table number." });}
    if (validator.isEmpty(tableInput.forReservation)) {errors.push({ message: "Please select a valid input." });}
    if (validator.isEmpty(tableInput.tableType)) {errors.push({ message: "Please select table type." });}
    if (errors.length > 0) {
      const error = new Error("Invalid inputs.");
      error.data = errors;
      error.code = 401;
      throw error;
    }
    const hotel = await Hotel.findById(hotelId)
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
      const error = new Error("Something is wrong, try again .");
      error.code = 403;
      throw error;
    }
    const table = new Table({
      tableName: tableInput.tableName,
      tableNumber: tableInput.tableNumber,
      forReservation: tableInput.forReservation,
      tableType: tableInput.tableType,
      //qrCode : String
      hotelInfo: hotel,
    });
    const createdTable = await table.save();
    hotel.tables.push(createdTable);
    await hotel.save();
    // io.getIO().emit("table", {
    //   action: "createdTable",
    //   createdTable: {
    //     ...createdTable._doc,
    //     _id: createdTable._id.toString(),
    //   },
    // });
    return {
      ...createdTable._doc,
      _id: createdTable._id.toString(),
    };
  },
  updateTable: async function ({ tableId, tableInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
 
    const errors = [];
    if (validator.isEmpty(tableInput.tableName)) {errors.push({ message: "Please enter a valid table name." });}
    if (validator.isEmpty(tableInput.tableNumber)) {errors.push({ message: "Please enter a valid table number." });}
    if (validator.isEmpty(tableInput.forReservation)) {errors.push({ message: "Please select a valid input." });}
    if (validator.isEmpty(tableInput.tableType)) {errors.push({ message: "Please select table type." });}
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 401;
      throw error;
    }
    const tables = await Table.findById(tableId).populate("hotelInfo");
    if (!tables) {
      const error = new Error("Something is wrong try again!");
      error.code = 406;
      throw error;
    }
    if (tableInput.tableName !== undefined) {
      tables.tableName = tableInput.tableName;
    }
    if (tableInput.tableNumber !== undefined) {
      tables.tableNumber = tableInput.tableNumber;
    }
    if (tableInput.forReservation !== undefined){
      tables.forReservation = tableInput.forReservation;
    }
    if (tableInput.tableType !== undefined) {
      tables.tableType = tableInput.tableType;
    }
    const updatedTable = await tables.save();
    // io.getIO().emit("Tables", {
    //   action: "updatedTable",
    //   updatedTable: {
    //     ...updatedTable._doc,
    //     _id: updatedTable._id.toString(),
    //   },
    // });
    return {
      ...updatedTable._doc,
      _id: updatedTable._id.toString(),
    };
  },
  deleteTable: async function ({ tableId }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const table = await Table.findById(tableId).populate("hotelInfo");
    if (!table) {
      const error = new Error("Something is wrong try again!");
      error.code = 406;
      throw error;
    }
    const hotel = await Hotel.findOne({ creator: req.userId });
     if (!hotel) {
      const error = new Error("Something is wrong try again!");
      error.code = 406;
      throw error;
    }
    await Table.findByIdAndRemove(tableId);
    hotel.tables.pull(tableId);
    await hotel.save();
    return true;

  },
  //Resolver for updating product items in the hotel
  //used to update food items into the hotel.
  updateProduct: async function ({ productId, productInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const product = await Product.findById(productId)
      .populate("category")
      .populate({
        path: "category",
        populate: {
          path: "hotelName",
        },
      });
    if (!product) {
      const error = new Error("Something is wrong try again!");
      error.code = 406;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(productInput.productName) ||
      !validator.isLength(productInput.productName, { min: 3 })
    ) {
      errors.push({ message: "Invalid food Item." });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 401;
      throw error;
    }
    if (productInput.productName !== undefined) {
      product.productName = productInput.productName;
    }
    if (productInput.description !== undefined) {
      product.description = productInput.description;
    }
    if (productInput.imageUrl !== undefined) {
      product.imageUrl = productInput.imageUrl;
    }
    if (productInput.cost !== undefined) {
      product.cost = productInput.cost;
    }
    const updatedProduct = await product.save();
    io.getIO().emit("product", {
      action: "updatedProduct",
      updatedProduct: {
        ...updatedProduct._doc,
        _id: updatedProduct._id.toString(),
      },
    });
    return {
      ...updatedProduct._doc,
      _id: updatedProduct._id.toString(),
    };
  },
  //Resolver for for deleting food item.
  //Used by the system admin to delete food items from their system
  deleteProduct: async function ({ productId }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const product = await Product.findById(productId)
      .populate("category")
      .populate({
        path: "category",
        populate: {
          path: "hotelName",
        },
      });
    if (!product) {
      const error = new Error("No food items found");
      error.code = 406;
      throw error;
    }
    // if (product.creator.toString() !== req.userId.toString()) {
    //   const error = new Error("Unauthorized access");
    //   error.code = 403;
    //   throw error;
    // }
    clearImage(product.imageUrl);
    await Product.findByIdAndRemove(productId);
    const category = await Category.findById(productId);
    category.products.pull(productId);
    await category.save();
    return true;
  },
  //Resolver endpoint for creating order
  //Used bythe mobile application to post orders into the system.
  //Contains order details and the products
  createOrderProduct: async function ({ orderProductInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('To place the order kindly login.');
    //   error.code = 402;
    //   throw error;
    // }
    //const errors = [];
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Kindly log in.");
      error.code = 402;
      throw error;
    }
    const order = new OrderProduct({
      //hotel: HotelInfo,
      //product: [Product],
      quantity: orderProductInput.quantity,
      amount: orderProductInput.amount,
      comment: orderProductInput.comment,
    });
    const createdOrder = await order.save();
    //user.posts.push(createdPost);
    //await user.save();
    return {
      ...createdOrder._doc,
      _id: createdOrder._id.toString(),
    };
  },
  //Resolver endpoint for posting order details in the system
  //Used by the mobile application to post order details into the system
  createOrderDetail: async function ({ id, orderDetailInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('To place the order kindly login.');
    //   error.code = 402;
    //   throw error;
    // }
    //const errors = [];
    const user = await User.findById("5f89a2da6c6e4d00179d37c4");
    //const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Kindly log in.");
      error.code = 401;
      throw error;
    }
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
      const error = new Error("Something is wrong, try again");
      error.code = 405;
      throw error;
    }
    const now = new Date();
    const orderID = generateID({ length: 10, useLetters: false });
    const orderNo = await OrderDetail.findOne({ orderNumber: orderID });
    // if (orderNo) {orderID();
    // }
    const orderDetail = new OrderDetail({
      orderNumber: orderID,
      orderDate: date.format(now, "DD/MM/YYYY HH:mm:ss"),
      //Order: OrderProduct,
      totalAmount: orderDetailInput.totalAmount,
      paidDate: orderDetailInput.paidDate,
      comment: orderDetailInput.comment,
      hotelInfo: hotel,
      customer: user,
    });
    const createdOrderDetail = await orderDetail.save();
    hotel.orderDetail.push(createdOrderDetail);
    await hotel.save();
    user.orders.push(createdOrderDetail);
    await user.save();
    return {
      ...createdOrderDetail._doc,
      _id: createdOrderDetail._id.toString(),
    };
  },
  //Resolver endpoint for user login
  //Used by the mobile application to login user
  userLogin: async function ({ email, password }) {
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
    return {
      refreshToken: refreshToken,
      token: accessToken,
      userId: user._id.toString(),
    };
  },
  //Resolver endpoint for user login
  //Used by the web application to login hotel users
  webLogin: async function ({ email, password }, req) {
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
    const webUser = await WebUser.findOne({ email: email });
    if (!webUser) {
      const error = new Error("Please provide a valid email addrerss.");
      error.code = 402;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, webUser.password);
    if (!isEqual) {
      const error = new Error("Please provide a valid passord.");
      error.code = 402;
      throw error;
    }
    if (webUser.isVerified !== true) {
      const error = new Error("Account verification required");
      error.code = 401;
      throw error;
    }
    
    const accessToken = jwt.sign(
      {
        userId: webUser._id.toString(),
        email: webUser.email,
      },
      "amjustsomewheretyingtomakemistakeslifeisfullofstruggles",
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      {
        userId: webUser._id.toString(),
        email: webUser.email,
      },
      "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",
      { expiresIn: "1d" }
    );
    await new Token({
      token: refreshToken,
      user_id: webUser._id.toString(),
    }).save();
    return {
      refreshToken: refreshToken,
      token: accessToken,
      userId: webUser._id.toString(),
    }
  
  },
  //Resolver endpoint for quering categories
  //Used by both the web application and the mobile application to query categories depending on the condition
  categories: async function ({ hotelId }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const hotel = await Hotel.findById(hotelId);
    const category = await Category.find({ hotelName: hotel })
      .populate("products")
      .populate("hotelName");
    if (!category) {
      const error = new Error("No food Items found!");
      error.code = 406;
      throw error;
    }
    return {
      categories: category.map((p) => {
        return { ...p._doc, _id: p._id.toString() };
      }),
    };
  },
  //Resolver endpoint for quering categories
  //Used by both the web application and the mobile application to query categories depending on the condition
  allCategories: async function (args, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const category = await Category.find()
      .populate("products")
      .populate("hotelName");
    if (!category) {
      const error = new Error("No food Items found!");
      error.code = 406;
      throw error;
    }
    return {
      categories: category.map((p) => {
        return { ...p._doc, _id: p._id.toString() };
      }),
    };
  },
  //Resolver endpoint for accessing a single category
  //Used on both web application and mobile application
  category: async function ({ categoryId }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const category = await Category.findById(categoryId)
      .populate("products")
      .populate("hotelName");
    if (!category) {
      const error = new Error("No food categories found!");
      error.code = 406;
      throw error;
    }
    return {
      ...category._doc,
      _id: category._id.toString(),
    };
  },
  //Resolver endpoint for accessing a single product
  //Used on both web application and mobile application
  product: async function ({ productId }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
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
    return {
      ...product._doc,
      _id: product._id.toString(),
    };
  },
  //Resolver endpoint for quering categories
  //Used by both the web application and the mobile application to query categories depending on the condition
  products: async function ({ hotelId }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const hotel = await Hotel.findById(hotelId);
    const category = await Category.find({ hotelName: hotel }).populate(
      "hotelName"
    );
    const products = await Product.find({ category: category })
      //const products = await Product.find()
      .populate("category")
      .populate({
        path: "category",
        populate: {
          path: "hotelName",
        },
      });
    return {
      products: products.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
        };
      }),
    };
  },
  //Resolver endpoint for quering categories
  //Used by both the web application and the mobile application to query categories depending on the condition
  allProducts: async function ({ id }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const products = await Product.find()
      .populate("category")
      .populate({
        path: "category",
        populate: {
          path: "hotelName",
        },
      });
    return {
      products: products.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
        };
      }),
    };
  },
  //Resolver endpoint for quering orders
  //Used by both the web application and the mobile application to query categories depending on the condition
  orders: async function (args, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const orders = await OrderDetail.find().populate("category");
    return {
      orders: orders.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
        };
      }),
    };
  },
  //Resolver endpoint for queries user details
  //Used by the mobile application to view their profile
  user: async function (args, req) {
    // if (!req.isAuth) {
    //   const error = new Error('To view your profile kindly login.');
    //   error.code = 402;
    //   throw error;
    // }
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
    return {
      ...user._doc,
      _id: user._id.toString(),
    };
  },
  //Resolver endpoint for queries user details
  //Used by the web application to view their profile
  webUser: async function (args, req) {
    // if (!req.isAuth) {
    //   const error = new Error('To view your profile kindly login.');
    //   error.code = 402;
    //   throw error;
    // }
    const user = await WebUser.findById(req.userId).populate("hotelName");
    if (!user) {
      const error = new Error("No user found!");
      error.code = 404;
      throw error;
    }
    return {
      ...user._doc,
      _id: user._id.toString(),
    };
  },
  //Resolver endpoint to access hotel users
  //Used by the admin to query all the users of the hotels
  webUsers: async function ({ hotelId }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const hotel = await Hotel.findById(hotelId);
    const users = await WebUser.find({ hotelName: hotel }).populate(
      "hotelName"
    );
    //const users = await WebUser.findById().populate('hotelName');
    return {
      webUsers: users.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
        };
      }),
    };
  },
  //Resolver endpoint to access hotel users
  //Used by the admin to query all the users of the hotels
  allWebUsers: async function (args, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const users = await WebUser.find().populate("hotelName");
    return {
      webUsers: users.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
        };
      }),
    };
  },
  //Resolver endpoint for querying hotel details
  //Used on both the web application and mobile application depending on the condition
  hotel: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error('Unauthorized access.');
      error.code = 402;
      throw error;
    }
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
    return {
      ...hotel._doc,
      _id: hotel._id.toString(),
    };
  },
  //Resolver endpoint for querying hotel details
  //Used by the hotel admin during registration
  hotelDetails: async function (args, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const hotel = await Hotel.findOne({ creator: req.userId })
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
    return {
      ...hotel._doc,
      _id: hotel._id.toString(),
    };
  },
  //Resolver endpoint for query all htel in the system
  //Used on both the web application and mobile application depending on the condition
  hotels: async function ({ id }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
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
    return {
      hotels: hotel.map((h) => {
        return {
          ...h._doc,
          _id: h._id.toString(),
        };
      }),
    };
  },
  nearyByHotels: async function ({ id }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
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
    return {
      hotels: hotel.map((h) => {
        return {
          ...h._doc,
          _id: h._id.toString(),
        };
      }),
    };
  },
  //Resolver endpoint for query all htel in the system
  //Used on both the web application and mobile application depending on the condition
  allHotels: async function ({ id }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
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
    return {
      hotels: hotel.map((h) => {
        return {
          ...h._doc,
          _id: h._id.toString(),
        };
      }),
    };
  },
  //Resolver endpoint for querying tables of a hotel
  //Used on both the web application and mobile application depending on the condition
  tables: async function ({ hotelId }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const hotel = await Hotel.findById(hotelId);
    const table = await Table.find({ hotelInfo: hotel }).populate("hotelInfo");
    if (!table) {
      const error = new Error("Something is wrong try again!");
      error.code = 404;
      throw error;
    }
    return {
      tables: table.map((t) => {
        return {
          ...t._doc,
          _id: t._id.toString(),
        };
      }),
    };
  },
  //Resolver endpoint for querying a single table of a hotel
  //Used on both the web application and mobile application depending on the condition
  table: async function ({ tableId }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const table = await Table.findById(tableId).populate("hotelInfo");
    if (!table) {
      const error = new Error("No records found!");
      error.code = 404;
      throw error;
    }
    return {
      ...table._doc,
      _id: table._id.toString(),
    };
  },
  //Resolver endpoint for user account verification
  //Used by the web application to verify the user
  webUserVerification: async function ({ verificationToken }, req, res, next) {
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
    const webUser = await WebUser.findOne({
      verificationToken: verificationToken,
      verificationTokenExpiryDate: { $gte: Date.now() },
    });
    if (!webUser) {
      const error = new Error("Invalid OTP. Please check your code and try again.");
      error.code = 406;
      throw error;
    }
    webUser.isVerified = true;
    webUser.verificationToken = undefined;
    webUser.verificationTokenExpiryDate = undefined;

    const password = await webUser.save();
    transporter.sendMail({
      to: webUser.email,
      from: "zaamtechnologies@gmail.com",
      subject: "Welcome to Smart Hotel",
       html: welcomeEmail({
         fullName: webUser.fullName
      })
    });
    const accessToken = jwt.sign(
      {
        userId: webUser._id.toString(),
        email: webUser.email,
      },
      "amjustsomewheretyingtomakemistakeslifeisfullofstruggles",
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      {
        userId: webUser._id.toString(),
        email: webUser.email,
      },
      "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",
      { expiresIn: "1d" }
    );
    await new Token({
      token: refreshToken,
      user_id: webUser._id.toString(),
    }).save();
    return {
      refreshToken: refreshToken,
      token: accessToken,
      userId: webUser._id.toString(),
    };
  },
  //Resolver endpoint for user account verification
  //Used by the mobile application to verify the user
  userVerification: async function ({ verificationToken }, req) {
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
    return {
      refreshToken: refreshToken,
      token: accessToken,
      userId: user._id.toString(),
    };
  },
  webUserPasswordResetCode: async function ({email}, req){
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
    const OTP = otpGenerator.generate(6, {
      bold: true,
      upperCase: false,
      specialChars: false,
      alphabets: false,
      specialChar: false,
    });
    const webUser = await WebUser.findOne({ email: email });
    if (!webUser) {
      const error = new Error("Invalid Email. Please check your email and try again.");
      error.code = 401;
      throw error;
    }
    webUser.resetToken = OTP;
    webUser.resetTokenExpirationDate = Date.now() + 3600000;
    const passwordResetCode = await webUser.save();
    transporter.sendMail({
      to: webUser.email,
      from: "zaamtechnologies@gmail.com",
      subject: "Smart Hotel password assistance",
      html: resetPasswordCodeEmail({
        OTP
      })
    });
    return { 
      ...passwordResetCode._doc, 
      _id: passwordResetCode._id.toString()
    };
  },
  webUserResetTokenVerfication: async function ({resetToken}, req){
    const errors = [];
    if (
      //password must be at least 8 chars long
      validator.isEmpty(resetToken)) {
      errors.push({ message: "Please enter a valid One Time Password" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid inputs.");
      error.data = errors;
      error.code = 401;
      throw error;
    }
    const webUser = await WebUser.findOne({
      resetToken: resetToken,
      resetTokenExpirationDate: { $gt: Date.now() },
    });
    if (!webUser) {
      const error = new Error("Invalid OTP. Please check your code and try again.");
      error.code = 406;
      throw error;
    }
    webUser.resetToken = undefined;
    webUser.resetTokenExpirationDate = undefined;
    const resetTokenVerification = await webUser.save();

    return { 
      ...resetTokenVerification._doc, 
      _id: resetTokenVerification._id.toString() 
    };
  },
  webUserResendResetToken: async function ({id}, req){
    const OTP = otpGenerator.generate(6, {
      bold: true,
      upperCase: false,
      specialChars: false,
      alphabets: false,
      specialChar: false,
    });
    //const webUser = await WebUser.findById(id);
    const webUser = await WebUser.findById(req.userId);
    if (!webUser) {
      const error = new Error("Something went wrong. Please try again after sometime.");
      error.code = 401;
      throw error;
    }
    webUser.resetToken = OTP;
    webUser.resetTokenExpirationDate = Date.now() + 3600000;
    const resetToken = await webUser.save();
    transporter.sendMail({
      to: webUser.email,
      from: "zaamtechnologies@gmail.com",
      subject: "Smart Hotel password assistance",
      html: resetPasswordCodeEmail({
        OTP
      })
    });
    return { 
      ...resetToken._doc, 
      _id: resetToken._id.toString()
    };

  },
  webUserResendVerificationToken: async function ({id}, req){
    const OTP = otpGenerator.generate(6, {
      bold: true,
      upperCase: false,
      specialChars: false,
      alphabets: false,
      specialChar: false,
    });
    const webUser = await WebUser.findById(req.userId);
    if (!webUser) {
      const error = new Error("Something went wrong. Please try again after sometime.");
      error.code = 401;
      throw error;
    }
    webUser.isVerified = false;
    webUser.verificationToken = OTP;
    webUser.verificationExpirationDate = Date.now() + 3600000;
    const verificationToken = await webUser.save();
    transporter.sendMail({
      to: webUser.email,
      from: "zaamtechnologies@gmail.com",
      subject: "Smart Hotel password assistance",
      html: resetPasswordCodeEmail({
        OTP
      })
    });
    return { 
      ...verificationToken._doc, 
      _id: verificationToken._id.toString()
    };
  },
  webUserSetNewPassword: async function ({id, password}, req){
    const errors = [];
    if (
      //password must be at least 8 chars long
      validator.isEmpty(password) ||
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
    const webUser = await WebUser.findById(id);
    //const webUser = await WebUser.findById(req.userId);
    if (!webUser) {
      const error = new Error("Something went wrong. Please try again after sometime.");
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, webUser.password);
    if (isEqual) {
      const error = new Error("New password can't be the same as old password.");
      error.code = 402;
      throw error;
    }
    const hashedPw = await bcrypt.hash(password, 12);
    webUser.password = hashedPw;
    webUser.resetToken = undefined;
    webUser.resetTokenExpirationDate = undefined;

    const newPassword = await webUser.save();
    return { 
      ...newPassword._doc,
      _id: newPassword._id.toString()
    };
   
  },
  userPasswordResetCode: async function ({email}, req){
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
    const password = await user.save();
    transporter.sendMail({
      to: user.email,
      from: "zaamtechnologies@gmail.com",
      subject: "Smart Hotel password assistance",
      html: resetPasswordCodeEmail({
        OTP
      })
    });
    return { 
      ...password._doc, 
      _id: password._id.toString()
    };
  },
  userResetTokenVerfication: async function ({resetToken}, req){
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


    return { 
      ...resetTokenVerification._doc, 
      _id: resetTokenVerification._id.toString() 
    };
  },
  userResendResetToken: async function ({id}, req){
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
    return { 
      ...resetToken._doc, 
      _id: resetToken._id.toString()
    };

  },
  userResendVerificationToken: async function ({id}, req){
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
    return { 
      ...verificationToken._doc, 
      _id: verificationToken._id.toString()
    };
  },
  userSetNewPassword: async function ({id, password}, req){
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
    return { 
      ...newPassword._doc,
      _id: newPassword._id.toString()
    };
   
  },
  //Resolver endpoint for refreshing the token
  //Used on both web and mobile application
  refreshToken: async function ({ refreshToken }, req) {
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
    return {
      token: accessToken,
      userId: token.user_id.toString(),
      refreshToken: token.refreshToken
    };
  },
  //Resolver endpoint for user account logout
  //Used on both web and mobile application
  logout: async function ({ refreshToken }, req) {
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
  },
  createDevice: async function ({ hotelId, deviceInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    //const errors = [];
    // if (validator.isEmpty(tableInput.tableName)) {errors.push({ message: "Please enter a valid table name." });}
    // if (validator.isEmpty(tableInput.tableNumber)) {errors.push({ message: "Please enter a valid table number." });}
    // if (validator.isEmpty(tableInput.forReservation)) {errors.push({ message: "Please select a valid input." });}
    // if (validator.isEmpty(tableInput.tableType)) {errors.push({ message: "Please select table type." });}
    // if (errors.length > 0) {
    //   const error = new Error("Invalid inputs.");
    //   error.data = errors;
    //   error.code = 401;
    //   throw error;
    // }
    const hotel = await Hotel.findById(hotelId)
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
      const error = new Error("Something is wrong, try again .");
      error.code = 403;
      throw error;
    }
    const device = new Device({
      workStation: deviceInput.workStation,
      printerName: deviceInput.printerName,
      printerDocument: deviceInput.printerDocument,
      printStation: deviceInput.printStation,
      printerStatus: deviceInput.printerStatus,
      printPriveiwe: deviceInput.printPriveiwe,
      copies: deviceInput.copies,
      hotelName: hotel,
    });
    const createdDevice = await device.save();
    hotel.devices.push(createdDevice);
    await hotel.save();
    return {
      ...createdDevice._doc,
      _id: createdDevice._id.toString(),
    };
  },
  updateDevice: async function ({ deviceId, deviceInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
 
    // const errors = [];
    // if (validator.isEmpty(tableInput.tableName)) {errors.push({ message: "Please enter a valid table name." });}
    // if (validator.isEmpty(tableInput.tableNumber)) {errors.push({ message: "Please enter a valid table number." });}
    // if (validator.isEmpty(tableInput.forReservation)) {errors.push({ message: "Please select a valid input." });}
    // if (validator.isEmpty(tableInput.tableType)) {errors.push({ message: "Please select table type." });}
    // if (errors.length > 0) {
    //   const error = new Error("Invalid input.");
    //   error.data = errors;
    //   error.code = 401;
    //   throw error;
    // }
    const device = await Table.findById(deviceId).populate("hotelName");
    if (!device) {
      const error = new Error("Something is wrong try again!");
      error.code = 406;
      throw error;
    }
    device.workStation = deviceInput.workStation;
    device.printerName = deviceInput.printerName;
    device.printerDocument = deviceInput.printerDocument;
    device.printStation = deviceInput.printStation;
    device.printerStatus = deviceInput.printerStatus;
    device.printPriveiwe = deviceInput.printPriveiwe;
    device.copies = deviceInput.copies;
    const updatedDevice = await device.save();
    return {
      ...updatedDevice._doc,
      _id: updatedDevice._id.toString(),
    };
  },
  deleteDevice: async function ({ deviceId }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Unauthorized access.');
    //   error.code = 402;
    //   throw error;
    // }
    const device = await Device.findById(deviceId).populate("hotelName");
    if (!device) {
      const error = new Error("Something is wrong try again!");
      error.code = 406;
      throw error;
    }
    await Device.findByIdAndRemove(deviceId);
    const hotel = await Hotel.findById(deviceId);
    hotel.devices.pull(deviceId);
    await hotel.save();
    return true;
  },
  // post: async function ({ refreshToken }, req){
  //   const fileStr = req.body.refreshToken;
  //   const uploadResponse = await cloudinary.uploader.upload(fileStr, {
  //     upload_preset: 'dev_setups',
  //     use_filename: true
  //     unique_filename
  //   });
    // image : uploadResponse
//     "public_id": "4srvcynxrf5j87niqcx6w",
//   "version": 1340625837,
//   "signature": "01234567890abcdef01234567890abcdef012345",
//   "width": 200,
//   "height": 200,
//   "format": "jpg",
//   "resource_type": "image",
//   "url": "http://res.cloudinary.com/demo/image/upload/v1340625837/4srvcynxrf5j87niqcx6w.jpg",
//   "secure_url": "https://res.cloudinary.com/demo/image/upload/v1340625837/4srvcynxrf5j87niqcx6w.jpg"
// }
  //}
//   app.post('/api/upload', async (req, res) => {
//     try {
//         const fileStr = req.body.data;
//         const uploadResponse = await cloudinary.uploader.upload(fileStr, {
//             upload_preset: 'dev_setups',
//         });
//         console.log(uploadResponse);
//         res.json({ msg: 'yaya' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ err: 'Something went wrong' });
//     }
// });
};
