const AWS = require("aws-sdk");

const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { phone, password } = body;

  try {
    const response = await cognito.initiateAuth({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: phone,
        PASSWORD: password,
      },
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Login successful", tokens: response.AuthenticationResult }),
    };
  } catch (error) {
    console.error("Cognito login error:", error);
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Invalid phone or password" }),
    };
  }
};
