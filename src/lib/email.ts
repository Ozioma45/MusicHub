import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNotificationEmail(
  to: string,
  subject: string,
  message: string
) {
  console.log("📧 Attempting to send email:", { to, subject, message });

  try {
    const response = await resend.emails.send({
      from: "noreply@musiconnect.com.ng",
      to,
      subject,
      text: message,
    });

    console.log("✅ Email sent response:", response);
  } catch (err) {
    console.error("❌ Email failed:", err);
  }
}
