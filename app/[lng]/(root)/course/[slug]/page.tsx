import {
  getDetailedCourse,
  getFeaturedCourses,
  getIsPurchase,
} from "@/actions/course.action";
import { ICourse } from "@/app.types";
import CourseCard from "@/components/cards/course.card";
import JsonLd from "@/components/shared/json-ld";
import TopBar from "@/components/shared/top-bar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import Course from "@/database/course.model";
import { translation } from "@/i18n/server";
import { connectToDatabase } from "@/lib/mongoose";
import {
  cleanSeoText,
  createDynamicSeoMetadata,
  getCourseSeoLocale,
  ORGANIZATION_ID,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import Description from "./_components/description";
import Hero from "./_components/hero";
import Overview from "./_components/overview";

interface Props {
  params: {
    lng: string;
    slug: string;
  };
}

// Validate the course identifier
function isValidCourseId(id: string): boolean {
  return /^[a-f0-9]{24}$/i.test(id);
}

// Retrieve published course metadata
const getPublishedCourse = cache(async (id: string) => {
  if (!isValidCourseId(id)) {
    return null;
  }

  await connectToDatabase();

  return await Course.findOne({
    _id: id,
    published: true,
  }).select("title description previewImage language tags");
});

// Dynamic SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await translation(params.lng);

  const course = await getPublishedCourse(params.slug.toLowerCase());

  if (!course) {
    return {
      title: t("notFound"),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return createDynamicSeoMetadata({
    locale: getCourseSeoLocale(course.language),
    title: course.title,
    description: course.description,
    path: `/course/${course._id.toString()}`,
    image: course.previewImage,
    keywords: course.tags,
  });
}

async function Page({ params: { lng, slug } }: Props) {
  const courseId = slug.toLowerCase();

  const publishedCourse = await getPublishedCourse(courseId);

  if (!publishedCourse) {
    notFound();
  }

  const { t } = await translation(lng);
  const { userId } = auth();

  const [courseJSON, coursesJSON, isPurchase] = await Promise.all([
    getDetailedCourse(courseId),
    getFeaturedCourses(),
    userId ? getIsPurchase(userId, courseId) : Promise.resolve(false),
  ]);

  if (!courseJSON) {
    notFound();
  }

  const course: ICourse = JSON.parse(JSON.stringify(courseJSON));

  const courses: ICourse[] = JSON.parse(JSON.stringify(coursesJSON));

  const courseLocale = getCourseSeoLocale(course.language);

  const courseUrl = `${SITE_URL}/${courseLocale}/course/${course._id}`;

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${courseUrl}#course`,

    name: course.title,
    description: cleanSeoText(course.description),
    url: courseUrl,
    inLanguage: courseLocale,

    ...(course.previewImage && {
      image: course.previewImage,
    }),

    provider: {
      "@type": "EducationalOrganization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      url: SITE_URL,
    },

    ...(course.currentPrice === 0 && {
      isAccessibleForFree: true,
    }),
  };

  return (
    <>
      {lng === courseLocale && <JsonLd data={courseSchema} />}

      <TopBar label="allCourses" extra={course.title} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-3 gap-4 pt-12">
          <div className="col-span-2 max-lg:col-span-3">
            <Hero {...course} />
            <Overview {...course} />
          </div>

          <div className="col-span-1 max-lg:col-span-3">
            <Description course={course} isPurchase={!!isPurchase} />
          </div>
        </div>

        <Separator className="my-12" />

        <h2 className="font-space-grotesk text-4xl font-bold">
          {t("youMayLike")}
        </h2>

        <Carousel
          opts={{ align: "start" }}
          className="mt-6 w-full px-4 sm:px-0">
          <CarouselContent className="w-full">
            {courses.map((item) => (
              <CarouselItem
                key={item._id}
                className="md:basis-1/2 lg:basis-1/3">
                <CourseCard {...item} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
}

export default Page;
