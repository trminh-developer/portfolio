# TrMinh · Personal Space

Portfolio React + TypeScript + Vite, áp dụng giao diện và các hiệu ứng từ source
được công khai tại <https://candid-meerkat-f95cbb.netlify.app/>.

## Chạy project

```sh
npm ci
npm run dev
```

Build production: `npm run build`. Xem bản build: `npm run preview`.
Cấu hình rewrite cho React Router đã có trong `vercel.json`.

## Source mẫu và phần tích hợp

- `src/template/portfolio.html`: giao diện với thông tin, ảnh và liên kết TrMinh.
  Đây là HTML tin cậy trong repository; không dùng thành phần này để hiển thị
  HTML do khách truy cập cung cấp.
- `src/template/original.css`: CSS đầy đủ của mẫu; `custom.css` chứa điều chỉnh.
- `src/components/Layout.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx`: layout chung
  cho cả sáu trang, một menu và một footer thống nhất, luôn có đủ liên kết.
- `src/styles/site.css`: bộ màu, typography, khoảng cách, panel, timeline,
  kỹ năng, dự án, dịch vụ và biểu mẫu được dùng thống nhất trên mọi trang.
- `src/template/scene.js`: thẻ Three.js, dây đeo, kéo/lật, cảm biến điện thoại
  và video mặt sau. `background.js` cung cấp cùng nền sao cho mọi đường dẫn;
  `useInterfaceSound.ts` giữ trạng thái âm thanh khi chuyển trang.
- Các module `intro`, `loading`, `about`, `reveal`, `mirror`, `comments`, `ambient`
  giữ những tương tác còn lại. `scope.js` dọn sự kiện, timer, observer, video và
  tài nguyên GPU khi React tháo trang.
- `public/template/`: ảnh Spider-Man và video mặt sau thẻ. `public/vendor/`: Three.js r128
  của mẫu cùng giấy phép MIT. Giao diện và thẻ 3D không cần CDN.
- Giữ đủ các trang `/`, `/experience`, `/skills`, `/projects`, `/services`,
  `/contact` và phần About trên trang chủ.

Ảnh màn chào và ảnh giới thiệu dùng `public/Vest.png`; ảnh trên thẻ 3D và thẻ dự
phòng dùng `public/171367.jpg`. Lớp ảnh soi ẩn trong About dùng Spider-Man từ template. Navbar chỉ chứa điều hướng và
điều khiển giao diện; không hiển thị nhãn TrMinh.dev.

Chỉnh trực tiếp các file `src/template/` khi phát triển tiếp. Bản source tham
chiếu, script chuyển đổi một lần, CSS cũ và ảnh không sử dụng đã được dọn bỏ.

## Vercel

Project production: `portfolio` trong `trminh-developers-projects`.
Tên miền: <https://tranducminh.vercel.app>.

`vercel.json` cấu hình Vite, build bằng `npm run build`, xuất thư mục `dist`
và hỗ trợ mở trực tiếp các page của React Router. `.vercelignore` loại trừ
biến môi trường cục bộ, cache và công cụ kiểm tra khỏi gói deploy.

```sh
vercel link --yes --project portfolio --scope trminh-developers-projects
vercel deploy --prod --yes --scope trminh-developers-projects
```

## Liên hệ và bình luận

File `.env` hiện có được giữ nguyên. Các tên biến nằm trong `.env.example`.

Biểu mẫu trang chủ dùng ba biến `VITE_EMAILJS_*` và các trường `user_name`,
`user_email`, `subject`, `message` của tích hợp EmailJS hiện có. Khi chưa cấu
hình đủ, biểu mẫu mở ứng dụng email với nội dung đã điền để khách kiểm tra và gửi.

Bản mẫu chưa cấu hình Firebase. Để bật Google login và bình luận công khai,
điền bốn biến `VITE_FIREBASE_*`, bật Google Authentication, thêm tên miền vào
Authorized domains và thiết lập quyền Firestore cho collection `portfolioComments`.
Khi chưa cấu hình, giao diện hiển thị trạng thái chưa khả dụng. Khởi động lại
Vite hoặc build lại sau khi đổi biến môi trường.

## Kiểm tra trình duyệt

`scripts/verify-browser.cjs` kiểm tra đủ sáu trang ở 1440, 1024, 768, 390 và
320px; nội dung được giữ lại; layout chung; menu; trạng thái âm thanh; About;
WebGL kéo/lật thẻ; hiệu ứng kính; và hai biểu mẫu liên hệ. Mọi yêu cầu EmailJS
đều được chặn và giả lập; không gửi email thật. Ảnh chụp và kết quả ở `.qa/`
(đã bỏ qua trong Git).

Script cần Playwright và Chrome cục bộ. Có thể cài công cụ bằng
`npm install --no-save --package-lock=false playwright`, chạy Vite rồi chạy
`node scripts/verify-browser.cjs`. Máy hiện tại cũng dùng được Playwright có
sẵn trong n8n. Dùng `BROWSER_PATH` để chọn Chrome trên máy khác, `PREVIEW_URL`
để đổi địa chỉ server.
