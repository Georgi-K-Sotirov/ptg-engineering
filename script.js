document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const openIcon = document.getElementById('menu-open-icon');
    const closeIcon = document.getElementById('menu-close-icon');
    const header = document.querySelector('.site-header');

    let observer;

    // ==============================
    // MOBILE MENU
    // ==============================
    if (menuButton && mobileMenu && openIcon && closeIcon) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            openIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                openIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            });
        });
    }

    // ==============================
    // HEADER STYLE ON SCROLL
    // ==============================
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    }

    // ==============================
    // SCROLL SPY
    // ==============================
    function setupScrollSpy() {
        const sections = document.querySelectorAll('main > section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!sections.length || !navLinks.length) return;

        if (observer) observer.disconnect();

        const headerHeight = header ? header.offsetHeight : 72;

        const observerOptions = {
            rootMargin: `-${headerHeight}px 0px -85% 0px`,
            threshold: 0
        };

        observer = new IntersectionObserver((entries) => {
            let visibleSectionId = null;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visibleSectionId = entry.target.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkHref = link.getAttribute('href')?.substring(1);
                if (linkHref && linkHref === visibleSectionId) {
                    link.classList.add('active');
                }
            });

            // fallback when no section is intersecting
            if (!visibleSectionId) {
                let currentActive = '';
                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= headerHeight + 1 && rect.bottom >= headerHeight + 1) {
                        currentActive = section.getAttribute('id');
                    }
                });

                if (currentActive) {
                    navLinks.forEach(link => {
                        const linkHref = link.getAttribute('href')?.substring(1);
                        if (linkHref && linkHref === currentActive) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    setupScrollSpy();

    // ==============================
    // CONTACT FORM (index.html)
    // ==============================
    const contactForm = document.getElementById('contactForm');
    const contactIframe = document.getElementById('hidden_iframe');
    const contactSuccess = document.getElementById('contactSuccess');

    if (contactForm && contactIframe && contactSuccess) {
        let contactSubmitted = false;

        contactForm.addEventListener('submit', () => {
            contactSubmitted = true;

            const btn = contactForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = true;
                btn.classList.add('opacity-70', 'cursor-not-allowed');
                btn.dataset.oldText = btn.textContent;
                btn.textContent = 'Изпращане...';
            }
        });

        contactIframe.addEventListener('load', () => {
            if (!contactSubmitted) return;

            contactSuccess.classList.remove('hidden');
            contactForm.reset();

            const btn = contactForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = false;
                btn.classList.remove('opacity-70', 'cursor-not-allowed');
                btn.textContent = btn.dataset.oldText || 'ИЗПРАЩАНЕ';
            }

            contactSubmitted = false;

            setTimeout(() => {
                contactSuccess.classList.add('hidden');
            }, 6000);
        });
    }

    // ==============================
    // SOLAR ANALYSIS FORM (solar-analysis.html)
    // ==============================
    const solarForm = document.getElementById('pvsystForm');

    // Препоръчано: в solar-analysis.html iframe да е:
    // <iframe id="pvsyst_iframe" name="hidden_iframe" style="display:none;"></iframe>
    const solarIframe =
        document.getElementById('pvsyst_iframe') ||
        document.getElementById('hidden_iframe');

    const solarSuccess = document.getElementById('successBox');
    const solarSubmitBtn = document.getElementById('submitBtn');

    const siteAddress = document.getElementById('siteAddress');
    const consumption = document.getElementById('consumption');
    const notes = document.getElementById('notes');
    const messageField = document.getElementById('messageField');

    if (solarForm && solarIframe && solarSuccess && solarSubmitBtn && messageField) {
        let solarSubmitted = false;

        solarForm.addEventListener('submit', () => {
            const msg =
`ЗАПИТВАНЕ: Безплатен соларен анализ (професионален софтуер)

Адрес/Локация: ${siteAddress ? siteAddress.value.trim() : '-'}
Потребление: ${consumption ? (consumption.value.trim() || '-') : '-'}
Бележки: ${notes ? (notes.value.trim() || '-') : '-'}

(Изпратено от landing page: Solar Analysis)`;

            messageField.value = msg;

            solarSubmitted = true;

            solarSubmitBtn.disabled = true;
            solarSubmitBtn.classList.add('opacity-70', 'cursor-not-allowed');
            solarSubmitBtn.dataset.oldText = solarSubmitBtn.textContent;
            solarSubmitBtn.textContent = 'Изпращане...';
        });

        solarIframe.addEventListener('load', () => {
            if (!solarSubmitted) return;

            solarSuccess.classList.remove('hidden');
            solarForm.reset();

            solarSubmitBtn.disabled = false;
            solarSubmitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            solarSubmitBtn.textContent = solarSubmitBtn.dataset.oldText || 'Изпрати запитване';

            solarSubmitted = false;

            // Optional: track Lead event
            try {
                if (window.fbq) fbq('track', 'Lead');
            } catch (e) {}

            setTimeout(() => solarSuccess.classList.add('hidden'), 7000);
            solarSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
});