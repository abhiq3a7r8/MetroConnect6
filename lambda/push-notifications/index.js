// Import the AWS SDK
const AWS = require('aws-sdk');

// Initialize the SNS service
const sns = new AWS.SNS();

// Lambda handler function
exports.handler = async (event) => {
    // Extract title, body, and target ARN from the event object
    const { title, body, targetArn } = event;

    // Check if the parameters are provided
    if (!title || !body || !targetArn) {
        console.log("❌ Missing parameters: title, body, or targetArn.");
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing parameters: title, body, or targetArn." }),
        };
    }

    // Construct the message
    const message = {
        default: body,
        APNS: JSON.stringify({
            aps: {
                alert: {
                    title: title,
                    body: body,
                },
                sound: 'default',
            }
        }),
        APNS_SANDBOX: JSON.stringify({
            aps: {
                alert: {
                    title: title,
                    body: body,
                },
                sound: 'default',
            }
        }),
    };

    // Define the parameters for the SNS publish
    const params = {
        Message: JSON.stringify(message),  // The message body
        MessageStructure: 'json',  // Use the JSON message structure for different platforms
        TargetArn: targetArn,  // The endpoint ARN of the device (for push notifications)
    };

    // Send the message using SNS
    try {
        const result = await sns.publish(params).promise();
        console.log('✅ Notification sent successfully:', result);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Notification sent successfully', result: result }),
        };
    } catch (error) {
        console.error('❌ Error sending notification:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error sending notification', error: error.message }),
        };
    }
};
