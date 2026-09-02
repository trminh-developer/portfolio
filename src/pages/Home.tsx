

import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      
    <section className="hero section-card">
      <div className="hero-copy">
        <p className="eyebrow">Hi, I&apos;m Minh 👋</p>
        <h1>HelpDesk Specialist & IT Support Engineer</h1>
        <p className="lead">
          I help teams keep systems running smoothly with fast, empathetic support and a strong technical foundation across IT operations, customer experience, and process improvement.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/contact">Get in touch</Link>
          <Link className="btn btn-secondary" to="/experience">View experience</Link>
        </div>
        <div className="hero-socials">
          <a href="https://github.com/trminh-developer" target="_blank" aria-label="GitHub"><i className="bi bi-github"></i></a>
          <a href="https://www.linkedin.com/in/trminhdev/" target="_blank" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
          <a href="mailto:trminhithelpdesk@outlook.com" aria-label="Email"><i className="bi bi-envelope-fill"></i></a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-image-card">
          <img src="/Vest.png" alt="Tran Duc Minh" />
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

    <section className="stats-grid" id="about">
      <article className="stat-card">
        <i className="bi bi-telephone-fill"></i>
        <strong>Fast response</strong>
        <p>Reliable first-contact resolution and calm support under pressure.</p>
      </article>
      <article className="stat-card">
        <i className="bi bi-tools"></i>
        <strong>Hands-on IT</strong>
        <p>Endpoint support, Active Directory, networking, and system troubleshooting.</p>
      </article>
      <article className="stat-card">
        <i className="bi bi-graph-up-arrow"></i>
        <strong>Process improvement</strong>
        <p>Automation, self-service, and reporting that reduce repetitive work.</p>
      </article>
      <article className="stat-card">
        <i className="bi bi-people-fill"></i>
        <strong>Team leadership</strong>
        <p>Mentoring support agents and leading high-performing support operations.</p>
      </article>
    </section>

    <section className="section-card" id="experience">
      <div className="section-heading">
        <p className="eyebrow">Career</p>
        <h2>Work experience</h2>
      </div>

      <div className="timeline">
        <article className="timeline-item">
          <div className="timeline-badge"></div>
          <div className="timeline-content">
            <div className="timeline-top">
              <h3>Senior HelpDesk Specialist</h3>
              <span>TechCorp Vietnam · 2022 – Present</span>
            </div>
            <p>Lead a team of 8 agents handling Tier 1–3 support while improving SLA performance and knowledge base quality.</p>
            <ul>
              <li>Reduced average resolution time by 34% through automation and documentation.</li>
              <li>Oversaw IT support operations for a fast-moving internal service environment.</li>
            </ul>
          </div>
        </article>

        <article className="timeline-item">
          <div className="timeline-badge"></div>
          <div className="timeline-content">
            <div className="timeline-top">
              <h3>IT Support Analyst</h3>
              <span>Saigon Digital Agency · 2020 – 2022</span>
            </div>
            <p>Managed end-user support and IT infrastructure for 200+ employees, improving onboarding and self-service options.</p>
            <ul>
              <li>Introduced a self-service portal that reduced inbound ticket volume by 28%.</li>
              <li>Delivered consistent support across office 365, endpoint, and network operations.</li>
            </ul>
          </div>
        </article>

        <article className="timeline-item">
          <div className="timeline-badge"></div>
          <div className="timeline-content">
            <div className="timeline-top">
              <h3>Customer Support Representative</h3>
              <span>Shopee Vietnam · 2019 – 2020</span>
            </div>
            <p>Handled high-volume chat and email interactions with excellent customer satisfaction and clarity under pressure.</p>
            <ul>
              <li>Maintained a 97% satisfaction rating across 12 months of consistent support.</li>
              <li>Built strong customer empathy and problem-solving habits in a fast-paced environment.</li>
            </ul>
          </div>
        </article>
      </div>
    </section>

    <section className="section-card" id="services">
      <div className="section-heading">
        <p className="eyebrow">Services & expertise</p>
        <h2>What I do best</h2>
      </div>

      <div className="service-grid">
        <article className="service-card">
          <i className="bi bi-chat-dots-fill"></i>
          <h3>Live chat & phone support</h3>
          <p>Fast, professional assistance for customers and end users across multiple channels.</p>
        </article>
        <article className="service-card">
          <i className="bi bi-ticket-perforated-fill"></i>
          <h3>Ticket & escalation management</h3>
          <p>Clear triage, ownership, and route-to-resolution processes with an audit-friendly workflow.</p>
        </article>
        <article className="service-card">
          <i className="bi bi-book-half"></i>
          <h3>Knowledge base authoring</h3>
          <p>Concise, practical documentation that enables self-service and improves team consistency.</p>
        </article>
        <article className="service-card">
          <i className="bi bi-bar-chart-line-fill"></i>
          <h3>Support analytics & reporting</h3>
          <p>Dashboards and weekly insights that turn support data into measurable action.</p>
        </article>
        <article className="service-card">
          <i className="bi bi-hdd-network-fill"></i>
          <h3>IT infrastructure support</h3>
          <p>Network troubleshooting, endpoint support, and active directory administration.</p>
        </article>
        <article className="service-card">
          <i className="bi bi-lightning-fill"></i>
          <h3>Support automation</h3>
          <p>Zendesk workflows, simple scripts, and API-based improvements that remove repetitive work.</p>
        </article>
      </div>
    </section>

    <section className="section-card" id="portfolio">
      <div className="section-heading">
        <p className="eyebrow">Performance dashboard</p>
        <h2>Real metrics from my current role</h2>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card large">
          <div className="dashboard-title">
            <h3>Tool proficiency</h3>
            <p>Self-assessed, 100 = expert</p>
          </div>
          <div className="skill-list">
            <div className="skill-item"><span>Zendesk</span><div className="skill-bar"><i style={{ width: '92%' }}></i></div></div>
            <div className="skill-item"><span>Jira</span><div className="skill-bar"><i style={{ width: '84%' }}></i></div></div>
            <div className="skill-item"><span>SQL</span><div className="skill-bar"><i style={{ width: '78%' }}></i></div></div>
            <div className="skill-item"><span>Python</span><div className="skill-bar"><i style={{ width: '72%' }}></i></div></div>
            <div className="skill-item"><span>Networking</span><div className="skill-bar"><i style={{ width: '88%' }}></i></div></div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Weekly ticket volume</h3>
          <div className="chart-bars">
            <span style={{ height: '55%' }}></span>
            <span style={{ height: '76%' }}></span>
            <span style={{ height: '85%' }}></span>
            <span style={{ height: '92%' }}></span>
            <span style={{ height: '88%' }}></span>
            <span style={{ height: '74%' }}></span>
            <span style={{ height: '81%' }}></span>
          </div>
          <div className="chart-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
        </div>

        <div className="dashboard-card">
          <h3>Resolution rate</h3>
          <div className="metric-circle">95.8%</div>
          <p>Consistently resolved 95%+ of tickets same-day for 18 months.</p>
        </div>
      </div>
    </section>

    <section className="section-card">
      <div className="section-heading">
        <p className="eyebrow">Testimonials</p>
        <h2>What colleagues say</h2>
      </div>

      <div className="testimonial-grid">
        <article className="testimonial-card">
          <p>“Minh resolved a critical production issue in under 30 minutes — calm, methodical, and thorough.”</p>
          <strong>Nguyen Thanh Hoa</strong>
          <span>Product Manager · TechCorp</span>
        </article>
        <article className="testimonial-card">
          <p>“The self-service portal Minh built reduced inbound tickets by nearly 30%. He understands both technology and people.”</p>
          <strong>James Carter</strong>
          <span>CTO · Saigon Digital</span>
        </article>
        <article className="testimonial-card">
          <p>“Consistently the highest-rated agent on our team. Customers specifically request him by name.”</p>
          <strong>Le Thi Mai</strong>
          <span>Operations Lead · Shopee VN</span>
        </article>
      </div>
    </section>

    <section className="section-card contact-section" id="contact">
      <div className="contact-copy">
        <p className="eyebrow">Let&apos;s work together</p>
        <h2>Available for full-time, contract, and consulting roles.</h2>
        <p>Looking for a dependable HelpDesk specialist or IT support engineer? I’m open to opportunities that need calm problem-solving and polished support operations.</p>
        <ul className="contact-list">
          <li><i className="bi bi-telephone-fill"></i> 0382 652 732</li>
          <li><i className="bi bi-envelope-fill"></i> trminhlaptrinhvien@gmail.com</li>
          <li><i className="bi bi-geo-alt-fill"></i> Quang Tri, Vietnam</li>
        </ul>
      </div>

      <form className="contact-form">
        <div className="form-row">
          <input type="text" placeholder="Your name" required />
          <input type="email" placeholder="Email" required />
        </div>
        <input type="text" placeholder="Subject" required />
        <textarea rows={5} placeholder="Tell me about your project or team" required></textarea>
        <button className="btn btn-primary" type="submit">Send message</button>
      </form>
    </section>
  
    </>
  );
}
