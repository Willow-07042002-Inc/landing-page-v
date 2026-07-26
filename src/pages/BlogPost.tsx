import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllPosts, getPostBySlug, formatDate } from "@/data/blogData";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPostBySlug(slug) : undefined;
  const allPosts = getAllPosts();

  // Related posts: up to 3 other posts, excluding current
  const relatedPosts = allPosts.filter(p => p.slug !== slug).slice(0, 3);

  useEffect(() => {
    if (!post) return;

    // Page title
    document.title = `${post.title} | Willow Blog`;

    // Helper to upsert meta tags
    const upsertMeta = (attrs: Record<string, string>, content: string) => {
      const selector = Object.entries(attrs)
        .map(([k, v]) => `[${k}="${v}"]`)
        .join("");
      let el = document.querySelector(`meta${selector}`);
      if (!el) {
        el = document.createElement("meta");
        Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    upsertMeta({ name: "description" }, post.metaDescription);
    upsertMeta({ name: "robots" }, "index, follow");
    upsertMeta({ property: "og:title" }, post.title);
    upsertMeta({ property: "og:description" }, post.metaDescription);
    upsertMeta({ property: "og:type" }, "article");
    upsertMeta({ property: "og:url" }, `https://www.willow-inc.com/blog/${post.slug}`);
    upsertMeta({ property: "og:site_name" }, "Willow");

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://www.willow-inc.com/blog/${post.slug}`);

    // JSON-LD structured data
    const existingLd = document.getElementById("blog-jsonld");
    if (existingLd) existingLd.remove();
    const script = document.createElement("script");
    script.id = "blog-jsonld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.metaDescription,
      author: { "@type": "Person", name: post.author },
      publisher: {
        "@type": "Organization",
        name: "Willow",
        url: "https://www.willow-inc.com",
      },
      datePublished: post.date,
      mainEntityOfPage: `https://www.willow-inc.com/blog/${post.slug}`,
    });
    document.head.appendChild(script);

    return () => {
      document.title = "Willow";
      document.getElementById("blog-jsonld")?.remove();
    };
  }, [post]);

  // 404 redirect for unknown slugs
  useEffect(() => {
    if (slug && !post) navigate("/blog", { replace: true });
  }, [slug, post, navigate]);

  if (!post) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-grow">
        <article className="pb-20 md:pb-24">

          {/* ── Hero ─────────────────────────────────────────────── */}
          <div
            className="relative w-full flex items-end"
            style={{
              minHeight: "560px",
              backgroundImage: post.coverImage ? `url(${post.coverImage})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "#111",
            }}
          >
            {/* Dark overlay */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.72) 100%)" }}
            />

            {/* Hero content — top padding clears the transparent navbar */}
            <div
              className="relative z-10 w-full mx-auto px-5 md:px-6 text-center"
              style={{ maxWidth: "820px", paddingBottom: "64px", paddingTop: "120px" }}
            >

              {/* Title */}
              <h1
                className="font-heading text-white mb-5 mx-auto"
                style={{
                  fontSize: "clamp(30px, 5vw, 52px)",
                  lineHeight: "1.2",
                  maxWidth: "780px",
                  fontWeight: 300,
                }}
              >
                {post.title}
              </h1>

              {/* Excerpt as subtitle */}
              <p
                className="mx-auto mb-8"
                style={{
                  fontSize: "clamp(15px, 1.8vw, 19px)",
                  lineHeight: "1.55",
                  maxWidth: "600px",
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                {post.excerpt}
              </p>

              {/* Author row */}
              <div className="flex items-center justify-center gap-3">
                <div
                  className="rounded-full overflow-hidden flex-shrink-0"
                  style={{ width: "38px", height: "38px", backgroundColor: "#E8D5E3" }}
                >
                  <img
                    src="/Burlacoff Headshot.svg"
                    alt={post.author}
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: "center 25%",
                      transform: "scale(1.7)",
                      transformOrigin: "center center",
                    }}
                  />
                </div>
                <span className="text-white font-medium" style={{ fontSize: "15px" }}>
                  {post.author}
                </span>
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "15px" }}>|</span>
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px" }}>
                  {formatDate(post.date)}
                </span>
              </div>
            </div>
          </div>
          {/* ── /Hero ────────────────────────────────────────────── */}

          <div className="mx-auto px-5 md:px-6 pt-12" style={{ maxWidth: "720px" }}>
            {/* Article body */}
            <div className="blog-post">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>

            {/* CTA block */}
            <div
              className="blog-cta mt-16 text-center"
              style={{
                background: "#F3F4F6",
                borderRadius: "12px",
                padding: "clamp(32px, 6vw, 48px) clamp(24px, 5vw, 40px)",
              }}
            >
              <h3
                className="font-heading font-bold text-[#222222] mb-3"
                style={{ fontSize: "24px", lineHeight: "1.3" }}
              >
                Ready to modernize your practice?
              </h3>
              <p
                className="text-[#4B5563] mb-7 mx-auto"
                style={{ fontSize: "17px", lineHeight: "1.6", maxWidth: "480px" }}
              >
                See how Willow helps estate planning attorneys lead digital signing ceremonies,
                share documents with families, and build lasting client relationships.
              </p>
              <Link
                to="/request-access"
                className="inline-block text-white font-medium transition-colors cta-button"
                style={{
                  background: "#128F8B",
                  padding: "16px 32px",
                  borderRadius: "6px",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
                onMouseEnter={e =>
                  ((e.currentTarget as HTMLElement).style.background = "#0E7370")
                }
                onMouseLeave={e =>
                  ((e.currentTarget as HTMLElement).style.background = "#128F8B")
                }
              >
                Request Access
              </Link>
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-16">
                <h2
                  className="font-heading font-bold text-[#222222] mb-6"
                  style={{ fontSize: "22px", lineHeight: "1.3" }}
                >
                  Related Posts
                </h2>
                <ul className="flex flex-col gap-3">
                  {relatedPosts.map(rp => (
                    <li key={rp.slug}>
                      <Link
                        to={`/blog/${rp.slug}`}
                        className="flex items-baseline justify-between gap-4 group"
                      >
                        <span
                          className="font-medium text-[#222222] group-hover:text-[#128F8B] transition-colors"
                          style={{ fontSize: "16px", lineHeight: "1.4" }}
                        >
                          {rp.title}
                        </span>
                        <span
                          className="flex-shrink-0 text-[#6B7280]"
                          style={{ fontSize: "13px" }}
                        >
                          {formatDate(rp.date)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
