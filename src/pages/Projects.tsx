export default function Projects() {
  return (
    <>
      <div className="subpage-wrapper">
        <div className="page-container">
          <div className="section-header fade-up">
            <span className="page-tag">
              <i className="bi bi-grid-3x3-gap-fill"></i> &nbsp;PORTFOLIO
            </span>
            <h1>FEATURED PROJECTS</h1>
            <p>
              Real-world solutions I've built — each tackling a specific IT or
              web challenge.
            </p>
            <div className="header-line"></div>
          </div>

          <div className="project-grid">
            <div className="project-card fade-up">
              <div className="project-thumb project-thumb-blue">
                <i className="bi bi-brain"></i>
              </div>
              <div className="project-body">
                <div className="project-name">Nyvora</div>
                <p className="project-desc">
                  Hệ thống học tập thông minh sử dụng thuật toán Elo Rating và
                  Spaced Repetition giúp tự động điều chỉnh độ khó và cá nhân
                  hóa lộ trình học.
                </p>
                <div className="project-footer">
                  <div className="tech-pills">
                    <span className="tech-pill">Next.js</span>
                    <span className="tech-pill">React</span>
                    <span className="tech-pill">TailwindCSS</span>
                    <span className="tech-pill">TypeScript</span>
                  </div>
                  <a
                    href="https://trminh-learningai.vercel.app/"
                    target="_blank"
                    className="project-link"
                  >
                    <i className="bi bi-box-arrow-up-right"></i> Visit
                  </a>
                </div>
              </div>
            </div>

            <div className="project-card fade-up">
              <div className="project-thumb project-thumb-red">
                <i className="bi bi-heart-fill"></i>
              </div>
              <div className="project-body">
                <div className="project-name">HeartConnect</div>
                <p className="project-desc">
                  A modern brand website with a fully responsive layout,
                  optimized UX, and smooth animations across all devices.
                </p>
                <div className="project-footer">
                  <div className="tech-pills">
                    <span className="tech-pill">HTML5</span>
                    <span className="tech-pill">CSS3</span>
                    <span className="tech-pill">TypeScript</span>
                    <span className="tech-pill">ReactTS</span>
                    <span className="tech-pill">My SQL</span>
                    <span className="tech-pill">Xampp</span>
                  </div>
                  <a
                    href="http://localhost:5173"
                    target="_blank"
                    className="project-link"
                  >
                    <i className="bi bi-box-arrow-up-right"></i> Visit
                  </a>
                </div>
              </div>
            </div>

            <div className="project-card fade-up">
              <div className="project-thumb project-thumb-green">
                <i className="bi bi-ticket-perforated-fill"></i>
              </div>
              <div className="project-body">
                <div className="project-name">
                  IT Ticketing Dashboard{" "}
                  <span style={{ fontSize: "10px", color: "var(--text-dim)" }}>
                    (Coming Soon)
                  </span>
                </div>
                <p className="project-desc">
                  Internal helpdesk dashboard for tracking tickets, SLA metrics,
                  and team performance with real-time updates.
                </p>
                <div className="project-footer">
                  <div className="tech-pills">
                    <span className="tech-pill">ReactJS</span>
                    <span className="tech-pill">NodeJS</span>
                  </div>
                  <span className="project-coming">
                    <i className="bi bi-clock"></i> In Progress
                  </span>
                </div>
              </div>
            </div>

            <div className="project-card fade-up">
              <div className="project-thumb project-thumb-purple">
                <i className="bi bi-hdd-rack-fill"></i>
              </div>
              <div className="project-body">
                <div className="project-name">IT Asset Manager</div>
                <p className="project-desc">
                  Inventory tracking system for hardware assets with role-based
                  access control and audit logging.
                </p>
                <div className="project-footer">
                  <div className="tech-pills">
                    <span className="tech-pill">SQL</span>
                    <span className="tech-pill">Python</span>
                  </div>
                  <span className="project-coming">
                    <i className="bi bi-lock-fill"></i> Private
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
