export interface SeoProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  storeName?: string;
  couponCode?: string;
  discount?: string;
  validThrough?: string;
}

export function generateSiteTitle(title: string) {
  return `${title} | CouponHub`;
}

export function jsonLdOffer({
  name,
  description,
  code,
  discount,
  validThrough,
  storeName,
  url,
}: {
  name: string;
  description?: string;
  code?: string;
  discount?: string;
  validThrough?: string;
  storeName?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name,
    description: description ?? name,
    price: "0",
    priceCurrency: "VND",
    ...(code ? { serialNumber: code } : {}),
    ...(validThrough ? { validThrough } : {}),
    ...(storeName
      ? { seller: { "@type": "Organization", name: storeName } }
      : {}),
    ...(url ? { url } : {}),
  };
}

export function jsonLdStore({
  name,
  description,
  url,
  image,
}: {
  name: string;
  description?: string;
  url?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    ...(description ? { description } : {}),
    ...(url ? { url } : {}),
    ...(image ? { image } : {}),
  };
}

export function jsonLdFAQ(questions: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

export function jsonLdHowTo(steps: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cách sử dụng mã giảm giá",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: s,
    })),
  };
}

export function jsonLdBreadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
