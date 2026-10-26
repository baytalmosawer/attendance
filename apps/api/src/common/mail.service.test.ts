import { afterEach, describe, expect, it } from 'vitest';
import { MailService } from './mail.service';

const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

afterEach(() => {
  if (smtpUser === undefined) delete process.env.SMTP_USER;
  else process.env.SMTP_USER = smtpUser;
  if (smtpPass === undefined) delete process.env.SMTP_PASS;
  else process.env.SMTP_PASS = smtpPass;
});

describe('MailService', () => {
  it('fails instead of reporting a successful send when SMTP is not configured', async () => {
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;

    await expect(new MailService().send({
      to: 'admin@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
      text: 'Test',
    })).rejects.toThrow('SMTP is not configured');
  });
});
