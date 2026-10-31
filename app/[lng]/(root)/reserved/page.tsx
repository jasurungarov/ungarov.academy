"use client";

import useTranslate from "@/hooks/use-translate";
import { ArrowUpRight, Mail } from "lucide-react";
import { TbBrandTelegram } from "react-icons/tb";

const CONTACT_EMAIL = "ungarov.academy@gmail.com";
const CONTACT_TELEGRAM = "https://t.me/ungarovacademy";
const LAST_UPDATED = "31.10.2026";

type Section = {
  id: number;
  items?: number; 
  outro?: boolean; 
};

const SECTIONS: Section[] = [
  { id: 1 },
  { id: 2, items: 3, outro: true },
  { id: 3 },
  { id: 4 },
  { id: 5, items: 4 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
  { id: 13 },
];

function Item({ text }: { text: string }) {
  const idx = text.indexOf(": ");
  const hasLabel = idx > 0 && idx < 60;

  return (
    <li className="flex gap-3">
      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-600" />
      <span>
        {hasLabel ? (
          <>
            <strong className="font-semibold text-foreground">
              {text.slice(0, idx + 1)}
            </strong>{" "}
            {text.slice(idx + 2)}
          </>
        ) : (
          text
        )}
      </span>
    </li>
  );
}

export default function Page() {
  const t = useTranslate();
  const year = new Date().getFullYear();

  return (
    <main className="mx-auto mt-16 w-full max-w-6xl px-4 py-10 sm:py-16 lg:px-8">
      {/* Sarlavha */}
      <header className="mb-10 border-b border-emerald-700/40 pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("copyright")}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          © {year} Ungarov Academy. {t("copyright")}.
        </p>
      </header>

      <div className="space-y-10">
        {SECTIONS.map(({ id, items = 0, outro }) => (
          <section key={id} className="scroll-mt-24">
            <h2 className="flex items-center gap-3 text-lg font-semibold sm:text-xl">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-600/10 text-sm font-bold text-emerald-600">
                {id}
              </span>
              {t(`rightsS${id}Title`)}
            </h2>

            <div className="mt-3 space-y-3 pl-0 text-sm leading-relaxed text-muted-foreground sm:pl-11 sm:text-base">
              <p>{t(`rightsS${id}Text`).replace("{email}", CONTACT_EMAIL)}</p>

              {items > 0 && (
                <ul className="space-y-2">
                  {Array.from({ length: items }).map((_, i) => (
                    <Item key={i} text={t(`rightsS${id}Item${i + 1}`)} />
                  ))}
                </ul>
              )}

              {outro && <p>{t(`rightsS${id}Outro`)}</p>}

              {id === 13 && (
                <div className="grid grid-cols-1 gap-3 pt-2 sm:max-w-xs">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="group flex items-center justify-between rounded-lg border border-emerald-700/30 px-4 py-3 text-sm font-medium text-foreground transition-all hover:border-green-500 hover:text-green-500">
                    <span className="flex items-center space-x-3">
                      <Mail size={20} />
                      <span>Email</span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>

                  <a
                    href={CONTACT_TELEGRAM}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-lg border border-emerald-700/30 px-4 py-3 text-sm font-medium text-foreground transition-all hover:border-green-500 hover:text-green-500">
                    <span className="flex items-center space-x-3">
                      <TbBrandTelegram size={20} />
                      <span>Telegram</span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-14 border-t border-emerald-700/40 pt-6 text-xs text-muted-foreground sm:text-sm">
        {t("rightsUpdated")}: {LAST_UPDATED}
      </footer>
    </main>
  );
}
