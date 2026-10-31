"use client";

import { learningJourney } from "@/constants";
import useTranslate from "@/hooks/use-translate";
import Image from "next/image";

function LearningJourney() {
  const t = useTranslate();

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="text-center font-space-grotesk text-xl font-bold sm:text-2xl">
        {t("learnJourney")}
      </h1>
      <p className="mx-auto max-w-4xl text-center text-xs text-muted-foreground sm:text-sm">
        {t("learnJourneyDescription")}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-4">
        {learningJourney.map((item) => (
          <div
            key={item.title}
            className="flex h-full flex-col items-center justify-start rounded-xl bg-secondary p-4 text-center sm:p-6">
            <Image
              src={item.image}
              alt={item.title}
              width={70}
              height={70}
              className="size-12 shrink-0 sm:size-[70px]"
            />
            <h2 className="mt-2 line-clamp-2 font-space-grotesk text-sm font-bold sm:line-clamp-1 sm:text-lg">
              {t(item.title)}
            </h2>
            <p className="mt-1 line-clamp-3 text-xs text-muted-foreground sm:line-clamp-2 sm:text-sm">
              {t(item.excerpt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LearningJourney;
