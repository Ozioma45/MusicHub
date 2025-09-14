import { Resend } from "resend";
import { render } from "@react-email/render";
import NotificationEmail from "@/app/emails/NotificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNotificationEmail(
  to: string,
  title: string,
  message: string,
  type: "BOOKING" | "MESSAGE" | "REVIEW" | "SYSTEM"
) {
  try {
    const html = await render(
      <NotificationEmail title={title} message={message} type={type} />
    );

    await resend.emails.send({
      from: "Musiconnect@musiconnect.com.ng",
      to,
      subject: title,
      html,
    });
  } catch (err) {
    console.error("❌ Email failed:", err);
  }
}
