const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const { ticketId, fare, from, to } = body;

    if (!ticketId || !fare || !from || !to) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const params = {
      TableName: "Bookings",
      Item: {
        ticketId,
        fare,
        from,
        to,
        createdAt: new Date().toISOString(),
      },
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Booking added successfully", ticketId }),
    };
  } catch (error) {
    console.error("Error adding booking:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
