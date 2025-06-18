const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { message, to } = JSON.parse(event.body);

        // Retrieve credentials from Netlify environment variables
        const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        const fromPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

        if (!accessToken || !fromPhoneNumberId) {
            throw new Error('WhatsApp credentials are not configured in environment variables.');
        }

        const url = `https://graph.facebook.com/v19.0/${fromPhoneNumberId}/messages`;

        const payload = {
            messaging_product: "whatsapp",
            to: to,
            type: "text",
            text: {
                preview_url: false,
                body: message
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const responseData = await response.json();

        if (!response.ok) {
            // If Meta's API returns an error, log it and return it.
            console.error('Error from Meta API:', responseData);
            return {
                statusCode: response.status,
                body: JSON.stringify({ success: false, error: responseData.error.message }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, data: responseData }),
        };

    } catch (error) {
        console.error('Error in Netlify function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message }),
        };
    }
};
