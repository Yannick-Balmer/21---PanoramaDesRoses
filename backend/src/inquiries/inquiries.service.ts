import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { join } from 'node:path';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class InquiriesService {
  private readonly transporter: Transporter;
  private readonly from: string;
  private readonly salesEmail: string;

  constructor(private readonly config: ConfigService) {
    this.from = this.config.getOrThrow<string>('MAIL_FROM');
    this.salesEmail = this.config.getOrThrow<string>('SALES_EMAIL');
    this.transporter = createTransport({
      host: this.config.getOrThrow<string>('SMTP_HOST'),
      port: this.config.get<number>('SMTP_PORT') ?? 587,
      secure: this.config.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: this.config.getOrThrow<string>('SMTP_USER'),
        pass: this.config.getOrThrow<string>('SMTP_PASSWORD'),
      },
    });
  }

  async send(inquiry: CreateInquiryDto): Promise<void> {
    const safe = (value = '') =>
      value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char] ?? char);
    const brochure = join(process.cwd(), 'assets', 'panorama-des-roses-brochure.pdf');

    try {
      await Promise.all([
        this.transporter.sendMail({
          from: this.from,
          to: inquiry.email,
          subject: 'Votre brochure — Panorama des Roses',
          html: `<div style="font-family:Arial,sans-serif;color:#42101f;max-width:620px;margin:auto"><h1 style="font-family:Georgia,serif">Merci ${safe(inquiry.name)},</h1><p>Nous vous remercions pour votre intérêt pour Panorama des Roses.</p><p>Vous trouverez en pièce jointe la brochure du programme. Notre équipe reviendra vers vous prochainement.</p><p>À bientôt à Chilly,<br><strong>L’équipe Panorama des Roses</strong></p></div>`,
          attachments: [{ filename: 'brochure-panorama-des-roses.pdf', path: brochure }],
        }),
        this.transporter.sendMail({
          from: this.from,
          to: this.salesEmail,
          replyTo: inquiry.email,
          subject: `Nouvelle demande — ${safe(inquiry.name)}`,
          html: `<h2>Nouvelle demande d’information</h2><p><strong>Nom :</strong> ${safe(inquiry.name)}</p><p><strong>Email :</strong> ${safe(inquiry.email)}</p><p><strong>Téléphone :</strong> ${safe(inquiry.phone)}</p><p><strong>Intérêt :</strong> ${safe(inquiry.interest)}</p><p><strong>Message :</strong><br>${safe(inquiry.message).replace(/\n/g, '<br>')}</p>`,
        }),
      ]);
    } catch {
      throw new InternalServerErrorException(
        'Votre demande n’a pas pu être envoyée. Merci de réessayer plus tard.',
      );
    }
  }
}
