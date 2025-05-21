const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const params = {
    TableName: 'stations',
    ProjectionExpression: 'name' // Only retrieve the 'name' attribute
  };

  try {
    const data = await dynamodb.scan(params).promise();
    
    const stationNames = data.Items.map(item => item.name);

    return {
      statusCode: 200,
      body: JSON.stringify({
        stationNames: stationNames
      }),
    };
  } catch (err) {
    console.error('Error fetching station names:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch station names' }),
    };
  }
};
