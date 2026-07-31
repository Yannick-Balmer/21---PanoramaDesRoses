export const INQUIRY_SOURCES = [
  "flyers",
  "planmasse",
  "bachepanoramique1",
] as const;

export type InquirySource = (typeof INQUIRY_SOURCES)[number] | "direct";

export function normalizeInquirySource(value: string | null): InquirySource {
  const normalized = value?.trim().toLowerCase();
  return INQUIRY_SOURCES.includes(
    normalized as (typeof INQUIRY_SOURCES)[number],
  )
    ? (normalized as InquirySource)
    : "direct";
}
