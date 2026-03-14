const nodemailer = require("nodemailer");
const env = require("../config/env");

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.secure,
  auth: env.smtp.user && env.smtp.pass ? {
    user: env.smtp.user,
    pass: env.smtp.pass
  } : undefined
});

async function sendMail({ to, subject, html, text }) {
  if (!env.smtp.user || !env.smtp.pass) {
    console.warn("SMTP credentials are missing. Email was skipped.");
    return;
  }

  await transporter.sendMail({
    from: `"${env.smtp.fromName}" <${env.smtp.fromEmail}>`,
    to,
    subject,
    html,
    text
  });
}

module.exports = {
  sendMail
};
