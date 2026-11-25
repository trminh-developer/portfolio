import { Link } from 'react-router-dom';
import { navigation } from './navigation';

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="site-footer" aria-label="Thông tin cuối trang">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-intro">
            <Link className="site-footer-brand" to="/" aria-label="TrMinh, trang chủ">
              <svg className="site-footer-terminal" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path d="m4 8 7 6-7 6M14 21h9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>TrMinh<span className="site-footer-brand-dot">.dev</span></span>
            </Link>
            <p>Không gian cá nhân về IT Support, HelpDesk và những dự án web mình đang xây dựng.</p>
          </div>
          <div className="site-footer-links">
            <h2>ĐIỀU HƯỚNG</h2>
            {navigation.map(({ to, label }) => <Link key={to} to={to}>{label}</Link>)}
          </div>
          <div className="site-footer-social">
            <h2>ĐÃ KẾT NỐI</h2>
            <div className="site-footer-social-list">
              <a href="https://github.com/trminh-developer" target="_blank" rel="noopener noreferrer" aria-label="GitHub TrMinh">
                <i className="bi bi-github" aria-hidden="true" />
              </a>
              <a href="https://www.linkedin.com/in/trminhdev/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn TrMinh">
                <i className="bi bi-linkedin" aria-hidden="true" />
              </a>
              <a href="mailto:trminhithelpdesk@outlook.com" aria-label="Email TrMinh">
                <i className="bi bi-envelope" aria-hidden="true" />
              </a>
            </div>
            <p className="site-footer-social-note">Theo dõi những dự án và hình ảnh mới nhất.</p>
          </div>
        </div>
        <div className="site-footer-bottom">
          <p>© <span id="year">{new Date().getFullYear()}</span> TrMinh · Trần Đức Minh. Mọi quyền được bảo lưu.</p>
          <a className="site-footer-top" href="#page-top">
            <span>Trở lại đầu trang</span><i className="bi bi-arrow-up" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
