const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { startStation, endStation } = event; // Extract startStation and endStation from the event

    if (!startStation || !endStation) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Both startStation and endStation are required.' })
        };
    }

    const params = {
        TableName: 'fares',
        Key: {
            startStation: startStation,
            endStation: endStation
        }
    };

    try {
        // Get the fare details from DynamoDB
        const result = await dynamoDB.get(params).promise();
        
        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Fare not found for the given route.' })
            };
        }

        // Return the fare
        return {
            statusCode: 200,
            body: JSON.stringify({ fare: result.Item.fare })
        };

    } catch (error) {
        console.error('Error retrieving fare:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error.' })
        };
    }
};
