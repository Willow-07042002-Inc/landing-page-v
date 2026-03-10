import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllPosts, formatDate } from "@/data/blogData";
import { supabase } from "@/lib/supabase";

const BlogIndex = () => {
  const posts = getAllPosts();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Ahead of the Curve | Insights for Estate Planning Attorneys";

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const [attrName, attrValue] = attr.split("=");
        el.setAttribute(attrName, attrValue.replace(/['"]/g, ""));
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    setMeta('meta[name="description"]', 'name=description',
      "Practical insights on modernizing your estate planning practice, improving client experience, and growing your firm with technology.");
    setMeta('meta[property="og:title"]', 'property=og:title',
      "Ahead of the Curve | Insights for Estate Planning Attorneys");
    setMeta('meta[property="og:description"]', 'property=og:description',
      "Practical insights on modernizing your estate planning practice.");
    setMeta('meta[property="og:type"]', 'property=og:type', "website");
    setMeta('meta[property="og:url"]', 'property=og:url',
      "https://www.willow-inc.com/blog");

    return () => {
      document.title = "Willow";
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-grow">

        {/* Full-bleed hero — mirrors blog post hero style */}
        <section
          className="relative w-full flex items-center justify-center"
          style={{
            minHeight: "500px",
            paddingTop: "100px",
            paddingBottom: "60px",
            backgroundImage: `url(https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1400&q=80)`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            backgroundColor: "#111",
          }}
        >
          {/* Dark overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.72) 100%)" }}
          />

          {/* Hero text */}
          <div
            className="relative z-10 w-full mx-auto px-5 md:px-6 text-center"
            style={{ maxWidth: "820px" }}
          >
            <h1
              className="font-heading text-white mb-5 mx-auto"
              style={{ fontSize: "clamp(32px, 5vw, 58px)", lineHeight: "1.2", maxWidth: "780px", fontWeight: 300 }}
            >
              Ahead of the Curve
            </h1>
            <p
              className="text-white/80 mx-auto mb-8"
              style={{ fontSize: "clamp(16px, 2vw, 20px)", lineHeight: "1.65", maxWidth: "560px" }}
            >
              Insights for estate planning attorneys navigating a changing industry.
            </p>

            {/* Email subscribe */}
            <form
              className="flex gap-3 mx-auto"
              style={{ maxWidth: "480px" }}
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newsletterEmail || !newsletterEmail.includes("@")) return;
                setIsSubmitting(true);
                try {
                  await supabase.from('form_submissions').insert({
                    form_type: 'newsletter',
                    contact_type: 'consumer',
                    email: newsletterEmail,
                  });
                } catch (err) {
                  console.error("Failed to save subscription:", err);
                }
                setNewsletterEmail("");
                setIsSubmitting(false);
              }}
            >
              <input
                type="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-transparent border border-white/40 text-white placeholder-white/50 px-4 rounded-md focus:outline-none focus:border-white/80 transition-colors"
                style={{ fontSize: "14px", height: "42px" }}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 font-medium rounded-md transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "#128F8B",
                  color: "#fff",
                  fontSize: "14px",
                  height: "42px",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {isSubmitting ? "..." : "Subscribe"}
              </button>
            </form>
          </div>
        </section>

        {/* Post list */}
        <section className="py-16 md:py-20">
          <div className="mx-auto px-5 md:px-6" style={{ maxWidth: "720px" }}>
            <div className="flex flex-col gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="block group"
                >
                  <article
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 transition-shadow duration-200 group-hover:shadow-md"
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
                  >
                    {/* Cover image */}
                    {post.coverImage && (
                      <div className="overflow-hidden" style={{ height: "220px" }}>
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      </div>
                    )}

                    {/* Card body */}
                    <div style={{ padding: "28px 32px 32px" }}>
                      {/* Title */}
                      <h2
                        className="font-heading font-bold text-[#222222] mb-4 group-hover:text-[#128F8B] transition-colors"
                        style={{ fontSize: "22px", lineHeight: "1.35" }}
                      >
                        {post.title}
                      </h2>

                      {/* Author row */}
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="rounded-full overflow-hidden flex-shrink-0"
                          style={{ width: "34px", height: "34px", backgroundColor: "#E8D5E3" }}
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
                        <div className="flex flex-col gap-0.5">
                          <span
                            className="font-medium text-[#222222]"
                            style={{ fontSize: "14px", lineHeight: "1.3" }}
                          >
                            {post.author}
                          </span>
                          <span
                            className="text-[#9CA3AF]"
                            style={{ fontSize: "12px", lineHeight: "1.3" }}
                          >
                            {formatDate(post.date)}
                          </span>
                        </div>
                      </div>

                      {/* Excerpt */}
                      <p
                        className="text-[#4B5563] mb-5"
                        style={{ fontSize: "16px", lineHeight: "1.65" }}
                      >
                        {post.excerpt}
                      </p>

                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default BlogIndex;
