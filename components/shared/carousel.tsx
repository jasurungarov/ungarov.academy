"use client";

import useTranslate from "@/hooks/use-translate";

const ITEMS = Array.from({ length: 1 });

function Group({
  message,
  hidden = false,
}: {
  message: string;
  hidden?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {ITEMS.map((_, i) => (
        <span
          key={i}
          className="mx-12 whitespace-nowrap text-xs font-medium text-emerald-700 sm:mx-12 sm:text-sm">
          {message}
        </span>
      ))}
    </div>
  );
}

export default function CarouselMessage() {
  const t = useTranslate();
  const message = t("carouselmessage");

  return (
    <>
      <div
        role="status"
        className="fixed inset-x-0 top-0 z-50 flex h-7 items-center border-b-2 border-emerald-700 bg-white sm:h-7">
        <style>{`
          @keyframes carousel-scroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}</style>

        <div
          className="mx-auto w-full overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 2%, black 98%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 2%, black 98%, transparent)",
          }}>
          <div
            style={{
              display: "flex",
              width: "max-content",
              animation: "carousel-scroll 40s linear infinite",
            }}>
            <Group message={message} />
            <Group message={message} hidden />
          </div>
        </div>
      </div>
    </>
  );
}
