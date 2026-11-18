import { getBlogs } from "@/actions/blog.action";
import { SearchParamsProps } from "@/app.types";
import TopBar from "@/components/shared/top-bar";
import { createSeoMetadata, getListingPath } from "@/lib/seo";
import { Metadata } from "next";
import BlogsExplorer from "./_components/blogs-explorer";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { lng: string };
  searchParams: Record<string, string | undefined>;
}): Promise<Metadata> {
  return createSeoMetadata(
    params.lng,
    "blogs",
    "blogsDescription",
    getListingPath("/blogs", searchParams, ["page", "category", "q"]),
  );
}

async function Page({ searchParams }: SearchParamsProps) {
  const page = searchParams.page ? +searchParams.page : 1;
  const category = searchParams.category;
  const searchQuery = searchParams.q;

  const resultJSON = await getBlogs({
    page,
    category,
    searchQuery,
    pageSize: 6,
  });
  const result = JSON.parse(JSON.stringify(resultJSON));

  const showFeatured = page === 1 && !category && !searchQuery;

  return (
    <>
      <TopBar label="blogs" description="blogsDescription" />

      <div className="mt-8">
        <BlogsExplorer
          result={result}
          showFeatured={showFeatured}
          page={page}
        />
      </div>
    </>
  );
}

export default Page;
