import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;

    setIsSubmitting(true);
    setFormStatus("idle");

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_id",
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_id",
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "public_key",
      )
      .then(
        () => {
          setFormStatus("success");
          form.current?.reset();
        },
        (error) => {
          console.error("FAILED...", error.text);
          setFormStatus("error");
        },
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

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

          <div className="contact-page-grid">
          <div className="sub-card fade-up">
            <div className="contact-grid">
              <div className="contact-item">
                <div className="contact-icon ci-sky"><i className="bi bi-geo-alt-fill"></i></div>
                <div>
                  <div className="contact-info-label">ADDRESS</div>
                  <div className="contact-info-value">Quang Tri, Vietnam</div>
                </div>
              </div>

              <a href="mailto:trminhithelpdesk@outlook.com" className="contact-item">
                <div className="contact-icon ci-sky"><i className="bi bi-envelope-fill"></i></div>
                <div>
                  <div className="contact-info-label">EMAIL</div>
                  <div className="contact-info-value">trminhithelpdesk@outlook.com</div>
                </div>
              </a>

              <a href="tel:0382652732" className="contact-item">
                <div className="contact-icon ci-sky"><i className="bi bi-telephone-fill"></i></div>
                <div>
                  <div className="contact-info-label">PHONE</div>
                  <div className="contact-info-value">0382 652 732</div>
                </div>
              </a>

              <a href="https://www.linkedin.com/in/trminhdev/" target="_blank" rel="noopener noreferrer" className="contact-item">
                <div className="contact-icon ci-sky"><i className="bi bi-linkedin"></i></div>
                <div>
                  <div className="contact-info-label">LINKEDIN</div>
                  <div className="contact-info-value">trminhdev</div>
                </div>
              </a>

              <a href="https://facebook.com/trminhdev" target="_blank" rel="noopener noreferrer" className="contact-item">
                <div className="contact-icon ci-sky"><i className="bi bi-facebook"></i></div>
                <div>
                  <div className="contact-info-label">FACEBOOK</div>
                  <div className="contact-info-value">TrMinh</div>
                </div>
              </a>

              <a href="https://zalo.me/0382652732" target="_blank" rel="noopener noreferrer" className="contact-item">
                <div className="contact-icon ci-sky">
                  <span style={{ fontWeight: 800, fontSize: '13px', letterSpacing: '0.5px' }}>Zalo</span>
                </div>
                <div>
                  <div className="contact-info-label">ZALO</div>
                  <div className="contact-info-value">0382 652 732</div>
                </div>
              </a>

              <a href="https://github.com/trminh-developer" target="_blank" rel="noopener noreferrer" className="contact-item contact-item-full">
                <div className="contact-icon ci-sky"><i className="bi bi-github"></i></div>
                <div>
                  <div className="contact-info-label">GITHUB</div>
                  <div className="contact-info-value">github.com/trminh-developer</div>
                </div>
              </a>
            </div>
          </div>

          <section className="section-card contact-section fade-up" id="contact">
            <div className="contact-copy">
              <p className="eyebrow">Let's work together</p>
              <h2>Available for full-time, contract, and consulting roles.</h2>
              <p>
                Looking for a dependable HelpDesk specialist or IT support engineer? I’m open to opportunities that need calm problem-solving and polished support operations.
              </p>
            </div>

            <form ref={form} onSubmit={sendEmail} className="contact-form">
              <div className="form-row">
                <label>Your name
                  <input type="text" name="user_name" placeholder="Your name" autoComplete="name" required />
                </label>
                <label>Email
                  <input type="email" name="user_email" placeholder="Email" autoComplete="email" required />
                </label>
              </div>
              <label>Subject
                <input type="text" name="subject" placeholder="Subject" required />
              </label>
              <label>Message
                <textarea rows={5} name="message" placeholder="Tell me about your project or team" required></textarea>
              </label>
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
              {formStatus === "success" && (
                <p className="form-status" role="status">Message sent successfully!</p>
              )}
              {formStatus === "error" && (
                <p className="form-status error" role="status">Failed to send message. Please try again.</p>
              )}
            </form>
          </section>
          </div>

        </div>
      </div>
    </>
  );
}
