const path = require('path');
const cors = require('cors')
const express = require('express');
const multer = require('multer');
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//const connectDB = require('./config/db');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const routes = require('./routes/route');
const { createInvoice } = require("./usepdf");
const auth = require('./middleware/auth');
const { format } = require('path');

// load env vars
dotenv.config({ path: './config/.env' });

const s3 = new aws.S3({
	accessKeyId: 'AKIAXGS63AW3GXGFT34H',
	secretAccessKey: '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',
	Bucket: 'smarthotelassets'
});

const app = express();

//Single Upload
const profileImgUpload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'youbucketname',
		acl: 'public-read',
		key: function (req, file, cb) {
			cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
		}
	}),
	limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
	fileFilter: function( req, file, cb ){
		checkFileType( file, cb );
	}
});

//Check File Type
function checkFileType( file, cb ){
	// Allowed ext
	const filetypes = /jpeg|jpg|png|gif/;
	// Check ext
	const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
	// Check mime
	const mimetype = filetypes.test( file.mimetype );
	if( mimetype && extname ){
		return cb( null, true );
	} else {
		cb( 'Error: Images Only!' );
	}
}

//Multiple File Uploads ( max 4 )
const uploadsBusinessGallery = multer({
  storage: multerS3({
    s3: s3,
		bucket: 'orionnewbucket',
		acl: 'public-read',
		key: function (req, file, cb) {
			cb( null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
		}
	}),
	limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
	fileFilter: function( req, file, cb ){
		checkFileType( file, cb );
	}
});


app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(cors());

// //Local storage of files
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//app.use(multer({ storage: profileImgUpload, fileFilter: checkFileType }).single('image'));

//app.use(multer({ storage: uploadsBusinessGallery, fileFilter: checkFileType }).array('imageGalary', 4 ));

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

app.use("/images", express.static(path.join(__dirname, "images")));

//const filePath = path.join(__dirname, "../public");

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const router = express.Router();

app.use(auth);

module.exports = router;

app.use(routes);

app.use(
    '/graphql',
    graphqlHTTP({
      schema: graphqlSchema,
      rootValue: graphqlResolver,
      graphiql: true,
      customFormatErrorFn(err) {
        if (!err.originalError) {
          return err;
        }
        const data = err.originalError.data;
        const message = err.message || 'An error occurred.';
        const code = err.originalError.code || 500;
        return { message: message, status: code, data: data };
      }
    })
  );
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});
const port = 3000
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
// mongoose.connect(
//   `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.efeh5.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`, { 
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
//   }
//   )
//   .then(result => {
//     const server = app.listen(process.env.PORT || 3000);
//     const io = require('./socket').init(server);
//     io.on('connection', socket => {
//       console.log('Client connected');
//     });
//   })
//   .catch(err => console.log(err));
// mongoose.connect(
//   'mongodb://localhost:27017/smarthotell?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false ', { 
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
//   })
//   .then(result => {
//     const server = app.listen(process.env.PORT || 3000);.
//     const io = require('./socket').init(server);
//     io.on('connection', socket => {
//       console.log('Client connected');
//     });
//   })
//   .catch(err => console.log(err));


// const accountSid = 'ACe377a0198e05ef1e5914f9f33fd47962';
// const authToken = 'ce3f57da57f3efecbc5c337e82813f89';
// const client = require('twilio')(accountSid, authToken);
// client.calls
//   .create({
//     url: 'http://demo.twilio.com/docs/voice.xml',
//     to: '+25415404275',
//     from: '+15017250604',
//   })
//   .then(call => process.stdout.write(call.sid));
// const sendSMS = require('./middleware/sendSMS');
// sendSMS();

// const QRCode = require('qrcode');
// const session = require('express-session');
// const csrf = require('csurf');
// const flash = require('connect-flash');
// const helmet = require('helmet');
// const compression = require('compression');
// const morgan = require('morgan');



   
    // const express = require('express');
    // const { graphqlHTTP } = require('express-graphql');
    // const { buildSchema, execute, subscribe } = require('graphql');
    
    // // Pull in some specific Apollo packages:
    // const { PubSub } = require('graphql-subscriptions');
    // const { SubscriptionServer } = require('subscriptions-transport-ws');
    
    // // Create a server:
    // const app = express();
    
    // // Create a schema and a root resolver:
    // const schema = buildSchema(`
    //     type Book {
    //         title: String!
    //         author: String!
    //     }
    
    //     type Query {
    //         books: [Book]
    //     }
    
    //     type Subscription { # New: subscribe to all the latest books!
    //         newBooks: Book!
    //     }
    // `);
    
    // const pubsub = new PubSub();
    // const rootValue = {
    //     books: [
    //         {
    //             title: "The Name of the Wind",
    //             author: "Patrick Rothfuss",
    //         },
    //         {
    //             title: "The Wise Man's Fear",
    //             author: "Patrick Rothfuss",
    //         }
    //     ],
    //     newBooks: () => pubsub.asyncIterator("BOOKS_TOPIC")
    // };
    
    // // Handle incoming HTTP requests as before:
    // app.use(graphqlHTTP({
    //     schema,
    //     rootValue
    // }));
    
    // // Start the server:
    // const server = app.listen(8080, () => console.log("Server started on port 8080"));
    
    // // Handle incoming websocket subscriptions too:
    // SubscriptionServer.create({ schema, rootValue, execute, subscribe }, {
    //     server // Listens for 'upgrade' websocket events on the raw server
    // });
    
    // // ...some time later, push updates to subscribers:
    // pubsub.publish("BOOKS_TOPIC", {
    //     title: 'The Doors of Stone',
    //     author: 'Patrick Rothfuss',
    // });


    
// var printer = require('printer');
// var fs = require('fs');

// var info = fs.readFileSync('ticket.txt').toString();

// function sendPrint() {
//   printer.printDirect({
//     data: info,
//     type: 'RAW',
//     success: function (jobID) {
//       console.log("ID: " + jobID);
//     },
//     error: function (err) {
//       console.log('printer module error: '+err);
//       throw err;
//     }
//   });
// }

//sendPrint();
 // app.post(
  //   '/graphql',
  //   graphqlHTTP({
  //     schema: MyGraphQLSchema,
  //     graphiql: false,
  //   }),
  // );
  
  // app.get(
  //   '/graphql',
  //   graphqlHTTP({
  //     schema: MyGraphQLSchema,
  //     graphiql: true,
  //   }),
  // );
//  var upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'some-bucket',
//     metadata: function (req, file, cb) {
//       cb(null, {fieldName: file.fieldname});
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString())
//     }
//   })
// })
 
// app.post('/upload', upload.array('photos', 3), function(req, res, next) {
//   res.send('Successfully uploaded ' + req.files.length + ' files!')
// })
