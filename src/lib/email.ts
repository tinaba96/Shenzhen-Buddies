// Transactional email via Gmail SMTP (nodemailer). Sending uses a Gmail
// "App password" — independent of who logs into the shared inbox, and works
// without 2FA at send time. Because Gmail itself is the sending server, the
// @gmail.com From address passes SPF/DKIM/DMARC, so mail actually lands in
// the inbox without owning a domain.
//
// When GMAIL_USER / GMAIL_APP_PASSWORD are missing (e.g. local dev) emails
// are logged instead of sent, so the booking flow keeps working end to end.

import nodemailer from 'nodemailer'

type SendEmailInput = {
  to: string | string[]
  subject: string
  text: string
}

// Accepts either "Name <addr@x.com>" or a bare address; falls back to the
// authenticated Gmail user so the From always matches the sending account.
function resolveFrom(user: string): string {
  const configured = process.env.EMAIL_FROM?.trim()
  if (!configured) return user
  // Gmail rewrites the envelope sender to the authed user anyway, but a
  // display name like "Shenzhen Buddies <user@gmail.com>" is preserved.
  return configured
}

// Never throws: the booking flow must not fail because a mail did. The
// result carries the reason instead, so the admin dashboard's test button
// can show "535 Username and Password not accepted" rather than nothing.
export type SendEmailResult = { ok: true } | { ok: false; error: string }

export async function sendEmail({
  to,
  subject,
  text,
}: SendEmailInput): Promise<SendEmailResult> {
  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean)
  if (recipients.length === 0) return { ok: false, error: 'no recipient address' }

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    console.log(
      `[email skipped — GMAIL_USER/GMAIL_APP_PASSWORD not set] to=${recipients.join(', ')} subject="${subject}"\n${text}`,
    )
    return { ok: false, error: 'GMAIL_USER / GMAIL_APP_PASSWORD not set on the server' }
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    })
    await transporter.sendMail({
      from: resolveFrom(user),
      to: recipients,
      subject,
      text,
    })
    return { ok: true }
  } catch (err) {
    // Email failures must never break the booking flow — log and move on.
    console.error('Email send failed:', err)
    return { ok: false, error: describeSmtpError(err) }
  }
}

// Gmail's rejection text is the useful part ("535-5.7.8 Username and Password
// not accepted") — surface it, without the multi-line boilerplate around it.
function describeSmtpError(err: unknown): string {
  const e = err as { response?: string; code?: string; message?: string }
  const line =
    (e?.response ?? e?.message ?? String(err)).split('\n')[0].trim() ||
    'unknown error'
  return e?.code && !line.includes(e.code) ? `${e.code}: ${line}` : line
}
