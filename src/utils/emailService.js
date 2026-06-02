const nodemailer = require('nodemailer');

// Setup Nodemailer transporter with dynamic configuration from .env
// If no credentials, we fallback to console logging
const getTransporter = async () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Return a mock transporter that logs to console
    return {
      sendMail: async (options) => {
        console.log('\n--- EMAIL NOTIFICATION (MOCK) ---');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`From: ${options.from || 'Masquerade Dental'}`);
        console.log(`Body (HTML length): ${options.html.length} characters`);
        console.log('--- END OF EMAIL ---\n');
        return { messageId: 'mock-id-' + Math.random().toString(36).substring(7) };
      }
    };
  }
};

/**
 * Sends a premium-designed appointment confirmation email
 */
const sendConfirmationEmail = async (appointment) => {
  try {
    const transporter = await getTransporter();
    const from = process.env.SMTP_FROM || '"Masquerade Dental Hospital" <appointments@masqueradedental.com>';
    
    const htmlContent = `
      <div style="font-family: 'Outfit', 'Helvetica Neue', Arial, sans-serif; background-color: #f4f6f9; padding: 30px 15px; color: #2b3a4a;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 35px 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">Appointment Confirmed</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 15px;">Masquerade® Dental Hospital — NABH Accredited</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px; line-height: 1.6;">
            <h2 style="color: #1e3c72; margin-top: 0; font-size: 20px;">Hello, ${appointment.patientName}!</h2>
            <p style="font-size: 15px; color: #4a5568;">Your appointment request at <strong>Masquerade® Dental Hospital</strong> has been approved and successfully booked. Below are your booking details:</p>
            
            <!-- Details Card -->
            <div style="background-color: #f7fafc; border-left: 4px solid #3182ce; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #4a5568; width: 40%;">Reference Number:</td>
                  <td style="padding: 6px 0; color: #2d3748; font-weight: 700; font-family: monospace; font-size: 16px;">${appointment.referenceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #4a5568;">Date:</td>
                  <td style="padding: 6px 0; color: #2d3748;">${appointment.date}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #4a5568;">Time Slot:</td>
                  <td style="padding: 6px 0; color: #2d3748;">${appointment.timeSlot}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #4a5568;">Treatment:</td>
                  <td style="padding: 6px 0; color: #2d3748;">${appointment.treatment}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 14px; color: #718096; margin-bottom: 25px;">
              * Please arrive 10 minutes prior to your scheduled time slot for initial screening. If you need to reschedule or cancel, please call us directly at <strong>095422 76777</strong>.
            </p>

            <div style="text-align: center;">
              <a href="${process.env.APP_URL || 'https://dental-clinic-booking-red.vercel.app'}" style="background: #3182ce; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; display: inline-block; box-shadow: 0 3px 6px rgba(49, 130, 206, 0.3);">Visit Hospital Website</a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #edf2f7; text-align: center; padding: 20px; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 5px 0;"><strong>Masquerade® Dental Hospital</strong></p>
            <p style="margin: 0;">Vijayawada, Andhra Pradesh, India | Phone: 095422 76777 | contact@masqueradedental.com</p>
            <p style="margin: 10px 0 0 0; font-size: 10px; opacity: 0.8;">© 2026 Masquerade Dental. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from,
      to: appointment.email,
      subject: `Confirmed: Appointment booking reference ${appointment.referenceNumber} - Masquerade Dental`,
      html: htmlContent
    });
    console.log(`Confirmation email sent successfully to ${appointment.email}`);
  } catch (error) {
    console.error(`Error sending confirmation email: ${error.message}`);
  }
};

/**
 * Sends a premium-designed appointment rejection email
 */
const sendRejectionEmail = async (appointment) => {
  try {
    const transporter = await getTransporter();
    const from = process.env.SMTP_FROM || '"Masquerade Dental Hospital" <appointments@masqueradedental.com>';
    
    const htmlContent = `
      <div style="font-family: 'Outfit', 'Helvetica Neue', Arial, sans-serif; background-color: #f4f6f9; padding: 30px 15px; color: #2b3a4a;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%); padding: 35px 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Reschedule Requested</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 15px;">Masquerade® Dental Hospital — Care & Safety First</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px; line-height: 1.6;">
            <h2 style="color: #b45309; margin-top: 0; font-size: 20px;">Hello, ${appointment.patientName}!</h2>
            <p style="font-size: 15px; color: #4a5568;">Thank you for choosing <strong>Masquerade® Dental Hospital</strong> for your dental care.</p>
            <p style="font-size: 15px; color: #4a5568;">We are writing to **sincerely apologize for any inconvenience caused**, but we are unfortunately unable to accommodate your requested time slot: <strong>${appointment.date} at ${appointment.timeSlot}</strong>. This is due to sudden clinical schedule shifts or emergency maxillofacial surgeries requiring our specialists' immediate presence.</p>
            
            <div style="background-color: #fffaf0; border-left: 4px solid #d97706; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; font-size: 14px; color: #7b341e;">
              <strong>Booking Reference ID:</strong> ${appointment.referenceNumber}<br>
              <strong>Status:</strong> Reschedule Required
            </div>

            <p style="font-size: 15px; color: #4a5568; margin-bottom: 25px;">
              Your oral health remains our utmost priority, and we would be very grateful for the opportunity to care for your smile. We kindly invite you to select any other available date or time slot that works best for you.
            </p>

            <table style="width: 100%; margin-top: 25px;">
              <tr>
                <td style="text-align: center;">
                  <a href="${process.env.APP_URL || 'https://dental-clinic-booking-red.vercel.app'}#booking" style="background: #d97706; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: 600; display: inline-block; margin-right: 10px; box-shadow: 0 3px 6px rgba(217, 119, 6, 0.25);">Select New Time Slot</a>
                  <a href="tel:09542276777" style="background: #edf2f7; color: #2b3a4a; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: 600; display: inline-block; border: 1px solid #cbd5e0;">Call: 095422 76777</a>
                </td>
              </tr>
            </table>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #edf2f7; text-align: center; padding: 20px; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 5px 0;"><strong>Masquerade® Dental Hospital</strong></p>
            <p style="margin: 0;">Vijayawada, Andhra Pradesh, India | Phone: 095422 76777 | contact@masqueradedental.com</p>
            <p style="margin: 10px 0 0 0; font-size: 10px; opacity: 0.8;">© 2026 Masquerade Dental. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from,
      to: appointment.email,
      subject: `Update: Appointment rescheduling request ${appointment.referenceNumber} - Masquerade Dental`,
      html: htmlContent
    });
    console.log(`Rejection/Reschedule email sent successfully to ${appointment.email}`);
  } catch (error) {
    console.error(`Error sending reschedule email: ${error.message}`);
  }
};

/**
 * Sends a notification email to the administrator when a new request is submitted
 */
const sendAdminNotificationEmail = async (appointment) => {
  try {
    const transporter = await getTransporter();
    const from = process.env.SMTP_FROM || '"Masquerade Dental Hospital" <appointments@masqueradedental.com>';
    const to = process.env.ADMIN_EMAIL || 'mail4murari27@gmail.com';

    const htmlContent = `
      <div style="font-family: 'Outfit', 'Helvetica Neue', Arial, sans-serif; background-color: #f4f6f9; padding: 30px 15px; color: #2b3a4a;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #102a43 0%, #243e56 100%); padding: 35px 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">New Appointment Request</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 15px;">Masquerade® Dental Hospital — Scheduling Notice</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px; line-height: 1.6;">
            <h2 style="color: #102a43; margin-top: 0; font-size: 18px;">Hello Administrator,</h2>
            <p style="font-size: 15px; color: #4a5568;">A patient has submitted a new appointment booking request on the patient portal. Please review the details below to action the request:</p>
            
            <!-- Details Card -->
            <div style="background-color: #f7fafc; border-left: 4px solid #4a5568; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #4a5568; width: 40%;">Reference ID:</td>
                  <td style="padding: 6px 0; color: #2d3748; font-weight: 700; font-family: monospace; font-size: 16px;">${appointment.referenceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #4a5568;">Patient Name:</td>
                  <td style="padding: 6px 0; color: #2d3748; font-weight: 600;">${appointment.patientName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #4a5568;">Phone Number:</td>
                  <td style="padding: 6px 0; color: #2d3748;">${appointment.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #4a5568;">Email Address:</td>
                  <td style="padding: 6px 0; color: #2d3748;">${appointment.email}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #4a5568;">Requested Date:</td>
                  <td style="padding: 6px 0; color: #2d3748; font-weight: 600;">${appointment.date}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #4a5568;">Time Slot:</td>
                  <td style="padding: 6px 0; color: #2d3748; font-weight: 600;">${appointment.timeSlot}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #4a5568;">Treatment Type:</td>
                  <td style="padding: 6px 0; color: #2d3748;">${appointment.treatment}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #4a5568; vertical-align: top;">Symptom Notes:</td>
                  <td style="padding: 6px 0; color: #4a5568; font-style: italic;">${appointment.notes || 'No symptoms or special notes provided.'}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.APP_URL || 'https://dental-clinic-booking-red.vercel.app'}/admin.html" style="background: #102a43; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; display: inline-block; box-shadow: 0 3px 6px rgba(16, 42, 67, 0.3);">Open Admin Dashboard</a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #edf2f7; text-align: center; padding: 20px; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 5px 0;"><strong>Masquerade® Dental Hospital Notification System</strong></p>
            <p style="margin: 0;">Vijayawada, Andhra Pradesh, India | Phone: 095422 76777</p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from,
      to,
      subject: `[NEW REQUEST] Reference ${appointment.referenceNumber} - ${appointment.patientName} (${appointment.date})`,
      html: htmlContent
    });
    console.log(`Administrator notification email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Error sending admin notification email: ${error.message}`);
  }
};

module.exports = {
  sendConfirmationEmail,
  sendRejectionEmail,
  sendAdminNotificationEmail
};
