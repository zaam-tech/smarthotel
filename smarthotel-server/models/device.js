const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    workStation: {
        type: String,
        required: true
    },
    printerName: {
        type: String,
        required: true
    },
    printerDocument: {
        type: String,
        required: true
    },
    printStation: {
        type: String,
        required: true
    },
    printerStatus: {
        type: String,
        required: true
    },
    printPriveiwe: {
        type: String,
        required: true
    },
    copies: {
        type: String,
        required: true
    },
    hotelName: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: false
    }
});
module.exports = mongoose.model('Device', deviceSchema);
