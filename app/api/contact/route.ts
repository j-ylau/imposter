import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  CONTACT_NAME_MAX_LENGTH,
  CONTACT_EMAIL_MAX_LENGTH,
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_RATE_LIMIT,
  CONTACT_RATE_WINDOW,
  CONTACT_EMAIL_REGEX,
} from '@/lib/constants';

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiting (per IP)
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + CONTACT_RATE_WINDOW });
    return true;
  }

  if (record.count >= CONTACT_RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Email validation
    if (!CONTACT_EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Length validation
    if (
      name.length > CONTACT_NAME_MAX_LENGTH ||
      email.length > CONTACT_EMAIL_MAX_LENGTH ||
      message.length > CONTACT_MESSAGE_MAX_LENGTH
    ) {
      return NextResponse.json(
        { error: 'Input too long' },
        { status: 400 }
      );
    }

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'Imposter Game <onboarding@resend.dev>',
      to: 'jylau8@gmail.com',
      replyTo: email,
      subject: `Contact Form: Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Sent from Imposter Game contact form</small></p>
      `,
    });

    if (error) {
      console.error('[Contact] Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error('[Contact] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
