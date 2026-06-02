const twilio = require('twilio');

// Retrieve Twilio credentials from environment variables
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Helper: Initialize Twilio client or mock logger if credentials are absent
const getTwilioClient = () => {
  if (TWILIO_SID && TWILIO_AUTH_TOKEN && TWILIO_NUMBER) {
    return {
      client: twilio(TWILIO_SID, TWILIO_AUTH_TOKEN),
      senderNumber: TWILIO_NUMBER,
      isReal: true
    };
  } else {
    // Mock logger if no credentials are configured
    return {
      client: {
        messages: {
          create: async (options) => {
            console.log('\n--- SMS NOTIFICATION (MOCK) ---');
            console.log(`To: ${options.to}`);
            console.log(`From: ${options.from}`);
            console.log(`Message: "${options.body}"`);
            console.log('--- END OF SMS ---\n');
            return { sid: 'mock-sms-' + Math.random().toString(36).substring(7) };
          }
        }
      },
      senderNumber: '+1234567890',
      isReal: false
    };
  }
};

/**
 * Sends an SMS to the patient upon appointment approval
 */
const sendApprovalSMS = async (appointment) => {
  try {
    const { client, senderNumber, isReal } = getTwilioClient();
    
    const body = `Hello ${appointment.patientName}, your appointment at Masquerade® Dental Hospital is CONFIRMED for ${appointment.date} during the ${appointment.timeSlot} slot. Reference ID: ${appointment.referenceNumber}. Please arrive 10 mins early. Helpline: 095422 76777.`;

    await client.messages.create({
      body,
      from: senderNumber,
      to: appointment.phone
    });

    if (isReal) {
      console.log(`Live approval SMS sent successfully to ${appointment.phone}`);
    } else {
      console.log(`Mock approval SMS logged for ${appointment.phone}`);
    }
  } catch (error) {
    console.error(`Error sending approval SMS: ${error.message}`);
  }
};

/**
 * Sends an SMS to the patient upon appointment rejection
 */
const sendRejectionSMS = async (appointment) => {
  try {
    const { client, senderNumber, isReal } = getTwilioClient();

    const body = `Hello ${appointment.patientName}, we regret to inform you that we are unable to accommodate your appointment request on ${appointment.date} at ${appointment.timeSlot} (Ref: ${appointment.referenceNumber}). Please visit our website or call 095422 76777 to select a new slot.`;

    await client.messages.create({
      body,
      from: senderNumber,
      to: appointment.phone
    });

    if (isReal) {
      console.log(`Live rejection SMS sent successfully to ${appointment.phone}`);
    } else {
      console.log(`Mock rejection SMS logged for ${appointment.phone}`);
    }
  } catch (error) {
    console.error(`Error sending rejection SMS: ${error.message}`);
  }
};

module.exports = {
  sendApprovalSMS,
  sendRejectionSMS
};
