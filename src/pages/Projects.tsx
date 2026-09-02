

export default function Projects() {
  return (
    <>
      <div className="subpage-wrapper">
    <div className="page-container">

      <div className="section-header fade-up">
        <span className="page-tag"><i className="bi bi-grid-3x3-gap-fill"></i> &nbsp;PORTFOLIO</span>
        <h1>FEATURED PROJECTS</h1>
        <p>Real-world solutions I've built — each tackling a specific IT or web challenge.</p>
        <div className="header-line"></div>
      </div>

      <div className="project-grid">

        <div className="project-card fade-up">
          <div className="project-thumb project-thumb-blue">
            <i className="bi bi-cpu-fill"></i>
          </div>
          <div className="project-body">
            <div className="project-name">NovaTech</div>
            <p className="project-desc">
              A modern brand website with a fully responsive layout, optimized UX, and smooth animations across all devices.
            </p>
            <div className="project-footer">
              <div className="tech-pills">
                <span className="tech-pill">HTML5</span>
                <span className="tech-pill">CSS3</span>
                <span className="tech-pill">JavaScript</span>
              </div>
              <a href="https://trminh-developer.github.io/technology/main/index.html" target="_blank" className="project-link">
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
            <div className="project-name">IT Ticketing Dashboard <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>(Coming Soon)</span></div>
            <p className="project-desc">
              Internal helpdesk dashboard for tracking tickets, SLA metrics, and team performance with real-time updates.
            </p>
            <div className="project-footer">
              <div className="tech-pills">
                <span className="tech-pill">ReactJS</span>
                <span className="tech-pill">NodeJS</span>
              </div>
              <span className="project-coming"><i className="bi bi-clock"></i> In Progress</span>
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
              Inventory tracking system for hardware assets with role-based access control and audit logging.
            </p>
            <div className="project-footer">
              <div className="tech-pills">
                <span className="tech-pill">SQL</span>
                <span className="tech-pill">Python</span>
              </div>
              <span className="project-coming"><i className="bi bi-lock-fill"></i> Private</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  
    </>
  );
}
