import { Link } from "react-router-dom";



export default function Home() {
  
  return (
    <main id="home">
      <>
        <section className="hero section-card">
          <div className="hero-copy">
            <p className="eyebrow">Hi, I&apos;m Minh 👋</p>
            <h1>HelpDesk Specialist & IT Support Engineer</h1>
            <p className="lead">
              I help teams keep systems running smoothly with fast, empathetic
              support and a strong technical foundation across IT operations,
              customer experience, and process improvement.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/contact">
                Get in touch
              </Link>
              <Link className="btn btn-secondary" to="/experience">
                View experience
              </Link>
            </div>
            <div className="hero-socials">
              <a
                href="https://github.com/trminh-developer"
                target="_blank"
                aria-label="GitHub"
              >
                <i className="bi bi-github"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/trminhdev/"
                target="_blank"
                aria-label="LinkedIn"
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="mailto:trminhithelpdesk@outlook.com" aria-label="Email">
                <i className="bi bi-envelope-fill"></i>
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-card">
              <img src="/CV.png" alt="Tran Duc Minh" />
            </div>
            <div className="hero-metrics">
              <div>
                <strong>98.4%</strong>
                <span>CSAT score</span>
              </div>
              <div>
                <strong>12,400+</strong>
                <span>Tickets resolved</span>
              </div>
              <div>
                <strong>5+</strong>
                <span>Years experience</span>
              </div>
            </div>
          </div>
        </section>
      </>
    </main>
  );
}
