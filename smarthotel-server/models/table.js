const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tableSchema = new Schema({
    tableName : {
        type : String,
        required: false
    },
    tableNumber: {
        type: String,
        required: true
    },
    forReservation: {
        type: Boolean,
        required: true
    },
    tableType: {
        type: String,
        required: false
    },
    qrCode : {
        type: String,
        required: false
    },
    hotelInfo: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel'
    }
},

  { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);