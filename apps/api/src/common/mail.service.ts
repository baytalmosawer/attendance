import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

export interface MailMessage { to: string; subject: string; html: string; text: string }

/** SMTP sender. Credentials come ONLY from environment variables (never from code or Git). */
@Injectable()
export class MailService {
  private tx: Transporter | null = null;

  get configured() { return !!(process.env.SMTP_USER && process.env.SMTP_PASS); }

  private transporter() {
    if (!this.tx) {
      this.tx = createTransport({
        host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT ?? 465),
        secure: (process.env.SMTP_SECURE ?? 'true') === 'true',
        auth: { user: process.env.SMTP_USER, pass: (process.env.SMTP_PASS ?? '').replace(/\s+/g, '') }, // Google shows app passwords with spaces
      });
    }
    return this.tx;
  }

  from() { return `"${process.env.SMTP_FROM_NAME ?? 'Bayt Al Mosawer'}" <${process.env.SMTP_USER}>`; }

  async send(m: MailMessage) {
    if (!this.configured) throw new Error('SMTP is not configured');
    return this.transporter().sendMail({ from: this.from(), ...m });
  }

  /** Opens a real SMTP connection and authenticates without sending anything. */
  async verify() {
    if (!this.configured) throw new Error('SMTP is not configured');
    return this.transporter().verify();
  }
}
