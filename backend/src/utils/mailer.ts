import Mailjet, { SendEmailV3_1 } from 'node-mailjet';
import { env } from '../config/env';

const mailjet =
  env.mail.mailjetApiKey && env.mail.mailjetSecretKey
    ? new Mailjet({
        apiKey: env.mail.mailjetApiKey,
        apiSecret: env.mail.mailjetSecretKey,
      })
    : null;

async function sendEmail(message: SendEmailV3_1.Message): Promise<void> {
  if (!mailjet) {
    console.log(`[mailer] Mailjet not configured. Email to ${message.To.map((t) => t.Email).join(', ')} not sent.`);
    return;
  }

  const body: SendEmailV3_1.Body = { Messages: [message] };
  const result = await mailjet.post('send', { version: 'v3.1' }).request<SendEmailV3_1.Response>(body);
  const response = result.body.Messages?.[0];

  if (response?.Status !== SendEmailV3_1.ResponseStatus.Success) {
    throw new Error(`Mailjet send failed: ${JSON.stringify(response?.Errors ?? result.body)}`);
  }
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  if (!mailjet) {
    console.log(`[mailer] Mailjet not configured. Password reset link for ${to}: ${resetUrl}`);
    return;
  }

  try {
    await sendEmail({
      From: { Email: env.mail.from, Name: env.mail.fromName },
      To: [{ Email: to }],
      Subject: 'Recuperação de senha - NotaFacil',
      TextPart: `Use o link para redefinir sua senha (válido por 1 hora): ${resetUrl}`,
      HTMLPart:
        `<p>Você solicitou a recuperação de senha.</p>` +
        `<p><a href="${resetUrl}">Clique aqui para redefinir sua senha</a></p>` +
        `<p>O link é válido por 1 hora. Se você não solicitou, ignore este e-mail.</p>`,
    });
    console.log(`[mailer] Password reset email sent to ${to}`);
  } catch (error) {
    console.error(`[mailer] Failed to send password reset email to ${to}`, error);
  }
}
