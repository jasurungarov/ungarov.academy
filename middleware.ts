import { authMiddleware } from "@clerk/nextjs";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "ru", "uz", "tr", "ky"],
  defaultLocale: "en",
  alternateLinks: true,
});

const contentMiddleware = createMiddleware({
  locales: ["en", "ru", "uz", "tr", "ky"],
  defaultLocale: "en",
  alternateLinks: false,
});

export default authMiddleware({
  beforeAuth: (req) => {
    const isContentPage =
      /^\/(?:(?:en|ru|uz|tr|ky)\/)?(?:course|blogs|instructors)\/[^/]+\/?$/.test(
        req.nextUrl.pathname,
      );

    return isContentPage ? contentMiddleware(req) : intlMiddleware(req);
  },

  publicRoutes: [
    "/:lng",
    "/:lng/courses",
    "/:lng/course/:slug",
    "/:lng/blogs",
    "/:lng/blogs/:slug",
    "/:lng/consulting",
    "/:lng/agency",
    "/:lng/contacts",
    "/:lng/api/uploadthing",
    "/:lng/instructors",
    "/:lng/instructors/:instructorId",
    "/:lng/shopping/cart",
    "/:lng/sign-in",
    "/:lng/sign-up",
    "/:lng/reserved",
    "/:lng/privacy-policy",
  ],

  ignoredRoutes: ["/en/api/webhook", "/:lng/api/contact"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
