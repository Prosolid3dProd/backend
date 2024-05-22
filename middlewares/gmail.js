//const nodemailer = require("nodemailer");

//const InstancePrivate = require("../models/instancePrivate");

/* 
params:
        to: "developer.projas@gmail.com",
        subject: "Hello from gmail using API",
        text: "Hello from gmail email using API",
        html: "<h1>Hello from gmail email using API</h1>",
*/

/*
async function sendGmail(instanceId, params) {
  try {
    InstancePrivate.findOne({
      instanceId,
    }).exec((err, instance) => {
      const CLIENT_ID = instance.gmailClientId;
      const CLIENT_USER = instance.gmailUser;
      const CLIENT_SECRET = instance.gmailClientSecret;
      const REDIRECT_URI = instance.gmailRedirectUri;
      const REFRESH_TOKEN = instance.gmailRefreshToken;

      const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
      );

      params = {
        ...params,
        CLIENT_ID: instance.gmailClientId,
        CLIENT_SECRET: instance.gmailClientSecret,
        REDIRECT_URI: instance.gmailRedirectUri,
        REFRESH_TOKEN: instance.gmailRefreshToken,
        CLIENT_USER: instance.gmailUser,
        CLIENT_FROM: instance.gmailFrom,
      };

      oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
      sendMail(params, oAuth2Client);
    });
  } catch (error) {
    return error;
  }
}

async function sendMail(params, oAuth2Client) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: params.CLIENT_USER,
        clientId: params.CLIENT_ID,
        clientSecret: params.CLIENT_SECRET,
        refreshToken: params.REFRESH_TOKEN,
        accessToken: accessToken,
        from: `"${params.CLIENT_FROM}" <${params.CLIENT_USER}>`,
      },
    });

    const mailOptions = {
      ...params,
      from: `"${params.CLIENT_FROM}" <${params.CLIENT_USER}>`,
    };

    const result = await transport.sendMail(mailOptions);
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}
*/

/*
sendMail()
  .then((result) => console.log("Email sent...", result))
  .catch((error) => console.log(error.message));
*/

module.exports = {
  // sendGmail,
};
