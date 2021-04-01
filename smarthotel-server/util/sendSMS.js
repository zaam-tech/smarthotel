const AfricasTalking = require('africastalking');

// TODO: Initialize Africa's Talking
const africastalking = AfricasTalking({
    apiKey: 'cb63313cb0bfee6d75d5dec32d4ecccfbe216afc7f469339777277c11a7db91e', 
    username: 'sandbox'
  });


module.exports = async function sendSMS() {
    
    // TODO: Send message
    try {
        const result=await africastalking.SMS.send({
          to: '+254715404275', 
          message: 'Hey AT Ninja! Wassup...',
          from: 'ZAAM TECH'
        });
        console.log(result);
      } catch(ex) {
        console.error(ex);
      } 

};