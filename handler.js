// handler.js

"use strict";

const AWS = require("aws-sdk");
const SES = new AWS.SES();

function sendMail(formData, cb) {
  let emailParams = {};

  const {
    from,
    contact,
    addrOne,
    addrTwo,
    city,
    state,
    zip,
    tel,
    body
  } = formData;

  if (formData.zip) {
    emailParams = {
      Source: "aloha@farmily.ventures",
      ReplyToAddresses: [from],
      Destination: {
        ToAddresses: ["aloha@farmily.ventures"] // SES RECEIVING EMAIL
      },
      Message: {
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: `Contact: ${contact}\nEmail: ${from}\n\n ${addrOne}\n${addrTwo}
                  \n${city}\n${state}\n${zip}\n${phone}\n\n ${body}`
          }
        },
        Subject: {
          Charset: "UTF-8",
          Data: `SALE | [${contact}]`
        }
      }
    };
  } else {
    const { contact, from, subject, body } = formData;

    emailParams = {
      Source: "aloha@farmily.ventures",
      ReplyToAddresses: [from],
      Destination: {
        ToAddresses: ["aloha@farmily.ventures"] // SES RECEIVING EMAIL
      },
      Message: {
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: `Contact: ${contact}\nEmail: ${from}\n\n ${body}`
          }
        },
        Subject: {
          Charset: "UTF-8",
          Data: `INQUIRY | [${contact}] - ${subject}`
        }
      }
    };
  }

  SES.sendEmail(emailParams, cb);
}

module.exports.mail = (event, context, callback) => {
  const formData = JSON.parse(event.body);

  sendMail(formData, function(err, data) {
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://farmily.ventures"
      },
      body: JSON.stringify({
        message: err ? err.message : data
      })
    };

    callback(null, response);
  });
};
