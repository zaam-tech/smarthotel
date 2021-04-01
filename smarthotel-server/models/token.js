const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tokenSchema = new Schema({
  token: { 
      type: String
      //required: true
    },
  expires_at: { 
    type: String
    //required: true
  },
  last_used_at: { 
    type: String
    //required: true
  }, user_id : { 
    type: String
    //required: true
  },
  
},
  
{ timestamps: true });

module.exports = mongoose.model("Token", tokenSchema);
