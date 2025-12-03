import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email (e.g. gmail)
        pass: process.env.EMAIL_PASS, // app password (not your Gmail login password)
      },
    });

    await transporter.sendMail({
      from: `"SQL Expert" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
    throw new Error("Failed to send email");
  }
};
