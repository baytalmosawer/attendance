import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { renderOtpEmail } from '../common/email-templates';
import { MailService } from '../common/mail.service';
import { OTP_TTL_MINUTES } from './otp';

export interface OtpMessage { email: string; phone?: string | null; name: string; code: string; purpose: string }

export abstract class OtpSender { abstract send(msg: OtpMessage): Promise<void>; }

@Injectable()
export class EmailOtpSender extends OtpSender {
  private log = new Logger('OtpSender');
  constructor(private mail: MailService) { super(); }
  async send(m: OtpMessage) {
    const { subject, html, text } = renderOtpEmail({ name: m.name, code: m.code, purpose: m.purpose, minutes: OTP_TTL_MINUTES });
    try {
      const result = await this.mail.send({ to: m.email, subject, html, text });
      const acceptedRecipients = result.accepted?.length ?? 0;
      if (!acceptedRecipients) throw new Error('SMTP accepted no recipients');
      this.log.log(`OTP email accepted by SMTP (messageId: ${result.messageId}; accepted recipients: ${acceptedRecipients})`);
    }
    catch (e: any) { this.log.error(`OTP email failed: ${e?.message}`); throw new ServiceUnavailableException('EMAIL_SEND_FAILED'); }
  }
}
