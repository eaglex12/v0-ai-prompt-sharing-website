import { getAllBlogPosts } from "@/lib/database/blog";

export async function GET() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in";
	const blogPosts = await getAllBlogPosts();

	const rssItems = blogPosts
		.slice(0, 20) // Limit to latest 20 posts
		.map((post) => {
			const pubDate = new Date(post.published_at || post.created_at).toUTCString();
			const link = `${baseUrl}/blog/${post.slug}`;
			
			return `
				<item>
					<title><![CDATA[${post.title}]]></title>
					<description><![CDATA[${post.excerpt || ""}]]></description>
					<link>${link}</link>
					<guid isPermaLink="true">${link}</guid>
					<pubDate>${pubDate}</pubDate>
					<author>${post.author_name}</author>
					${post.tags.map(tag => `<category><![CDATA[${tag}]]></category>`).join("")}
				</item>
			`.trim();
		})
		.join("");

	const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>AI Prompts Hub Blog</title>
		<description>Latest insights, tutorials, and trends in AI prompt engineering</description>
		<link>${baseUrl}/blog</link>
		<atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
		<language>en-us</language>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		<generator>AI Prompts Hub</generator>
		${rssItems}
	</channel>
</rss>`;

	return new Response(rssFeed, {
		headers: {
			"Content-Type": "application/xml",
			"Cache-Control": "public, max-age=3600", // Cache for 1 hour
		},
	});
}
