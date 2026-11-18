import { getFeaturedCourses } from "@/actions/course.action";
import { getAdminInstructors } from "@/actions/user.action";
import JsonLd from "@/components/shared/json-ld";
import {
  createSeoMetadata,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";
import type { Metadata } from "next";
import Categories from "./_components/categories";
import FeaturedCourses from "./_components/featured-courses";
import Hero from "./_components/hero";
import Instructor from "./_components/instructor";
import LearningJourney from "./_components/learning-journey";
import LeavesLazy from "./_components/leaves-lazy";

export async function generateMetadata({
  params,
}: {
  params: { lng: string };
}): Promise<Metadata> {
  return createSeoMetadata(
    params.lng,
    "seoHomeTitle",
    "seoHomeDescription",
    "",
  );
}

async function Page() {
  const courses = await getFeaturedCourses();
  const instructorData = await getAdminInstructors({ pageSize: 4 });

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />

      <LeavesLazy />
      <Hero />
      <FeaturedCourses courses={JSON.parse(JSON.stringify(courses))} />
      <Categories />
      <Instructor
        instructors={JSON.parse(JSON.stringify(instructorData.instructors))}
      />
      <LearningJourney />
    </>
  );
}

export default Page;
