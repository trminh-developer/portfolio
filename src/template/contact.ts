import emailjs from '@emailjs/browser';

export function connectContactForm() {
  const form = document.getElementById('contactMailForm') as HTMLFormElement | null;
  const notice = document.getElementById('contactMailNotice');
  if (!form || !notice) return () => {};
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  let disposed = false;
  let sending = false;
  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('user_name') || '').trim();
    const email = String(data.get('user_email') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !email || !message) {
      notice.textContent = 'Vui lòng điền đủ thông tin.';
      return;
    }
    const service = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const template = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!service || !template || !publicKey) {
      const subject = encodeURIComponent('Liên hệ qua TrMinh Portfolio · ' + name);
      const body = encodeURIComponent(`Tên: ${name}\nEmail: ${email}\n\n${message}`);
      notice.textContent = 'Ứng dụng email sẽ mở để bạn kiểm tra và bấm Gửi.';
      window.location.href = `mailto:trminhithelpdesk@outlook.com?subject=${subject}&body=${body}`;
      return;
    }
    sending = true;
    button.disabled = true;
    button.textContent = 'Đang gửi...';
    notice.textContent = '';
    try {
      await emailjs.sendForm(service, template, form, { publicKey });
      if (disposed) return;
      notice.textContent = 'Tin nhắn đã được gửi thành công. Cảm ơn bạn!';
      form.reset();
    } catch {
      if (!disposed) notice.textContent = 'Chưa gửi được tin nhắn. Vui lòng thử lại hoặc gửi email đến trminhithelpdesk@outlook.com.';
    } finally {
      sending = false;
      if (!disposed) {
        button.disabled = false;
        button.textContent = 'Gửi tin nhắn ↗';
      }
    }
  };
  form.addEventListener('submit', submit);
  return () => { disposed = true; form.removeEventListener('submit', submit); };
}
