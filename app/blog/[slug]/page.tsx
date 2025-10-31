import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getBlogPostBySlug, getRelatedBlogPosts, getAllBlogCategories } from "@/lib/database/blog"
import { BlogPostPage } from "./blog-post-page"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.featured_image_url ? [post.featured_image_url] : undefined,
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: post.author_name ? [post.author_name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images: post.featured_image_url ? [post.featured_image_url] : undefined,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  
  // Fetch data on the server side
  const [post, categories] = await Promise.all([
    getBlogPostBySlug(slug),
    getAllBlogCategories(),
  ])

  if (!post) {
    notFound()
  }

  // Fetch related posts
  const relatedPosts = await getRelatedBlogPosts(post.id, post.blog_category_id, 3)

  // Prepare categories for the client component
  const categoriesList = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }))

  return (
    <BlogPostPage
      post={post}
      relatedPosts={relatedPosts}
      categories={categoriesList}
    />
  )
}
