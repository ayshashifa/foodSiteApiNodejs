const accountSid = 'AC43da21a96b3fc1c0e6d5c8647598997e';
const authToken = '[AuthToken]';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'hye it aysha',
        from: '+14327413273',
        to: '+18777804236'
    })
    .then(message => console.log(message.sid))
    .done();

    TWILIO_PHONE_NUMBER=14327413273
    TWILIO_ACCOUNT_SID=AC43da21a96b3fc1c0e6d5c8647598997e
    TWILIO_AUTH_TOKEN='[AuthToken]' 
    













//     400 - BAD REQUEST - The data given in the POST or PUT failed validation. Inspect the response body for details.
// {
//   "code": 21408,
//   "message": "Permission to send an SMS has not been enabled for the region indicated by the 'To' number: +1877780XXXX",
//   "more_info": "https://www.twilio.com/docs/errors/21408",
//   "status": 400
// }


