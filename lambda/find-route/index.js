const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { startStation, startLine, endStation, endLine } = event;

    // Define the table name (change this to your actual table name)
    const tableName = 'Stations';

    try {
        // Step 1: Fetch stations on startLine where the connected line is endLine (startEnd)
        const startEndParams = {
            TableName: tableName,
            KeyConditionExpression: 'line_name = :startLine AND connected_lines = :endLine',
            ExpressionAttributeValues: {
                ':startLine': startLine,
                ':endLine': endLine
            }
        };
        
        const startEndResult = await dynamodb.query(startEndParams).promise();
        
        // If no stations match the condition, return a message
        if (startEndResult.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'No matching stations found for the start and end lines'
                })
            };
        }

        // Step 2: Fetch stations on endLine where the connected line is startLine (endStart)
        const endStartParams = {
            TableName: tableName,
            KeyConditionExpression: 'line_name = :endLine AND connected_lines = :startLine',
            ExpressionAttributeValues: {
                ':endLine': endLine,
                ':startLine': startLine
            }
        };

        const endStartResult = await dynamodb.query(endStartParams).promise();
        
        // If no stations match the condition, return a message
        if (endStartResult.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'No matching stations found for the end and start lines'
                })
            };
        }

        // Step 3: Return the results (startEnd and endStart stations)
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Found matching stations!',
                startEndStations: startEndResult.Items,
                endStartStations: endStartResult.Items
            }),
        };

    } catch (error) {
        console.error("Error occurred:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error occurred while fetching connected stations',
                error: error.message,
            }),
        };
    }
};
