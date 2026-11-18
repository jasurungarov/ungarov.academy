
import type { MetadataRoute } from "next";
import { languages } from "@/i18n/settings";
import { connectToDatabase } from "@/lib/mongoose";
import Course from "@/database/course.model";
import Blog from "@/database/blog.model";
import User from "@/database/user.model";

export const dynamic = "force-dynamic";

const BASE_URL = "https://ungarovacademy.uz";

const STATIC_ROUTES = [
  "",
  "/courses",
  "/blogs",
  "/contacts",
  "/instructors",
  "/reserved",
];

const COURSE_LOCALES: Record<string, string> = {
  uzbek: "uz",
  kyrgyz: "ky",
  english: "en",
  russian: "ru",
  turkish: "tr",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = languages.flatMap(
    (lng) =>
      STATIC_ROUTES.map((route) => ({
        url: `${BASE_URL}/${lng}${route}`,
      }))
  );

  await connectToDatabase();

  const [courses, blogs, instructors] = await Promise.all([
    Course.find({ published: true })
      .select("_id language updatedAt")
      .lean(),

    Blog.find({
      published: true,
      slug: { $type: "string", $ne: "" },
    })
      .select("slug")
      .lean(),

    User.find({
      role: "instructor",
      clerkId: { $type: "string", $ne: "" },
    })
      .select("clerkId")
      .lean(),
  ]);

  const coursePages: MetadataRoute.Sitemap = courses.map(
    (course) => ({
      url: `${BASE_URL}/${
        COURSE_LOCALES[course.language] || "uz"
      }/course/${course._id.toString()}`,
      lastModified: course.updatedAt,
    })
  );

  const blogPages: MetadataRoute.Sitemap = blogs.map(
    (blog) => ({
      url: `${BASE_URL}/uz/blogs/${encodeURIComponent(blog.slug)}`,
    })
  );

  const instructorPages: MetadataRoute.Sitemap = instructors.map(
    (instructor) => ({
      url: `${BASE_URL}/uz/instructors/${encodeURIComponent(
        instructor.clerkId
      )}`,
    })
  );

  const pages = [
    ...staticPages,
    ...coursePages,
    ...blogPages,
    ...instructorPages,
  ];

  return Array.from(
    new Map(pages.map((page) => [page.url, page])).values()
  );
}
