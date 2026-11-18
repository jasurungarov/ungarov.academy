import { translation } from "@/i18n/server";
import { fallbackLng, languages } from "@/i18n/settings";
import type { Metadata } from "next";

export const SITE_URL = "https://ungarovacademy.uz";
export const SITE_NAME = "Ungarov Academy";

const OG_LOCALES: Record<string, string> = {
  uz: "uz_UZ",
  ky: "ky_KG",
  en: "en_US",
  ru: "ru_RU",
  tr: "tr_TR",
};

export async function createSeoMetadata(
  locale: string,
  titleKey: string,
  descriptionKey: string,
  path?: string,
): Promise<Metadata> {
  const lng = languages.includes(locale) ? locale : fallbackLng;

  const { t } = await translation(lng);

  const title = `${SITE_NAME} | ${t(titleKey)}`;
  const description = t(descriptionKey);

  const url = path !== undefined ? `${SITE_URL}/${lng}${path}` : undefined;

  return {
    title,
    description,

    ...(url && {
      alternates: {
        canonical: url,
      },
    }),

    openGraph: {
      title,
      description,
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALES[lng],

      ...(url && { url }),

      alternateLocale: languages
        .filter((language) => language !== lng)
        .map((language) => OG_LOCALES[language]),

      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export function getListingPath(
  path: string,
  searchParams: Record<string, string | undefined>,
  keys: string[],
): string {
  const query = new URLSearchParams();

  for (const key of keys) {
    const value = searchParams[key];

    if (value && !(key === "page" && value === "1")) {
      query.set(key, value);
    }
  }

  const search = query.toString();

  return search ? `${path}?${search}` : path;
}

const COURSE_LOCALES: Record<string, string> = {
  uzbek: "uz",
  kyrgyz: "ky",
  english: "en",
  russian: "ru",
  turkish: "tr",
};

export function getCourseSeoLocale(language?: string): string {
  return COURSE_LOCALES[language?.toLowerCase() || ""] || "uz";
}

interface DynamicSeoProps {
  locale: string;
  title: string;
  description?: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "profile";
  keywords?: string;
}

export function createDynamicSeoMetadata({
  locale,
  title,
  description,
  path,
  image,
  type = "website",
  keywords,
}: DynamicSeoProps): Metadata {
  const lng = languages.includes(locale) ? locale : fallbackLng;

  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}/${lng}${path}`;

  const cleanDescription = description
    ?.replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const imageUrl = image || `${SITE_URL}/og-image.png`;

  return {
    title: fullTitle,
    description: cleanDescription || "",

    alternates: {
      canonical: url,
    },

    keywords,

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: fullTitle,
      description: cleanDescription || "",
      url,
      type,
      siteName: SITE_NAME,
      locale: OG_LOCALES[lng],
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: cleanDescription || "",
      images: [imageUrl],
    },
  };
}

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/ungarov_logo.svg`,
  image: `${SITE_URL}/og-image.png`,
  email: "ungarov.academy@gmail.com",
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: languages,
  publisher: {
    "@id": ORGANIZATION_ID,
  },
};

export function cleanSeoText(value?: string): string {
  return (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}