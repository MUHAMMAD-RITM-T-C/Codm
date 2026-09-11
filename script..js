/* ═══════════════════════════════════════════════
   INITIALIZATION
   ═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    initCommon();
    // صفحه‌ها توابع مخصوص خود را از طریق window.initPage فراخوانی می‌کنند
    if (typeof window.initPage === 'function') window.initPage();
});

function initCommon() {
    hidePreloader();
    initRevealAnimations();
    initTiltEffect();
    initBackToTop();
    initScrollProgress();
    initThemeToggle();
    initLanguageToggle();
    initSmoothScroll();
    highlightActiveNav();
}

/* ═══════════════════════════════════════════════
   PRELOADER
   ═══════════════════════════════════════════════ */
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) setTimeout(() => preloader.classList.add('hidden'), 500);
}

/* ═══════════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════════ */
let revealObserver;
function initRevealAnimations() {
    if (revealObserver) revealObserver.disconnect();
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    els.forEach(el => {
        el.classList.remove('visible');
        revealObserver.observe(el);
    });
}

/* ═══════════════════════════════════════════════
   3D TILT
   ═══════════════════════════════════════════════ */
function initTiltEffect() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.015)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
        });
    });
}

/* ═══════════════════════════════════════════════
   BACK TO TOP
   ═══════════════════════════════════════════════ */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) btn.classList.add('visible');
        else btn.classList.remove('visible');
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ═══════════════════════════════════════════════
   SCROLL PROGRESS
   ═══════════════════════════════════════════════ */
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (scrollTop / docHeight) * 100 + '%';
    }, { passive: true });
}

/* ═══════════════════════════════════════════════
   SMOOTH SCROLL (anchor links)
   ═══════════════════════════════════════════════ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ═══════════════════════════════════════════════
   HIGHLIGHT ACTIVE NAV
   ═══════════════════════════════════════════════ */
function highlightActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        if (href === path) {
            link.classList.add('active', 'text-primary', 'font-bold');
            link.classList.remove('text-on-surface/70', 'text-on-surface-variant');
        } else {
            link.classList.remove('active', 'text-primary', 'font-bold');
        }
    });
}

/* ═══════════════════════════════════════════════
   THEME TOGGLE (with localStorage persistence)
   ═══════════════════════════════════════════════ */
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    if (!toggle) return;
    const icon = toggle.querySelector('.material-symbols-outlined');

    // Restore theme
    if (localStorage.getItem('ritm-theme') === 'light') {
        html.classList.remove('dark');
        if (icon) icon.textContent = 'light_mode';
    }

    toggle.addEventListener('click', () => {
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            if (icon) icon.textContent = 'light_mode';
            localStorage.setItem('ritm-theme', 'light');
        } else {
            html.classList.add('dark');
            if (icon) icon.textContent = 'dark_mode';
            localStorage.setItem('ritm-theme', 'dark');
        }
    });
}

/* ═══════════════════════════════════════════════
   LANGUAGE TOGGLE (with localStorage persistence)
   ═══════════════════════════════════════════════ */
const TRANSLATIONS = {
    fa: {
        'nav-home': 'خانه', 'nav-portfolio': 'پورتفولیو', 'nav-services': 'خدمات',
        'nav-contact': 'تماس', 'nav-cta': 'شروع پروژه',
        'hero-badge': 'آژانس خلاقیت دیجیتال',
        'hero-title-prefix': 'ریتم –',
        'hero-title-typing': 'تدوین خلاقانه',
        'hero-desc': 'ما مرزهای بین هنر دیجیتال و مهندسی نرم‌افزار را می‌شکنیم. با ریتم، داستان برند شما با بالاترین استانداردهای بصری و تکنیکال روایت می‌شود.',
        'hero-btn-start': 'شروع پروژه', 'hero-btn-portfolio': 'مشاهده پورتفولیو',
        'services-title': 'خدمات تخصصی',
        'services-sub': 'ترکیب هنر، حرکت و کد برای خلق تجربه‌های بی‌نظیر.',
        'service-video-title': 'تدوین و پست‌پروداکشن',
        'service-video-desc': 'ویرایش حرفه‌ای ویدیو با پریمیر پرو، اصلاح رنگ با استانداردهای سینمایی.',
        'service-web-title': 'توسعه وب',
        'service-web-desc': 'ساخت کدهای سایت‌های پیشرفته با عملکرد بالا و طراحی واکنش‌گرا.',
        'service-mobile-title': 'اپلیکیشن موبایل',
        'service-mobile-desc': 'ساخت اپلیکیشن‌های موبایل پایه با تمرکز بر کارایی و تجربه کاربری.',
        'cta-title': 'آماده خلق یک اثر ماندگار هستید؟',
        'cta-desc': 'تیم متخصص ما آماده است تا ایده‌های شما را به واقعیت تبدیل کند. همین حالا برای مشاوره رایگان با ما تماس بگیرید.',
        'cta-btn': 'درخواست مشاوره رایگان',
        'portfolio-title': 'نمونه کارها',
        'portfolio-desc': 'مجموعه‌ای از پروژه‌های برگزیده ما در زمینه‌های تدوین ویدیو، توسعه وب و اپلیکیشن موبایل.',
        'filter-all': 'همه پروژه‌ها', 'filter-video': 'تدوین ویدیو',
        'filter-web': 'توسعه وب', 'filter-mobile': 'اپلیکیشن موبایل',
        'p1-title': 'تیزر تبلیغاتی محصول',
        'p1-desc': 'تدوین و مونتاژ تیزر ۳۰ ثانیه‌ای با پریمیر پرو، شامل اصلاح رنگ و صداگذاری.',
        'p2-title': 'سایت شرکتی مدرن',
        'p2-desc': 'طراحی و کدنویسی وب‌سایت شرکتی با انیمیشن‌های روان و بهینه‌سازی سئو.',
        'p3-title': 'اپلیکیشن مدیریت وظایف',
        'p3-desc': 'اپلیکیشن موبایل ساده برای مدیریت وظایف روزانه با قابلیت ثبت و پیگیری.',
        'p4-title': 'موزیک ویدیو',
        'p4-desc': 'تدوین موزیک ویدیو با ریتم‌سازی دقیق و افکت‌های بصری جذاب.',
        'p5-title': 'وب‌سایت رزومه',
        'p5-desc': 'طراحی و پیاده‌سازی وب‌سایت شخصی با تمرکز بر سادگی و سرعت بارگذاری.',
        'p6-title': 'اپلیکیشن یادداشت‌برداری',
        'p6-desc': 'اپلیکیشن موبایل سبک برای یادداشت‌برداری سریع با ذخیره‌سازی محلی.',
        'portfolio-cta': 'درخواست پروژه مشابه',
        'services-page-title': 'خدمات ما',
        'services-page-desc': 'ما با ترکیب هنر دیجیتال و مهندسی نرم‌افزار، راه‌حل‌های خلاقانه و کاربردی برای برند شما ارائه می‌دهیم.',
        'sv1-1': 'تدوین فیلم، تیزر و مستند',
        'sv1-2': 'اصلاح رنگ حرفه‌ای (Color Grading)',
        'sv1-3': 'میکس و مسترینگ صدا',
        'sv2-1': 'وب‌سایت‌های شرکتی و شخصی',
        'sv2-2': 'طراحی واکنش‌گرا (Responsive)',
        'sv2-3': 'بهینه‌سازی سرعت و سئو',
        'sv3-1': 'اپلیکیشن‌های مدیریتی و یادداشت',
        'sv3-2': 'رابط کاربری ساده و روان',
        'sv3-3': 'ذخیره‌سازی محلی و آفلاین',
        'faq-title': 'سوالات متداول',
        'faq-q1': 'هزینه پروژه‌ها چگونه محاسبه می‌شود؟',
        'faq-a1': 'هزینه بر اساس پیچیدگی، زمان تحویل و حجم کار تعیین می‌شود. برای دریافت برآورد دقیق، فرم تماس را پر کنید.',
        'faq-q2': 'چه مدت زمانی برای تحویل پروژه نیاز است؟',
        'faq-a2': 'بسته به نوع پروژه متفاوت است. معمولاً تدوین ویدیو ۳ تا ۷ روز کاری، وب‌سایت ۱ تا ۲ هفته و اپلیکیشن ۲ تا ۴ هفته زمان می‌برد.',
        'faq-q3': 'آیا امکان اصلاح بعد از تحویل وجود دارد؟',
        'faq-a3': 'بله، هر پروژه شامل دو مرحله اصلاحات رایگان است تا نتیجه نهایی مطابق انتظار شما باشد.',
        'faq-q4': 'آیا برای پروژه‌های بزرگ قرارداد رسمی منعقد می‌شود؟',
        'faq-a4': 'بله، برای پروژه‌های بزرگ‌تر، قرارداد رسمی با جزئیات کامل تنظیم می‌شود تا حقوق هر دو طرف محفوظ باشد.',
        'services-cta': 'دریافت مشاوره رایگان',
        'contact-title': 'آغاز همکاری',
        'contact-desc': 'ایده‌های خود را با ما در میان بگذارید تا با بالاترین کیفیت و در کمترین زمان آنها را به واقعیت تبدیل کنیم.',
        'contact-info-title': 'اطلاعات تماس',
        'contact-email-label': 'ایمیل ارتباطی',
        'contact-phone-label': 'تلفن تماس',
        'contact-address-label': 'آدرس',
        'contact-address': 'تهران، ایران',
        'form-success': 'درخواست شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.',
        'form-error': 'خطا در ارسال فرم. لطفاً دوباره تلاش کنید.',
        'form-name-label': 'نام و نام خانوادگی',
        'form-name-error': 'لطفاً نام را وارد کنید',
        'form-contact-label': 'ایمیل یا شماره تماس',
        'form-contact-error': 'لطفاً ایمیل یا شماره معتبر وارد کنید',
        'form-project-label': 'نوع پروژه',
        'form-project-video': 'تدوین ویدیو',
        'form-project-web': 'توسعه وب',
        'form-project-mobile': 'اپلیکیشن موبایل',
        'form-project-other': 'سایر موارد',
        'form-budget-label': 'بودجه تقریبی (اختیاری)',
        'form-budget-placeholder': 'انتخاب کنید...',
        'form-budget-1': 'کمتر از ۱۰ میلیون تومان',
        'form-budget-2': '۱۰ تا ۵۰ میلیون تومان',
        'form-budget-3': 'بیشتر از ۵۰ میلیون تومان',
        'form-message-label': 'توضیحات پروژه',
        'form-message-error': 'لطفاً توضیحات پروژه را وارد کنید',
        'form-submit': 'ارسال درخواست',
        'footer-copy': '© ۲۰۲۴ ریتم. تمامی حقوق محفوظ است.',
        'footer-telegram': 'تلگرام', 'footer-bale': 'بله', 'footer-instagram': 'اینستاگرام'
    },
    en: {
        'nav-home': 'Home', 'nav-portfolio': 'Portfolio', 'nav-services': 'Services',
        'nav-contact': 'Contact', 'nav-cta': 'Start Project',
        'hero-badge': 'Digital Creative Agency',
        'hero-title-prefix': 'RITM –',
        'hero-title-typing': 'Creative Editing',
        'hero-desc': 'We bridge the gap between digital art and software engineering. With RITM, your brand story is told with the highest visual and technical standards.',
        'hero-btn-start': 'Start Project', 'hero-btn-portfolio': 'View Portfolio',
        'services-title': 'Expert Services',
        'services-sub': 'Combining art, motion, and code to craft unique experiences.',
        'service-video-title': 'Video Editing & Post-Production',
        'service-video-desc': 'Professional video editing with Premiere Pro, color grading to cinematic standards.',
        'service-web-title': 'Web Development',
        'service-web-desc': 'Building advanced, high-performance websites with responsive design.',
        'service-mobile-title': 'Mobile App (Basic)',
        'service-mobile-desc': 'Developing simple, functional mobile apps focused on efficiency and user experience.',
        'cta-title': 'Ready to create a lasting work?',
        'cta-desc': 'Our expert team is ready to turn your ideas into reality. Contact us for a free consultation today.',
        'cta-btn': 'Request Free Consultation',
        'portfolio-title': 'Our Work',
        'portfolio-desc': 'A selection of our featured projects in video editing, web development, and mobile apps.',
        'filter-all': 'All Projects', 'filter-video': 'Video Editing',
        'filter-web': 'Web Development', 'filter-mobile': 'Mobile App',
        'p1-title': 'Product Ad Teaser',
        'p1-desc': 'Editing and assembling a 30-second teaser with Premiere Pro, including color grading and sound design.',
        'p2-title': 'Modern Corporate Website',
        'p2-desc': 'Design and coding of a corporate website with smooth animations and SEO optimization.',
        'p3-title': 'Task Management App',
        'p3-desc': 'A simple mobile app for daily task management with tracking and logging features.',
        'p4-title': 'Music Video',
        'p4-desc': 'Editing a music video with precise rhythm and stunning visual effects.',
        'p5-title': 'Resume Website',
        'p5-desc': 'Design and implementation of a personal website focused on simplicity and loading speed.',
        'p6-title': 'Note-Taking App',
        'p6-desc': 'A lightweight mobile app for quick note-taking with local storage.',
        'portfolio-cta': 'Request Similar Project',
        'services-page-title': 'Our Services',
        'services-page-desc': 'We deliver creative and practical solutions for your brand by combining digital art and software engineering.',
        'sv1-1': 'Film, teaser, and documentary editing',
        'sv1-2': 'Professional color grading',
        'sv1-3': 'Audio mixing and mastering',
        'sv2-1': 'Corporate & personal websites',
        'sv2-2': 'Responsive design',
        'sv2-3': 'Speed and SEO optimization',
        'sv3-1': 'Management and note-taking apps',
        'sv3-2': 'Simple and intuitive UI',
        'sv3-3': 'Local and offline storage',
        'faq-title': 'Frequently Asked Questions',
        'faq-q1': 'How are project costs calculated?',
        'faq-a1': 'Costs are determined based on complexity, delivery time, and workload. Fill out the contact form for a detailed estimate.',
        'faq-q2': 'How long does a project take?',
        'faq-a2': 'It depends on the project. Video editing takes 3-7 business days, websites 1-2 weeks, and mobile apps 2-4 weeks.',
        'faq-q3': 'Is it possible to make revisions after delivery?',
        'faq-a3': 'Yes, each project includes two rounds of free revisions to ensure the final result meets your expectations.',
        'faq-q4': 'Is a formal contract signed for large projects?',
        'faq-a4': 'Yes, for larger projects we prepare a formal contract with full details to protect both parties.',
        'services-cta': 'Get Free Consultation',
        'contact-title': 'Start Collaboration',
        'contact-desc': 'Share your ideas with us and we’ll bring them to life with the highest quality in the shortest time.',
        'contact-info-title': 'Contact Information',
        'contact-email-label': 'Email',
        'contact-phone-label': 'Phone',
        'contact-address-label': 'Address',
        'contact-address': 'Tehran, Iran',
        'form-success': 'Your request has been sent successfully. We will contact you soon.',
        'form-error': 'Error submitting form. Please try again.',
        'form-name-label': 'Full Name',
        'form-name-error': 'Please enter your name',
        'form-contact-label': 'Email or Phone',
        'form-contact-error': 'Please enter a valid email or phone number',
        'form-project-label': 'Project Type',
        'form-project-video': 'Video Editing',
        'form-project-web': 'Web Development',
        'form-project-mobile': 'Mobile App',
        'form-project-other': 'Other',
        'form-budget-label': 'Estimated Budget (optional)',
        'form-budget-placeholder': 'Select...',
        'form-budget-1': 'Less than 10 million Toman',
        'form-budget-2': '10-50 million Toman',
        'form-budget-3': 'More than 50 million Toman',
        'form-message-label': 'Project Description',
        'form-message-error': 'Please enter project details',
        'form-submit': 'Send Request',
        'footer-copy': '© 2024 RITM. All rights reserved.',
        'footer-telegram': 'Telegram', 'footer-bale': 'Bale', 'footer-instagram': 'Instagram'
    }
};

function initLanguageToggle() {
    const toggle = document.getElementById('lang-toggle');
    const label = document.getElementById('lang-label');
    const html = document.documentElement;
    if (!toggle) return;

    let currentLang = localStorage.getItem('ritm-lang') || 'fa';
    applyLanguage(currentLang);

    toggle.addEventListener('click', () => {
        const newLang = currentLang === 'fa' ? 'en' : 'fa';
        currentLang = newLang;
        localStorage.setItem('ritm-lang', newLang);
        applyLanguage(newLang);
    });
}

function applyLanguage(lang) {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'fa' ? 'rtl' : 'ltr';
    const label = document.getElementById('lang-label');
    if (label) label.textContent = lang === 'fa' ? 'English' : 'فارسی';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const translation = TRANSLATIONS[lang]?.[key] || TRANSLATIONS.fa[key] || key;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
            // skip; handled by placeholders below
        } else if (el.tagName === 'OPTION') {
            el.textContent = translation;
        } else {
            el.textContent = translation;
        }
    });

    // Update placeholders
    const searchInput = document.getElementById('portfolio-search');
    if (searchInput) searchInput.placeholder = lang === 'fa' ? 'جستجو...' : 'Search...';
    const nameInput = document.getElementById('name');
    if (nameInput) nameInput.placeholder = lang === 'fa' ? 'مثال: علی رضایی' : 'e.g. John Doe';
    const contactInput = document.getElementById('contact');
    if (contactInput) contactInput.placeholder = lang === 'fa' ? '0912... یا email@example.com' : '0912... or email@example.com';
    const messageInput = document.getElementById('message');
    if (messageInput) messageInput.placeholder = lang === 'fa'
        ? 'لطفاً جزئیات پروژه خود را اینجا بنویسید...'
        : 'Please write your project details here...';

    // Restart typing effect if it exists on this page
    if (window.restartTyping) window.restartTyping(lang);
}