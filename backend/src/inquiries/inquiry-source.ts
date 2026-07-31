export const INQUIRY_SOURCES = [
  'flyers',
  'planmasse',
  'bachepanoramique1',
  'direct',
] as const;

export type InquirySource = (typeof INQUIRY_SOURCES)[number];
