import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in";

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/admin/", "/api/"],
			},
			{
				userAgent: "Googlebot",
				allow: "/",
				disallow: ["/admin/", "/api/"],
				crawlDelay: 0,
			},
			{
				userAgent: "Googlebot-Image",
				allow: "/",
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
