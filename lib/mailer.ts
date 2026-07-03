import { Resend } from "resend";

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendMail({ to, subject, html, text, replyTo }: MailOptions): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "onboarding@resend.dev";

  if (!apiKey) {
    console.warn("[mailer] RESEND_API_KEY not configured — skipping email to", to);
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, ""),
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    throw new Error(`[resend] ${error.name}: ${error.message}`);
  }
}
