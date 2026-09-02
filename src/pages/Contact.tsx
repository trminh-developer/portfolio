

export default function Contact() {
  return (
    <>
      <div className="subpage-wrapper">
    <div className="page-container">

      <div className="section-header fade-up">
        <span className="page-tag"><i className="bi bi-envelope-fill"></i> &nbsp;GET IN TOUCH</span>
        <h1>CONTACT</h1>
        <p>Reach out for collaborations, opportunities, or just to say hello.</p>
        <div className="header-line"></div>
      </div>

      <div className="sub-card fade-up" style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div className="contact-grid">

          <div className="contact-item">
            <div className="contact-icon ci-red"><i className="bi bi-geo-alt-fill"></i></div>
            <div>
              <div className="contact-info-label">ADDRESS</div>
              <div className="contact-info-value">Quang Tri, Vietnam</div>
            </div>
          </div>

          <a href="mailto:trminhithelpdesk@outlook.com" className="contact-item">
            <div className="contact-icon ci-amber"><i className="bi bi-envelope-fill"></i></div>
            <div>
              <div className="contact-info-label">EMAIL</div>
                                  <div className="contact-info-value">trminhithelpdesk@outlook.com</div>
            </div>
          </a>

          <a href="tel:0382652732" className="contact-item">
            <div className="contact-icon ci-green"><i className="bi bi-telephone-fill"></i></div>
            <div>
              <div className="contact-info-label">PHONE</div>
              <div className="contact-info-value">0382 652 732</div>
            </div>
          </a>

          <a href="https://www.linkedin.com/in/trminhdev/" target="_blank" className="contact-item">
            <div className="contact-icon ci-blue"><i className="bi bi-linkedin"></i></div>
            <div>
              <div className="contact-info-label">LINKEDIN</div>
              <div className="contact-info-value">trminhdev</div>
            </div>
          </a>

          <a href="https://facebook.com/trminhdev" target="_blank" className="contact-item">
            <div className="contact-icon ci-blue"><i className="bi bi-facebook"></i></div>
            <div>
              <div className="contact-info-label">FACEBOOK</div>
              <div className="contact-info-value">TrMinh</div>
            </div>
          </a>

          <a href="https://www.tiktok.com/@trminh_zz" target="_blank" className="contact-item">
            <div className="contact-icon ci-tiktok">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                <defs>
                  <linearGradient id="tiktokG" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#ff0050' }} />
                    <stop offset="100%" style={{ stopColor: '#00f2ea' }} />
                  </linearGradient>
                </defs>
                <path fill="url(#tiktokG)" d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
              </svg>
            </div>
            <div>
              <div className="contact-info-label">TIKTOK</div>
              <div className="contact-info-value">@trminh_zz</div>
            </div>
          </a>

          <a href="https://github.com/trminh-developer" target="_blank" className="contact-item contact-item-full">
            <div className="contact-icon ci-blue"><i className="bi bi-github"></i></div>
            <div>
              <div className="contact-info-label">GITHUB</div>
              <div className="contact-info-value">github.com/trminh-developer</div>
            </div>
          </a>

        </div>
      </div>

    </div>
  </div>

  
    </>
  );
}
