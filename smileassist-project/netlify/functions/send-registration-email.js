const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { phoneNumber, serialNumber } = JSON.parse(event.body);

        // Configure the email transporter using environment variables
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER, // Your email address from Netlify's settings
                pass: process.env.EMAIL_PASS, // Your email password from Netlify's settings
            },
        });

        // Define the email content
        const mailOptions = {
            from: `"SmileAssist Portal" <${process.env.EMAIL_USER}>`,
            to: 'kapilparwal@yahoo.com',
            subject: 'New SmileAssist Portal Registration',
            text: `A new user has registered on the SmileAssist support portal.\n\n` +
                  `WhatsApp Number: +91${phoneNumber}\n` +
                  (serialNumber ? `Serial Number: ${serialNumber}` : ''), // Only include serial if it exists
            html: `<p>A new user has registered on the SmileAssist support portal.</p>` +
                  `<ul>` +
                  `<li><b>WhatsApp Number:</b> +91${phoneNumber}</li>` +
                  (serialNumber ? `<li><b>Serial Number:</b> ${serialNumber}</li>` : '') +
                  `</ul>`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Registration email sent successfully!' }),
        };

    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Failed to send email.' }),
        };
    }
};