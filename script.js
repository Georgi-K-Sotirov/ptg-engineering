document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const openIcon = document.getElementById('menu-open-icon');
    const closeIcon = document.getElementById('menu-close-icon');
    const header = document.querySelector('.site-header');
    
    let observer;

    // Mobile menu toggle
    menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        openIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            openIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        });
    });
    
    // Header style on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Add scrolled class after 50px
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    function setupScrollSpy() {
        if (observer) {
            observer.disconnect();
        }

        const sections = document.querySelectorAll('main > section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
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
                const linkHref = link.getAttribute('href').substring(1);
                if (linkHref === visibleSectionId) {
                    link.classList.add('active');
                }
            });
            // If no section is actively intersecting (e.g. at the bottom of the page), check manually
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
                        const linkHref = link.getAttribute('href').substring(1);
                        if (linkHref === currentActive) {
                            link.classList.add('active');
                        }
                    });
                }
            }


        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    setupScrollSpy();
    // Contact form success message (Google Forms + hidden iframe)
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
            if (!contactSubmitted) return; // ignore initial iframe load

            contactSuccess.classList.remove('hidden');
            contactForm.reset();

            const btn = contactForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = false;
                btn.classList.remove('opacity-70', 'cursor-not-allowed');
                btn.textContent = btn.dataset.oldText || 'ИЗПРАЩАНЕ';
            }

            contactSubmitted = false;

            // optional: auto-hide after 6 seconds
            setTimeout(() => {
                contactSuccess.classList.add('hidden');
            }, 6000);
        });
    }
});