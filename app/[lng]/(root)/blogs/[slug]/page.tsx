import {
  getBlogBySlug,
  getRelatedBlogs,
  incrementBlogViews,
} from "@/actions/blog.action";
import JsonLd from "@/components/shared/json-ld";
import { translation } from "@/i18n/server";
import {
  cleanSeoText,
  createDynamicSeoMetadata,
  ORGANIZATION_ID,
  SITE_URL,
} from "@/lib/seo";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import AuthorCard from "./_components/author-card";
import BackButton from "./_components/back-button";
import BlogContent from "./_components/blog-content";
import BlogHeader from "./_components/blog-header";
import CoverImage from "./_components/cover-image";
import RelatedPosts from "./_components/related-posts";

interface Props {
  params: {
    lng: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug);
  const { t } = await translation(params.lng);

  if (!blog) {
    return {
      title: t("notFound"),
      robots: { index: false, follow: false },
    };
  }

  return createDynamicSeoMetadata({
    locale: "uz",
    title: blog.title,
    description: blog.description,
    path: `/blogs/${encodeURIComponent(params.slug)}`,
    image: blog.coverImage,
    keywords: blog.tag,
    type: "article",
  });
}

async function Page({ params }: Props) {
  const blogJSON = await getBlogBySlug(params.slug);
  if (!blogJSON) return notFound();

  const blog = JSON.parse(JSON.stringify(blogJSON));

  const blogUrl = `${SITE_URL}/uz/blogs/${encodeURIComponent(blog.slug)}`;

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${blogUrl}#article`,

    headline: blog.title,
    description: cleanSeoText(blog.description),
    image: blog.coverImage,
    url: blogUrl,
    datePublished: blog.createdAt,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": blogUrl,
    },

    ...(blog.author?.fullName && {
      author: {
        "@type": "Person",
        name: blog.author.fullName,
      },
    }),

    publisher: {
      "@id": ORGANIZATION_ID,
    },
  };

  const relatedJSON = await getRelatedBlogs(blog._id, blog.category);
  const related = JSON.parse(JSON.stringify(relatedJSON));

  incrementBlogViews(blog._id);

  return (
    <div className="pt-[12vh]">
      {params.lng === "uz" && <JsonLd data={blogSchema} />}
      <div className="mx-auto max-w-6xl px-4 sm:px-8 sm:pt-3">
        <BackButton />
      </div>
      <CoverImage blog={blog} />
      <BlogHeader blog={blog} />
      <BlogContent content={blog.content} />
      <AuthorCard author={blog.author} />
      <RelatedPosts blogs={related} />
    </div>
  );
}

export default Page;
