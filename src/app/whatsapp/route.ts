import { NextResponse, type NextRequest } from 'next/server'
import { siteUrl, whatsappNumber } from '@/lib/config'

// "Chat on WhatsApp" lands here, not on a wa.me link, so the phone number is
// never in any page's HTML or visible on hover — only someone who actually
// clicks gets handed to WhatsApp. If the number is not configured, fall back
// to the contact page rather than a dead end.
export async function GET(request: NextRequest) {
  const number = whatsappNumber()
  if (!number) {
    return NextResponse.redirect(new URL('/contact', siteUrl()))
  }
  const target = new URL(`https://wa.me/${number}`)
  const text = request.nextUrl.searchParams.get('text')?.trim()
  target.searchParams.set(
    'text',
    text && text.length <= 300
      ? text
      : 'Hi! I found Shenzhen Buddies and have a question about a tour.',
  )
  return NextResponse.redirect(target, {
    status: 302,
    headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' },
  })
}
