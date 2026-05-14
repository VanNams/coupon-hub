export function formatDiscount(discount: string) {
  return discount;
}

export function getTimeRemaining(endDate: string | Date, referenceDate: string | Date = new Date()) {
  const now = new Date(referenceDate);
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  if (days > 0) return `${days} ngày`;
  if (hours > 0) return `${hours} giờ`;
  return "Sắp hết hạn";
}

export function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  }
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
