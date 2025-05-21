const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing request body" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON format" }),
    };
  }

  let { phone, code } = body;

  // Ensure phone is in E.164 format
  if (phone && !phone.startsWith("+91")) {
    phone = "+91" + phone;
  }

  if (!phone || !code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing phone or confirmation code" }),
    };
  }

  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: phone,
    ConfirmationCode: code,
  };

  try {
    await cognito.confirmSignUp(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User confirmed successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Confirmation failed",
        details: error.message || error.code,
      }),
    };
  }
};
