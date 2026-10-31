"use client";

import Logo from "@/components/shared/logo";
import { Separator } from "@/components/ui/separator";
import { navLinks } from "@/constants";
import useTranslate from "@/hooks/use-translate";
import { Mail, MapPin, PhoneCall } from "lucide-react";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa6";
import { TbBrandTelegram } from "react-icons/tb";

function Footer() {
  const t = useTranslate();

  return (
    <div className="glass mt-4 pt-8 ">
      <div className="mx-auto max-w-7xl px-4 pb-6">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
          <div className="flex flex-col space-y-3 md:col-span-2">
            <Logo />
            <p className='text-xs sm:text-sm'>{t("heroDescription")}</p>
          </div>

          <div className="flex flex-col space-y-3">
            <Separator className="mb-2 dark:bg-gray-500 md:hidden" />
            <h1 className="font-space-grotesk text-2xl sm:text-3xl">{t("pages")}</h1>
            <div className="grid grid-cols-1 space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.route}
                  href={`/${item.route}`}
                  className="text-xs font-medium transition-all hover:text-green-500 hover:underline sm:text-sm">
                  {t(item.name)}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <Separator className="mb-2 dark:bg-gray-500 md:hidden" />
            <h1 className="font-space-grotesk text-3xl">{t("contacts")}</h1>
            <div className="grid grid-cols-1 space-y-3 pt-2">
              <div className="flex items-center space-x-3">
                <TbBrandTelegram className="size-4 sm:size-5" />
                <a
                  className="text-xs hover:text-green-500 hover:underline dark:hover:text-green-500 sm:text-sm"
                  href="https://t.me/ungarovacademy"
                  target="_blank"
                  rel="noopener noreferrer">
                  Telegram
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <FaInstagram className="size-4 sm:size-5" />
                <a
                  className="text-xs hover:text-green-500 hover:underline dark:hover:text-green-500 sm:text-sm"
                  href="https://instagram.com/ungarov.academy"
                  target="_blank"
                  rel="noopener noreferrer">
                  Instagram
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="size-4 sm:size-5" />
                <a
                  className="text-xs hover:text-green-500 hover:underline dark:hover:text-green-500 sm:text-sm"
                  href="mailto:ungarov.academy@gmail.com">
                  ungarov.academy@gmail.com
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <PhoneCall className="size-4 sm:size-5" />
                <div className="flex flex-col space-y-1">
                  <a
                    className="text-xs hover:text-green-500 hover:underline dark:hover:text-green-500 sm:text-sm"
                    href="tel:+996707067776">
                    +996 (707) 067-776
                  </a>
                  {/* <Separator className="dark:bg-gray-500" /> */}
                  {/* <a
                    className="text-sm hover:text-blue-500 hover:underline dark:hover:text-blue-300"
                    href="tel:+31220777777">
                    +31 220 777 777
                  </a> */}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="size-4 sm:size-5" />
                <span className="text-xs sm:text-sm">Bishkek, Kyrgyzstan</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Separator className="mb-2 dark:bg-gray-500" />
          <p>
            <Link
              href={`/reserved`}
              className="underline-offset-4 transition-colors hover:text-emerald-600 hover:underline">
              © {new Date().getFullYear()}. {t("copyright")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
