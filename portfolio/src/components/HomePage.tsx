"use client";

import { useState, useEffect } from "react";
import {
  VARSHA_PHOTO,
  HERO_SLIDES,
  NAV_LINKS,
  SERVICES,
  STATS,
  CONTACT_LINKS,
  FOOTER_LINKS,
} from "@/data/site";
import { yt, ytUrl } from "@/lib/youtube";
import type { DisplayProject } from "@/types/project";

type HomePageProps = {
  projects: DisplayProject[];
};

export default function HomePage({ projects }: HomePageProps) {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroFading, setHeroFading] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroFading(true);
      setTimeout(() => {
        setHeroSlide((s) => (s + 1) % HERO_SLIDES.length);
        setHeroFading(false);
      }, 500);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setHeroFading(true);
    setTimeout(() => {
      setHeroSlide(index);
      setHeroFading(false);
    }, 400);
  };

  return (
    <div className="mih-root">
      <nav className={`mih-nav${scrollY > 40 ? " scrolled" : ""}`}>
        <a href="#" className="mih-nav-logo">
          Make It Here.
        </a>

        <div className="mih-nav-links">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="mih-nav-link"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a href="mailto:makeitherebyvarsha@gmail.com" className="mih-nav-link mih-nav-email">
          makeitherebyvarsha@gmail.com
        </a>

        <button
          className="mih-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span style={{ transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
          <span style={{ transform: menuOpen ? "scaleX(0)" : "none" }} />
          <span style={{ transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
        </button>
      </nav>

      {menuOpen && (
        <div className="mih-mobile-menu">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="mih-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

      <section className="mih-hero">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={i}
            className="mih-hero-bg"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url("${slide.src}")`,
              transform: `translateY(${scrollY * 0.2}px)`,
              opacity: i === heroSlide ? (heroFading ? 0 : 1) : 0,
              transition: "opacity 0.6s ease",
              zIndex: 0,
            }}
          />
        ))}

        {HERO_SLIDES[heroSlide].label && (
          <div className="mih-hero-slide-label" style={{ opacity: heroFading ? 0 : 1 }}>
            {HERO_SLIDES[heroSlide].label}
          </div>
        )}

        <div className="mih-hero-dots">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="mih-hero-dot"
              style={{
                width: i === heroSlide ? "20px" : "6px",
                backgroundColor: i === heroSlide ? "var(--accent)" : "var(--border)",
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="mih-hero-overlay" />
        <div className="mih-hero-watermark">26</div>

        <div className="mih-hero-content">
          <h1 className="mih-hero-h1" style={{ color: "var(--brand)" }}>
            Make It
            <br />
            <span style={{ color: "var(--accent)" }}>Here.</span>
          </h1>

          <div className="mih-hero-body">
            <p className="mih-hero-p">
              Video content studio by Varsha — creating brand films, campaigns, and stories for
              India&apos;s most ambitious companies across beauty, finance, healthcare, and food.
            </p>
            <div className="mih-hero-actions">
              <a href="#work" className="mih-btn-outline">
                View Work
              </a>
              <a
                href="https://www.youtube.com/watch?v=OSSOWGKYsc4&t=23s"
                target="_blank"
                rel="noopener noreferrer"
                className="mih-link-ghost"
              >
                Watch Showreel ↗
              </a>
            </div>
          </div>

          <div className="mih-scroll-indicator">
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "var(--muted-foreground)",
              }}
            >
              Scroll
            </span>
            <div
              style={{
                width: "1px",
                height: "48px",
                overflow: "hidden",
                backgroundColor: "var(--border)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "var(--accent)",
                  animation: "slideDown 1.4s linear infinite",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mih-grid">
        <a
          href={ytUrl("RAdw_jCDAjs")}
          target="_blank"
          rel="noopener noreferrer"
          className="mih-grid-cell mih-grid-main"
        >
          <img src={yt("RAdw_jCDAjs")} alt="Beauty & Lifestyle" style={{ filter: "grayscale(50%)" }} />
        </a>

        <a
          href={ytUrl("Q7cLYdVysyY")}
          target="_blank"
          rel="noopener noreferrer"
          className="mih-grid-cell mih-grid-tr"
        >
          <img src={yt("Q7cLYdVysyY")} alt="ICICI Bank" style={{ filter: "grayscale(50%)" }} />
        </a>

        <div className="mih-grid-cell mih-grid-tall">
          <img src={VARSHA_PHOTO} alt="Varsha — Make It Here" style={{ filter: "grayscale(25%)" }} />
        </div>

        <a
          href={ytUrl("d_irGzgCALc")}
          target="_blank"
          rel="noopener noreferrer"
          className="mih-grid-cell mih-grid-br"
        >
          <img src={yt("d_irGzgCALc")} alt="Pro-bono" style={{ filter: "grayscale(60%)" }} />
        </a>

        <div className="mih-grid-accent mih-grid-bl">
          <p>
            Stories that
            <br />
            move people.
          </p>
        </div>

        <div className="mih-grid-overlay mih-grid-bc">
          <img src={yt("KCcEEo3-8QA")} alt="Foods" />
          <div className="mih-grid-overlay-text">
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.6rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                Your Story
                <br />
                Made by
              </p>
              <p
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#fff",
                  margin: 0,
                }}
              >
                Make It Here.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mih-section">
        <div className="mih-about-grid">
          <div>
            <span className="mih-about-label">— About</span>
          </div>
          <div>
            <h2 className="mih-about-quote">
              Great brands are built on great stories. I make sure yours gets told.
            </h2>
            <p className="mih-about-p">
              Make It Here is a video content studio founded by Varsha. We create brand films,
              digital campaigns, and social content for companies that want to cut through the noise.
              From India&apos;s leading banks to healthcare groups, beauty brands, and food companies
              — we&apos;ve told stories that matter, at scale.
            </p>
          </div>
          <div className="mih-stats">
            {STATS.map(({ n, l }) => (
              <div key={l}>
                <div className="mih-stat-num">{n}</div>
                <div className="mih-stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mih-divider" />

      <section id="work" className="mih-section">
        <div className="mih-section-header">
          <h2 className="mih-section-h2">
            Selected
            <br />
            Work
          </h2>
          <a
            href="https://www.youtube.com/watch?v=OSSOWGKYsc4&t=23s"
            target="_blank"
            rel="noopener noreferrer"
            className="mih-showreel-link"
          >
            Full showreel ↗
          </a>
        </div>

        <div>
          {projects.map((item, i) => (
            <div key={item.id}>
              <div
                className="mih-work-row"
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                style={{
                  borderBottom:
                    i === projects.length - 1 && expanded !== item.id ? "1px solid var(--border)" : "none",
                }}
              >
                <div className="mih-work-row-inner">
                  <div className="mih-work-row-top">
                    <span className="mih-work-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mih-work-client">{item.client}</span>
                    <div className="mih-work-meta">
                      <span className="mih-work-year">{item.year}</span>
                      <span
                        className="mih-work-toggle"
                        style={{ transform: expanded === item.id ? "rotate(45deg)" : "rotate(0deg)" }}
                      >
                        +
                      </span>
                    </div>
                  </div>
                  <span
                    className="mih-work-cat"
                    style={{ color: expanded === item.id ? "var(--accent)" : "var(--muted-foreground)" }}
                  >
                    {item.category}
                  </span>
                </div>
              </div>

              {expanded === item.id && (
                <div className="mih-work-expanded">
                  {item.videos.map(({ id, label }) => (
                    <a
                      key={id}
                      href={ytUrl(id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mih-video-card"
                    >
                      <div className="mih-video-thumb">
                        <img src={yt(id)} alt={label} />
                      </div>
                      <div className="mih-video-meta">
                        <span className="mih-video-label">{label}</span>
                        <span className="mih-video-watch">Watch ↗</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="mih-section-bg">
        <div className="mih-section-bg-inner">
          <div className="mih-section-header">
            <h2 className="mih-section-h2">Services</h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: "0.88rem",
                color: "var(--muted-foreground)",
                maxWidth: "240px",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Available for brand, digital, and social video projects.
            </p>
          </div>
          <div className="mih-services-grid">
            {SERVICES.map(({ no, title, desc }) => (
              <div key={no} className="mih-service-card">
                <div className="mih-service-no">{no}</div>
                <h3 className="mih-service-title">{title}</h3>
                <p className="mih-service-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mih-contact">
        <div className="mih-contact-inner">
          <div className="mih-contact-top">
            <h2 className="mih-contact-h2" style={{ color: "var(--background)" }}>
              Let&apos;s Make
              <br />
              <span style={{ color: "var(--accent)" }}>Something.</span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "300px" }}>
              <p className="mih-contact-p">
                Available for brand films, campaigns, and social content. Reach out and let&apos;s
                talk about your project.
              </p>
              <div className="mih-contact-links">
                {CONTACT_LINKS.map(({ label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="mih-contact-link"
                  >
                    <span className="mih-contact-link-label">{label}</span>
                    <span className="mih-contact-link-value">{value}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div>
            <a href="mailto:makeitherebyvarsha@gmail.com" className="mih-btn-solid">
              Start a conversation
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7h12M8 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <footer className="mih-footer">
        <div className="mih-footer-logo">Make It Here. — by Varsha</div>
        <div className="mih-footer-links">
          {FOOTER_LINKS.map(({ l, h }) => (
            <a
              key={l}
              href={h}
              target={h.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="mih-footer-link"
            >
              {l}
            </a>
          ))}
        </div>
        <p className="mih-footer-copy">© 2026 Make It Here</p>
      </footer>
    </div>
  );
}
