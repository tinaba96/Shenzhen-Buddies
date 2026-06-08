// Minimal transactional email via Resend's REST API — no SDK dependency.
// When RESEND_API_KEY is missing (e.g. local dev) emails are logged instead
// of sent, so the booking flow keeps working end to end.

type SendEmailInput = {
  to: string | string[]
  subject: string
  text: string
}

export async function sendEmail({ to, subject, text }: SendEmailInput) {
  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean)
  if (recipients.length === 0) return

  const apiKey = process.env.RESEND_API_KEY
  const from =
    process.env.EMAIL_FROM ?? 'Shenzhen Buddies <onboarding@resend.dev>'

  if (!apiKey) {
    console.log(
      `[email skipped — RESEND_API_KEY not set] to=${recipients.join(', ')} subject="${subject}"\n${text}`,
    )
    return
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: recipients, subject, text }),
    })
    if (!res.ok) {
      // Email failures must never break the booking flow — log and move on.
      console.error(`Email send failed (${res.status}): ${await res.text()}`)
    }
  } catch (err) {
    console.error('Email send failed:', err)
  }
}
