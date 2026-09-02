

export default function Skills() {
  return (
    <>
      <div className="subpage-wrapper">
    <div className="page-container">

      <div className="section-header fade-up">
        <span className="page-tag"><i className="bi bi-cpu-fill"></i> &nbsp;CAPABILITIES</span>
        <h1>SKILLS &amp; EXPERTISE</h1>
        <p>A full breakdown of my technical and professional competencies.</p>
        <div className="header-line"></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        <div>
          <div className="sub-card fade-up">
            <div className="skill-group-title"><i className="bi bi-tools"></i> IT Support &amp; Helpdesk</div>
            <div className="skill-tags">
              <span className="skill-tag"><i className="bi bi-headset"></i> Helpdesk Support (Tier 1-3)</span>
              <span className="skill-tag"><i className="bi bi-pc-display"></i> Hardware &amp; Software Troubleshooting</span>
              <span className="skill-tag"><i className="bi bi-ticket-perforated-fill"></i> Ticketing Systems (Zendesk/Jira)</span>
              <span className="skill-tag"><i className="bi bi-window-desktop"></i> Remote Desktop Support</span>
              <span className="skill-tag"><i className="bi bi-person-fill-gear"></i> Active Directory</span>
              <span className="skill-tag"><i className="bi bi-box-seam-fill"></i> IT Asset Management</span>
            </div>

            <div className="skill-group-title"><i className="bi bi-hdd-network-fill"></i> Infrastructure &amp; Networking</div>
            <div className="skill-tags">
              <span className="skill-tag"><i className="bi bi-router-fill"></i> Network Administration</span>
              <span className="skill-tag"><i className="bi bi-cloud-fill"></i> Cloud (M365 / Google Workspace)</span>
              <span className="skill-tag"><i className="bi bi-disc-fill"></i> OS Deployment (Windows/Linux)</span>
              <span className="skill-tag"><i className="bi bi-hdd-rack-fill"></i> Hardware Maintenance</span>
              <span className="skill-tag"><i className="bi bi-shield-check"></i> Endpoint Security</span>
            </div>

            <div className="skill-group-title"><i className="bi bi-code-slash"></i> Tools &amp; Automation</div>
            <div className="skill-tags">
              <span className="skill-tag"><i className="bi bi-terminal-fill"></i> PowerShell / Scripting</span>
              <span className="skill-tag"><i className="bi bi-c-square"></i> C++</span>
              <span className="skill-tag"><i className="bi bi-filetype-py"></i> Python</span>
              <span className="skill-tag"><i className="bi bi-database-fill"></i> SQL Server / MySQL</span>
              <span className="skill-tag"><i className="bi bi-filetype-html"></i> HTML / CSS / JS</span>
              <span className="skill-tag"><i className="bi bi-filetype-tsx"></i> TypeScript</span>
              <span className="skill-tag"><i className="bi bi-diagram-3-fill"></i> Process Improvement</span>
            </div>
          </div>
        </div>

        <div>
          <div className="sub-card fade-up">
            <div className="skill-group-title"><i className="bi bi-activity"></i> Proficiency Levels</div>

            <div className="skill-bar-item">
              <div className="skill-bar-label"><span>Hardware &amp; Software Troubleshooting</span><span>92%</span></div>
              <div className="skill-bar-track"><div className="skill-bar-fill" data-value="92"></div></div>
            </div>
            <div className="skill-bar-item">
              <div className="skill-bar-label"><span>Network Administration</span><span>88%</span></div>
              <div className="skill-bar-track"><div className="skill-bar-fill" data-value="88"></div></div>
            </div>
            <div className="skill-bar-item">
              <div className="skill-bar-label"><span>Cloud (M365 / Google Workspace)</span><span>85%</span></div>
              <div className="skill-bar-track"><div className="skill-bar-fill" data-value="85"></div></div>
            </div>
            <div className="skill-bar-item">
              <div className="skill-bar-label"><span>Ticketing Systems</span><span>95%</span></div>
              <div className="skill-bar-track"><div className="skill-bar-fill" data-value="95"></div></div>
            </div>
            <div className="skill-bar-item">
              <div className="skill-bar-label"><span>Active Directory</span><span>82%</span></div>
              <div className="skill-bar-track"><div className="skill-bar-fill" data-value="82"></div></div>
            </div>
            <div className="skill-bar-item">
              <div className="skill-bar-label"><span>OS Deployment</span><span>80%</span></div>
              <div className="skill-bar-track"><div className="skill-bar-fill" data-value="80"></div></div>
            </div>
            <div className="skill-bar-item">
              <div className="skill-bar-label"><span>Scripting (PowerShell/Python)</span><span>75%</span></div>
              <div className="skill-bar-track"><div className="skill-bar-fill" data-value="75"></div></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  
    </>
  );
}
