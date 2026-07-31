import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { join } from 'node:path';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { INQUIRY_SOURCES } from './inquiry-source';

@Injectable()
export class InquiriesService {
  private readonly transporter: Transporter;
  private readonly from: string;
  private readonly salesEmail: string;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
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

  async create(inquiry: CreateInquiryDto) {
    // La demande est enregistrée avant tout appel SMTP : elle n'est pas perdue
    // si le fournisseur d'e-mail est momentanément indisponible.
    const saved = await this.prisma.inquiry.create({
      data: {
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone || null,
        interest: inquiry.interest,
        message: inquiry.message || null,
        source: inquiry.source,
        consent: inquiry.consent === 'true',
      },
      select: { id: true, source: true, createdAt: true },
    });

    try {
      await this.sendEmails(inquiry);
      await this.prisma.inquiry.update({
        where: { id: saved.id },
        data: {
          emailStatus: 'sent',
          brochureSentAt: new Date(),
          emailError: null,
        },
      });

      return { ...saved, emailStatus: 'sent' as const };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message.slice(0, 500) : 'Erreur SMTP';

      await this.prisma.inquiry.update({
        where: { id: saved.id },
        data: { emailStatus: 'failed', emailError: errorMessage },
      });

      throw new InternalServerErrorException(
        'Votre demande est enregistrée, mais la brochure n’a pas pu être envoyée. Notre équipe vous recontactera.',
      );
    }
  }

  async getStats() {
    const [groups, total, emailFailures] = await Promise.all([
      this.prisma.inquiry.groupBy({
        by: ['source'],
        _count: { _all: true },
      }),
      this.prisma.inquiry.count(),
      this.prisma.inquiry.count({ where: { emailStatus: 'failed' } }),
    ]);

    const counts = Object.fromEntries(
      INQUIRY_SOURCES.map((source) => [source, 0]),
    ) as Record<(typeof INQUIRY_SOURCES)[number], number>;

    for (const group of groups) {
      if (group.source in counts) {
        counts[group.source as keyof typeof counts] = group._count._all;
      }
    }

    return { total, sources: counts, emailFailures };
  }

  private async sendEmails(inquiry: CreateInquiryDto): Promise<void> {
    const safe = (value = '') =>
      value.replace(
        /[&<>"']/g,
        (character) =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
          })[character] ?? character,
      );

    const brochure = join(
      process.cwd(),
      'assets',
      'panorama-des-roses-brochure.pdf',
    );

    await Promise.all([
      this.transporter.sendMail({
        from: this.from,
        to: inquiry.email,
        subject: 'Votre brochure - Panorama des Roses',
        html: `<div style="font-family:Arial,sans-serif;color:#641c31;max-width:620px;margin:auto"><h1 style="font-family:Georgia,serif">Merci ${safe(inquiry.name)},</h1><p>Nous vous remercions pour votre intérêt pour Panorama des Roses.</p><p>Vous trouverez en pièce jointe la brochure du programme. Notre équipe reviendra vers vous prochainement.</p><p>À bientôt à Chilly,<br><strong>L’équipe Panorama des Roses</strong></p></div>`,
        attachments: [
          {
            filename: 'brochure-panorama-des-roses.pdf',
            path: brochure,
          },
        ],
      }),
      this.transporter.sendMail({
        from: this.from,
        to: this.salesEmail,
        replyTo: inquiry.email,
        subject: `Nouvelle demande [${inquiry.source}] - ${safe(inquiry.name)}`,
        html: `<h2>Nouvelle demande d’information</h2><p><strong>Provenance :</strong> ${safe(inquiry.source)}</p><p><strong>Nom :</strong> ${safe(inquiry.name)}</p><p><strong>Email :</strong> ${safe(inquiry.email)}</p><p><strong>Téléphone :</strong> ${safe(inquiry.phone)}</p><p><strong>Intérêt :</strong> ${safe(inquiry.interest)}</p><p><strong>Message :</strong><br>${safe(inquiry.message).replace(/\n/g, '<br>')}</p>`,
      }),
    ]);
  }
}
