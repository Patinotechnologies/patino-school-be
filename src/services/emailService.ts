import nodemailer from "nodemailer";
import { env } from "../config/env";

// Only built when Gmail credentials are configured — otherwise emails are logged instead of sent,
// so the app (and the invite flow) still works without them.
const transporter =
  env.gmail.user && env.gmail.appPassword
    ? nodemailer.createTransport({
        service: "gmail",
        auth: { user: env.gmail.user, pass: env.gmail.appPassword },
      })
    : null;

async function send(to: string, subject: string, text: string, html: string): Promise<void> {
  if (!transporter) {
    console.log(`[DEV EMAIL] To: ${to}\nSubject: ${subject}\n\n${text}`);
    return;
  }

  try {
    await transporter.sendMail({ from: `"Patino Schools" <${env.gmail.user}>`, to, subject, text, html });
  } catch (err) {
    // Best-effort — a failed send shouldn't fail the staff-creation request that triggered it.
    console.error(`Failed to send email to ${to}:`, err);
  }
}

export const emailService = {
  async sendStaffInviteEmail(to: string, fullName: string, inviteLink: string): Promise<void> {
    const subject = "You've been invited to Patino Schools";
    const text = `Hi ${fullName}, create your password to get started: ${inviteLink}`;
    const html = `<p>Hi ${fullName},</p><p>You've been invited to join Patino Schools. Click below to set your password and log in:</p><p><a href="${inviteLink}">${inviteLink}</a></p>`;

    await send(to, subject, text, html);
  },
};
