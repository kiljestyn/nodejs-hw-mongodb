import nodemailer from 'nodemailer';
import { env } from '../utils/env.js';
// import { ENV_VARS } from '../constants/index.js';

const transporter = nodemailer.createTransport({
  host: env('SMTP_HOST'),
  port: env('SMTP_PORT'),
  auth: {
    user: env('SMTP_USER'),
    pass: env('SMTP_PASSWORD'),
  },
});
export const sendMail = async (options) => {
  return await transporter.sendMail(options);
};
