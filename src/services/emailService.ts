/**
 * No email provider is wired up yet (no SMTP/Resend/SendGrid credentials configured).
 * This logs the email instead of sending it, so the invite flow is fully testable —
 * swap the body of each function for a real provider call once credentials are available.
 */
export const emailService = {
  async sendStaffInviteEmail(to: string, fullName: string, inviteLink: string): Promise<void> {
    console.log(
      `[DEV EMAIL] To: ${to}\nSubject: You've been invited to Patino Schools\n\n` +
        `Hi ${fullName}, create your password to get started: ${inviteLink}`,
    );
  },
};
