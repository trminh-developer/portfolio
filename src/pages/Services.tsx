export default function Services() {
  return (
    <>
      <div className="subpage-wrapper">
        <div className="page-container">
          <div className="section-header fade-up">
            <span className="page-tag">
              <i className="bi bi-gear-fill"></i> &nbsp;<h1>SERVICES</h1>
            </span>
            <p>Các dịch vụ IT và phần mềm tôi cung cấp.</p>
            <div className="header-line"></div>
          </div>

          <div className="project-grid">
            <div className="project-card fade-up">
              <div className="project-thumb project-thumb-blue">
                <i className="bi bi-microsoft"></i>
              </div>
              <div className="project-body">
                <div className="project-name">Cài đặt Microsoft 365</div>
                <p className="project-desc">
                  Nhận cài đặt Microsoft 365 Office. Hỗ trợ kích hoạt và thiết
                  lập bộ ứng dụng văn phòng đầy đủ tính năng.
                </p>
                <div className="project-footer">
                  <div className="tech-pills">
                    <span className="tech-pill">Office 365</span>
                    <span className="tech-pill">Windows</span>
                    <span className="tech-pill">MacOS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
