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
  } catch (parseError) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON format" }),
    };
  }

  let { phone, email, password } = body;

  // Ensure phone is in E.164 format
  if (phone && !phone.startsWith("+91")) {
    phone = "+91" + phone;
  }

  if (!email || !phone || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing phone, email, or password" }),
    };
  }

  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: phone, // Using phone as the username
    Password: password,
    UserAttributes: [
      { Name: "phone_number", Value: phone },
      { Name: "email", Value: email },
    ],
  };

  try {
    const response = await cognito.signUp(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Signup successful. Please confirm your phone/email.",
        userSub: response.UserSub,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Signup failed",
        details: error.message || error.code,
      }),
    };
  }
};
