import { translation } from "@/i18n/server";
import { fallbackLng, languages } from "@/i18n/settings";
import type { Metadata } from "next";

const BASE_URL = "https://ungarovacademy.uz";
const CONTACT_EMAIL = "ungarov.academy@gmail.com";
const GOOGLE_CONNECTIONS = "https://myaccount.google.com/connections";

const SECTIONS = [1, 2, 3, 4, 5, 6, 7];

const OG_LOCALES: Record<string, string> = {
  uz: "uz_UZ",
  ky: "ky_KG",
  en: "en_US",
  ru: "ru_RU",
  tr: "tr_TR",
};

interface Props {
  params: { lng: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lng = languages.includes(params.lng) ? params.lng : fallbackLng;

  const { t } = await translation(lng);

  const title = `${t("privacyPolicy")} | Ungarov Academy`;
  const description = t("privacyIntro");
  const url = `${BASE_URL}/${lng}/privacy-policy`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          languages.map((lang) => [lang, `${BASE_URL}/${lang}/privacy-policy`]),
        ),
        "x-default": `${BASE_URL}/privacy-policy`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Ungarov Academy",
      locale: OG_LOCALES[lng],
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Ungarov Academy",
        },
      ],
    },
  };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const lng = languages.includes(params.lng) ? params.lng : fallbackLng;

  const { t } = await translation(lng);

  return (
    <article className="mx-auto mt-16 w-full max-w-6xl px-4 py-10 sm:py-16 lg:px-8">
      <header className="mb-10 border-b border-emerald-700/40 pb-8">
        <p className="mb-3 text-sm font-semibold text-emerald-600">
          Ungarov Academy
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("privacyPolicy")}
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t("privacyIntro")}
        </p>
      </header>

      <div className="space-y-10">
        {SECTIONS.map((id) => {
          const paragraph = t(`privacyS${id}Text`);
          const [before, after] = paragraph.split(GOOGLE_CONNECTIONS);

          return (
            <section key={id} className="scroll-mt-24">
              <h2 className="flex items-center gap-3 text-lg font-semibold sm:text-xl">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-600/10 text-sm font-bold text-emerald-600">
                  {id}
                </span>

                {t(`privacyS${id}Title`)}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:pl-11 sm:text-base">
                {after !== undefined ? (
                  <>
                    {before}
                    <a
                      href={GOOGLE_CONNECTIONS}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all underline hover:text-emerald-600">
                      {GOOGLE_CONNECTIONS}
                    </a>
                    {after}
                  </>
                ) : (
                  paragraph
                )}
              </p>
              {id === 5 && (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:pl-11 sm:text-base">
                  {t("privacyAnalyticsText")}
                </p>
              )}
            </section>
          );
        })}
      </div>

      <footer className="mt-14 border-t border-emerald-700/40 pt-6">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="break-all text-sm font-medium text-emerald-600 underline underline-offset-4">
          {CONTACT_EMAIL}
        </a>
      </footer>
    </article>
  );
}
