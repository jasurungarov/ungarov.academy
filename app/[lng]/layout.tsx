import { ThemeProvider } from "@/components/providers/theme.provider";
import CarouselMessage from "@/components/shared/carousel";
import CookieConsent from "@/components/shared/cookie-consent";
import { Toaster } from "@/components/ui/sonner";
import { languages } from "@/i18n/settings";
import { createSeoMetadata, SITE_URL } from "@/lib/seo";
import { localization } from "@/lib/utils";
import { ChildProps } from "@/types";
import { ClerkProvider } from "@clerk/nextjs";
import { dir } from "i18next";
import type { Metadata } from "next";
import { Roboto, Space_Grotesk as SpaceGrotesk } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

const spaceGrotesk = SpaceGrotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export async function generateMetadata({
  params,
}: {
  params: { lng: string };
}): Promise<Metadata> {
  const metadata = await createSeoMetadata(
    params.lng,
    "seoHomeTitle",
    "seoHomeDescription",
  );

  return {
    ...metadata,

    metadataBase: new URL(SITE_URL),

    authors: [
      {
        name: "Ungarov Academy",
        url: SITE_URL,
      },
    ],

    creator: "Ungarov Academy",
    publisher: "Ungarov Academy",

    applicationName: "Ungarov Academy",

    icons: {
      icon: [
        {
          url: "/favicon.ico",
          sizes: "any",
          type: "image/x-icon",
        },
        {
          url: "/ungarov-favicon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: "/ungarov-favicon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  };
}

interface Props extends ChildProps {
  params: { lng: string };
}

function RootLayout({ children, params: { lng } }: Props) {
  const local = localization(lng);

  return (
    <ClerkProvider localization={local}>
      <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
        <body
          className={`${roboto.variable} ${spaceGrotesk.variable} custom-scrollbar overflow-x-hidden`}
          suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <NextTopLoader
              color="#1d885d"
              initialPosition={0.5}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #1d885d, 0 0 20px #1d885d, 0 0 35px #1d885d, 0 0 50px #1d885d"
            />
            <Toaster position="top-center" />
            <CarouselMessage />
            {children}
            <CookieConsent />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

export default RootLayout;
