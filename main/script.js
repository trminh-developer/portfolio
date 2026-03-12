// 1. DATA (Dữ liệu ngôn ngữ)
const translations = {
    en: {
        // Menu
        home: 'Home',
        experience: 'Experience',
        education: 'Education',
        project: 'Projects',
        skills: 'Skills',
        contact: 'Contact',

        // Home Page
        name: 'Tran Duc Minh',
        title: 'Cyber Security',
        bio: 'Dynamic cyber security with over 11 years of experience in building and maintaining applications to enhance user engagement and performance.',

        // Experience Page
        experience_title: 'Work Experience',
        job_title_1: 'Programmer',
        company_1: 'Fastdo, Da Nang', // Cập nhật tên công ty của bạn
        duration_1: 'Jan 2020 - Present',
        responsibilities_1: `
            <li class="mb-2">Develop and maintain software applications to enhance functionality and user experience.</li>
            <li class="mb-2">Collaborate with cross-functional teams to identify and resolve technical issues.</li>
            <li class="mb-2">Implement coding standards and best practices to improve code quality.</li>
            <li class="mb-2">Participate in code reviews and provide constructive feedback to peers.</li>
            <li>Perform thorough testing and debugging to ensure optimal performance.</li>
        `,

        // Common
        view_projects: 'View Projects',
        contact_me: 'Contact Me'
    },
    vi: {
        // Menu
        home: 'Trang chủ',
        experience: 'Kinh nghiệm',
        education: 'Học vấn',
        project: 'Dự án',
        skills: 'Kỹ năng',
        contact: 'Liên hệ',

        // Home Page
        name: 'Trần Đức Minh',
        title: 'An ninh nạng',
        bio: 'Lập trình viên năng động với hơn 11 năm kinh nghiệm trong việc xây dựng và bảo trì các ứng dụng nhằm nâng cao hiệu suất và trải nghiệm người dùng.',

        // Experience Page
        experience_title: 'Kinh nghiệm làm việc',
        job_title_1: 'An ninh mạng',
        company_1: 'Fastdo, Đà Nẵng',
        duration_1: 'Tháng 1/2020 - Hiện tại',
        responsibilities_1: `
            <li class="mb-2">Phát triển và bảo trì các ứng dụng phần mềm để nâng cao tính năng và trải nghiệm người dùng.</li>
            <li class="mb-2">Phối hợp với các nhóm chức năng để xác định và giải quyết các vấn đề kỹ thuật.</li>
            <li class="mb-2">Thực hiện các tiêu chuẩn coding và thực hành tốt nhất để cải thiện chất lượng mã nguồn.</li>
            <li class="mb-2">Tham gia đánh giá code (code review) và đưa ra phản hồi mang tính xây dựng.</li>
            <li>Thực hiện kiểm thử và gỡ lỗi kỹ lưỡng để đảm bảo hiệu suất tối ưu.</li>
        `,

        // Common
        view_projects: 'Xem dự án',
        contact_me: 'Liên hệ tôi'
    },
};

// 2. DOM ELEMENTS & STATE
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const langToggle = document.getElementById('language-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.getElementById('navbarNav'); // ID chuẩn của Bootstrap menu

    // Lấy trạng thái từ LocalStorage
    let currentLang = localStorage.getItem('lang') || 'vi'; // Mặc định tiếng Việt
    const savedTheme = localStorage.getItem('theme');

    // 3. HELPER FUNCTIONS

    // Hàm đổi giao diện Sáng/Tối
    const setTheme = (mode) => {
        if (mode === 'dark') {
            body.classList.add('dark');
            if (darkModeToggle) darkModeToggle.textContent = '☀️'; // Icon mặt trời
        } else {
            body.classList.remove('dark');
            if (darkModeToggle) darkModeToggle.textContent = '🌙'; // Icon mặt trăng
        }
        localStorage.setItem('theme', mode);
    };

    // Hàm cập nhật nội dung theo ngôn ngữ
    const updateContent = (lang) => {
        // Cập nhật text cho các thẻ có data-key
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.dataset.key;
            if (!translations[lang][key]) return;

            // Nếu là danh sách (UL) hoặc chứa HTML, dùng innerHTML
            if (el.tagName === 'UL' || el.tagName === 'DIV' || key.includes('responsibilities')) {
                el.innerHTML = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        });

        // Cập nhật text cho Menu
        const menuItems = {
            '../index.html': 'home',
            '../Experience/index.html': 'experience',
            '../Education/index.html': 'education',
            '../Project/index.html': 'project',
            '../Skills/index.html': 'skills',
            '../Contact/index.html': 'contact'
        };

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Lấy tên file từ đường dẫn (ví dụ: index.html)
            const pageName = href ? href.split('/').pop() : 'home';

            // Xử lý trường hợp href="#" (trang chủ)
            const key = (href === '#' || href === 'index.html' || href === '') ? 'home' : menuItems[pageName];

            if (key && translations[lang][key]) {
                link.textContent = translations[lang][key];
            }
        });

        // Cập nhật nút ngôn ngữ
        if (langToggle) langToggle.textContent = lang.toUpperCase();
        localStorage.setItem('lang', lang);
    };

    // 4. INITIALIZE (Khởi chạy)

    // Set theme đã lưu
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Mặc định check theo hệ điều hành nếu chưa set
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        }
    }

    // Set ngôn ngữ đã lưu
    updateContent(currentLang);

    // 5. EVENT LISTENERS

    // Toggle Dark Mode
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const mode = body.classList.contains('dark') ? 'light' : 'dark';
            setTheme(mode);
        });
    }

    // Toggle Language
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'vi' ? 'en' : 'vi';
            updateContent(currentLang);
        });
    }

    // Mobile Menu: Tự động đóng khi click vào link (Chuẩn Bootstrap 5)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Chỉ đóng nếu đang ở chế độ mobile (menu đang mở)
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                // Sử dụng Bootstrap API để toggle
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: true
                });
            }
        });
    });
});