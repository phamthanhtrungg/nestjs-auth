import { Injectable } from '@nestjs/common';
import * as mailgun from 'mailgun-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  mg = null;
  constructor(private configService: ConfigService) {
    const DOMAIN = 't-commerce.systems';
    const API_KEY = configService.get('MAILGUN_API_KEY') || '';
    this.mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });
  }
  sendMail(to, subject, template, vars = {}) {
    const data = {
      from: 'Room Manager <postmaster@t-commerce.systems>',
      to: to,
      subject: subject,
      template: template,
      ...vars,
    };
    return this.mg.messages().send(data);
  }
}
