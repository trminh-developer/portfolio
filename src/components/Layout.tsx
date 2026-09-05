import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import BackgroundCanvas from "./BackgroundCanvas";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);

    // Skill bar animation
    const bars = document.querySelectorAll(".skill-bar-fill");
    if (bars.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const bar = entry.target as HTMLElement;
              const value = bar.getAttribute("data-value");
              if (value) bar.style.width = value + "%";
              observer.unobserve(bar);
            }
          });
        },
        { threshold: 0.3 },
      );
      bars.forEach((bar) => observer.observe(bar));
    }

    // Fade-up animation
    const fadeEls = document.querySelectorAll(".fade-up");
    if (fadeEls.length && "IntersectionObserver" in window) {
      const fadeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).style.animationPlayState =
                "running";
              fadeObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 },
      );

      fadeEls.forEach((el) => {
        (el as HTMLElement).style.animationPlayState = "paused";
        fadeObserver.observe(el);
      });
    }
  }, [location]);

  return (
    <>
      <div className="page-bg"></div>
      <BackgroundCanvas />

      <header className="site-header">
        <NavLink className="brand" to="/">
          <img className="brand-mark" src="/CV.png" alt="Tran Duc Minh" />
          <span className="brand-text">
            <strong>Tran Duc Minh</strong>
            <small>HelpDesk Specialist</small>
          </span>
        </NavLink>

        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`site-nav ${isMenuOpen ? "open" : ""}`}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/experience">Experience</NavLink>
          <NavLink to="/skills">Skills</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>

      <Outlet />

      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} Tran Duc Minh. HelpDesk Specialist & IT
          Support Engineer.
        </p>
      </footer>
    </>
  );
}
