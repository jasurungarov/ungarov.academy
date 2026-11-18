import { getAllCourses } from "@/actions/course.action";
import { ICourse, SearchParamsProps } from "@/app.types";
import JsonLd from "@/components/shared/json-ld";
import TopBar from "@/components/shared/top-bar";
import {
  createSeoMetadata,
  getCourseSeoLocale,
  getListingPath,
  SITE_URL,
} from "@/lib/seo";
import { Metadata } from "next";
import AllCourses from "./_components/all-courses";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { lng: string };
  searchParams: Record<string, string | undefined>;
}): Promise<Metadata> {
  return createSeoMetadata(
    params.lng,
    "allCourses",
    "allCourseDescription",
    getListingPath("/courses", searchParams, ["page", "filter", "q"]),
  );
}

async function Page({ searchParams }: SearchParamsProps) {
  const resultJSON = await getAllCourses({
    page: searchParams.page ? +searchParams.page : 1,
    filter: searchParams.filter,
    searchQuery: searchParams.q,
  });

  const result = JSON.parse(JSON.stringify(resultJSON));

  const courseListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: result.courses.map((course: ICourse, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/${getCourseSeoLocale(course.language)}/course/${course._id}`,
    })),
  };

  return (
    <>
      {!searchParams.q &&
        !searchParams.filter &&
        (!searchParams.page || searchParams.page === "1") &&
        result.courses.length >= 3 && <JsonLd data={courseListSchema} />}

      <TopBar label="allCourses" description="allCourseDescription" />
      <AllCourses result={result} />
    </>
  );
}

export default Page;
