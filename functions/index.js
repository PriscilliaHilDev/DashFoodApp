
 const functions = require('firebase-functions');
 const admin = require('firebase-admin');
 admin.initializeApp();


exports.sms = functions.https.onCall((data, context) => {  
  
  // const payload = {
  //     notification: {
  //         title:data.titre,
  //         body:data.content
  //     }
  // }

  // const notif = admin.messaging().sendToDevice(data.token, payload);

    
  const payload = {
    notification: {
        title:"salut",
        body:'salut'
    }
}

let token = "ehVKTjsXRj2rnT94Wvj4OX:APA91bHzfbB1VTY6Xda57kA-WjR1zvtiLZxnkgDZT1J-j28UyKdf5nViSCuAeD66cV0vjlD5pM0AzFiTzRqBH7UsnLep_HVVSLP3jhM3P41EUZatztP0_Mh8Crlm_NYjz5P_smaK-bj1"

const notif = admin.messaging().sendToDevice(token, payload);

  return notif;
})