import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

// Kore links.
// Willow's private-label holders portal, verified live — existing shareholders
// sign in here to view shares, profile and investment history. Kore moved these
// off *.koreconx.com to *.holdersportal.com on Jul 28.
const INVESTOR_LOGIN_URL = "https://willow.holdersportal.com/auth/login";
// Kore's Reg D 506(c) offering page. Andrew is hosting their index.html here;
// it hands off to the KoreInside application flow.
const INVEST_NOW_URL = "/regd/invest";

// Gate in front of the offering page. This runs in the browser, so the password
// ships in the JS bundle and anyone determined can read it — it's a deterrent to
// keep casual visitors and attorneys out, not real access control. Change the
// string here to change the password.
const ACCESS_PASSWORD = "Decacorn";

const Investors = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [password, setPassword] = useState("");
  const [gateError, setGateError] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === ACCESS_PASSWORD) {
      window.location.href = INVEST_NOW_URL;
    } else {
      setGateError(true);
    }
  };

  const closeGate = () => {
    setShowGate(false);
    setPassword("");
    setGateError(false);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setIsSubmitting(true);
    try {
      await supabase.from("form_submissions").insert({
        form_type: "newsletter",
        contact_type: "investor",
        email,
      });
    } catch (err) {
      console.error("Failed to save subscription:", err);
    }
    setEmail("");
    setIsSubmitting(false);
    setSubscribed(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-5 py-32 md:py-40">
        <div className="w-full text-center" style={{ maxWidth: "440px" }}>
          <h1
            className="font-heading mb-4"
            style={{
              fontSize: "clamp(30px, 4vw, 44px)",
              lineHeight: "1.2",
              fontWeight: 300,
              color: "#222222",
            }}
          >
            Investor Relations
          </h1>
          <p
            className="mb-12 mx-auto max-w-[280px] sm:max-w-[440px]"
            style={{
              fontSize: "16px",
              lineHeight: "1.65",
              color: "#5A6570",
            }}
          >
            Access your holdings, review the current round, or{" "}
            <br className="hidden sm:inline" />
            follow along with our monthly updates.
          </p>

          {/* Investor Login */}
          <a
            href={INVESTOR_LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full rounded-md transition-colors hover:bg-[#138F8B]/5"
            style={{
              height: "50px",
              border: "1px solid #138F8B",
              color: "#138F8B",
              fontSize: "15px",
              fontWeight: 500,
            }}
          >
            Investor Login
          </a>

          {/* Invest Now — password gated */}
          <button
            type="button"
            onClick={() => setShowGate(true)}
            className="flex items-center justify-center w-full rounded-md transition-opacity hover:opacity-90 mt-4"
            style={{
              height: "50px",
              backgroundColor: "#138F8B",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 500,
            }}
          >
            Invest Now
          </button>

          {/* Newsletter */}
          <div className="mt-14">
            <p
              className="mb-5"
              style={{ fontSize: "15px", fontWeight: 500, color: "#222222" }}
            >
              Join Our Monthly Updates
            </p>

            {subscribed ? (
              <p style={{ fontSize: "14px", color: "#5A6570" }}>
                Thanks — you're on the list.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-end gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent focus:outline-none transition-colors"
                  style={{
                    // 16px minimum — iOS Safari zooms the page on focus below this.
                    fontSize: "16px",
                    height: "42px",
                    color: "#222222",
                    borderBottom: "1px solid #D4DAE0",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderBottom = "1px solid #138F8B")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderBottom = "1px solid #D4DAE0")
                  }
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="transition-opacity hover:opacity-70 disabled:opacity-40"
                  style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    height: "42px",
                    color: "#138F8B",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {isSubmitting ? "..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Access gate */}
      {showGate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-5"
          style={{ backgroundColor: "rgba(34, 34, 34, 0.45)" }}
          onClick={closeGate}
        >
          <div
            className="w-full bg-white rounded-lg text-center"
            style={{ maxWidth: "380px", padding: "40px 32px 32px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="font-heading mb-3"
              style={{ fontSize: "24px", fontWeight: 400, color: "#222222" }}
            >
              Investor Access
            </h2>
            <p
              className="mb-8 mx-auto"
              style={{ fontSize: "15px", lineHeight: "1.6", color: "#5A6570" }}
            >
              Enter the password to continue to our offering.
            </p>

            <form onSubmit={handleUnlock}>
              <input
                type="password"
                autoFocus
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setGateError(false);
                }}
                className="w-full bg-transparent text-center focus:outline-none mb-2"
                style={{
                  // 16px minimum — iOS Safari zooms the page on focus below this.
                  fontSize: "16px",
                  height: "42px",
                  color: "#222222",
                  borderBottom: `1px solid ${gateError ? "#C0483C" : "#D4DAE0"}`,
                }}
              />
              <p
                className="mb-6"
                style={{
                  fontSize: "13px",
                  height: "18px",
                  color: "#C0483C",
                  visibility: gateError ? "visible" : "hidden",
                }}
              >
                That password isn't right.
              </p>

              <button
                type="submit"
                className="flex items-center justify-center w-full rounded-md transition-opacity hover:opacity-90"
                style={{
                  height: "50px",
                  backgroundColor: "#138F8B",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                Continue
              </button>
              <button
                type="button"
                onClick={closeGate}
                className="mt-4 transition-opacity hover:opacity-70"
                style={{ fontSize: "14px", color: "#8A939C" }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Investors;
