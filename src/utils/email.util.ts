import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> => {
  await transporter.sendMail({
    to,
    subject,
    text,
    html,
  });
  console.log(`Correo enviado a ${to}`);
};
export const closeTransporter = () => {
  transporter.close();
};
