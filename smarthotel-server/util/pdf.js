const fs = require("fs");
const PDFDocument = require("pdfkit");
const generateHtml = ({
    fullName,
    email,
    userType,
    citizenShip,
    birthCountry,
    DOB,
    identityDoc,
    identity,
    expiryDate,
    issueCountry,
    phoneNumber,
    address,
    hotelName,
}) => {
    return function createInvoice(invoice, path) {
        let doc = new PDFDocument({ size: "A4", margin: 50 });
        generateHeader(doc);
        generateCustomerInformation(doc, invoice);
        generateInvoiceTable(doc, invoice);
        generateFooter(doc);
        doc.end();
        doc.pipe(fs.createWriteStream(path));
    }
};
module.exports =( generateHtml, "invoicee.pdf");
   
//   {
//     return `<!DOCTYPE html>
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>Pdf document</title>
//         <link
//           rel="stylesheet"
//           href="https:fonts.googleapis.com/css?family=Roboto:300,700,900;display=swap"
//           media="all"
//         />
//         <style>
//           body {
//             padding: 0;
//             margin: 0;
//             box-sizing: border-box;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             height: 100%;
//             width: 100%;
//           }
//           #app {
//             padding-top: 2em;
//             display: flex;
//             flex-direction: column;
//             justify-content: center;
//             align-items: center;
//             text-align: center;
//             font-family: Roboto !important;
//             height: 100%;
//             width: 100%;
//             border: 1px solid #333;
//           }
//           img {
//             width: 200px;
//             height: 200px;
//           }
//           .logo {
//             margin-bottom: 10px;
//             width: 150px;
//             height: 150px;
//           }
//           h1,
//           h2,
//           h3 {
//             text-transform: uppercase;
//             font-size: 17px;
//           }
//           .first{
//             text-transform: uppercase;
//             font-size: 17px;
//           }
//           .address {
//           font-family: Montserrat;
//           max-width: 350px;
//         }
//         .address h2 {
//           display: flex;
//           flex-direction: column;
//         }
//         .first {
//           font-family: Montserrat;
//         }
//           .info {
//             display: flex;
//             justify-content: center;
//             align-items: center;
//           }
//           .info p {
//             text-transform: uppercase;
//             padding-right: 10px;
//             margin-right: 10px;
//             border-right: 1px solid #555;
//           }
//           .info a {
//             margin-right: 10px;
//             padding-right: 10px;
//             border-right: 1px solid #555;
//           }
//           .info a:last-of-type {
//             margin-right: 0;
//             border: none;
//           }
//           footer {
//             border-top: 1.5px solid #111;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             width: 100%;
//           }
//           footer h3,h4 {
//             margin-left: 10px;
//             padding-right: 10px;
//             border-right: 1px solid #555;
//             font-size:1em;
//           }
//           footer h3:last-of-type {
//             text-transform: uppercase;
//             margin-left: 10px;
//             padding-right: 0;
//             border-right: none;
//           }
//         </style>
//       </head>
//       <body>
//         <div id="app">
//           <img src=${logo} alt="logo" class="logo"/>
//           <div class="address">
//             <h1>${hotelName}</h1>
//             <h2><span>${address1} - ${postalCode}  ${city}</span><span>${country}</span></h2>
//           </div>
//           <h3 class="first">Scan the code below for the menu</h3>
//           <img src="${qrcodeImage}" alt="image" class="qrcode" />
//           <div class="info">
//             <p>0889554646</p>
//             <a href="#">www.${businessName.toLowerCase()}.com</a>
//             <a href="mailto:james@${businessName.toLowerCase()}.com">james@${businessName.toLowerCase()}.com</a>
//           </div>
//           <footer>
//             <h4>Powered by Zaam technologies</h4>
//             <h4>SmartHotel</h4>
//             <h3>${businessName}</h3>
//           </footer>
//         </div>
//       </body>
//     </html>
//   `;
//   };
//   module.exports = generateHtml;
  