// const nodemailer = require("nodemailer");
// module.exports = async (email, subject, text) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: process.env.HOST,
//             service: process.env.SERVICE,
//             port: 587,
//             // secure: Boolean(process.env.SECURE),
//             auth: {
//                 user: process.env.SMTP_USER,
//                 pass: process.env.SMTP_PASS,
//             },
//         });
//         await transporter.sendMail({
//             from: process.env.USER,
//             to: email,
//             subject: subject,
//             text: text,
//         });
//         console.log(`Email sent to ${email}`);
//     } catch (error) {
//         console.error(error);
//         console.error(`Error sending mail to ${email}`);
//         throw error; // Re-throw the error for the calling code to h
//     }
// }


const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.SECURE === "true", // match .env
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER, // ✅ fixed key name
      to: email,
      subject,
      text,
    });

    console.log(`✅ Email sent successfully to ${email}`);
  } catch (error) {
    console.error(`❌ Error sending mail to ${email}:`, error.message);
    throw error;
  }
};
