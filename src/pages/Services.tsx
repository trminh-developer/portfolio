export default function Services() {
  return (
    <>
      <div className="subpage-wrapper">
        <div className="page-container">
          <div className="section-header fade-up">
            <h1>SERVICES</h1>
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
                    {/* <span className="tech-pill">MacOS</span> */}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="project-card fade-up">
              <div className="project-thumb project-thumb-purple">
                <i className="bi bi-palette"></i>
              </div>
              <div className="project-body">
                <div className="project-name">Design Web UI/UX</div>
                <p className="project-desc">
                  Nhận thiết kế giao diện Web UI/UX hiện đại, sáng tạo, có sử dụng Canvas để tạo các hiệu ứng hình ảnh động và tương tác độc đáo.
                </p>
                <div className="project-footer">
                  <div className="tech-pills">
                    <span className="tech-pill">UI/UX</span>
                    <span className="tech-pill">Canvas</span>
                    <span className="tech-pill">Figma</span>
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
