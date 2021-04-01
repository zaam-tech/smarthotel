const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const qrCodeSchema = new Schema({
    tableName : {
        type : String,
        required: false
    },
    tableNumber: {
        type: String,
        required: true
    },
    qrCode : {
        type: String,
        required: true
    },
    hotelInfo: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel'
    }
},
{ timestamps: true });
module.exports = mongoose.model('QRCode', qrCodeSchema);
