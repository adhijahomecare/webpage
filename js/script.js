/* ============================================
   ADHIJA HOME CARE - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Header scroll effect ----
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ---- Mobile navigation toggle ----
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mainNav.classList.toggle('open');
        document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    mainNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mainNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---- Active nav link on scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ---- FAQ Accordion ----
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ---- Scroll animations (Intersection Observer) ----
    const animateElements = document.querySelectorAll(
        '.service-card, .testimonial-card, .video-placeholder, .contact-card, .faq-item, .about-block, .service-category'
    );

    animateElements.forEach(el => el.classList.add('fade-in'));

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // ---- Smooth scroll for all anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- Enquiry Form: "Other" checkbox toggle ----
    const otherCheckbox = document.getElementById('otherCheckbox');
    const otherWrapper = document.getElementById('otherInputWrapper');

    if (otherCheckbox && otherWrapper) {
        otherCheckbox.addEventListener('change', () => {
            otherWrapper.classList.toggle('visible', otherCheckbox.checked);
            if (!otherCheckbox.checked) {
                document.getElementById('otherService').value = '';
            }
        });
    }

    // ---- Enquiry Form: Submission via Web3Forms ----
    const enquiryForm = document.getElementById('enquiryForm');
    const formResult = document.getElementById('formResult');
    const submitBtn = document.getElementById('enquirySubmitBtn');

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate at least one service is checked
            const checkedServices = enquiryForm.querySelectorAll('input[name="Services"]:checked');
            if (checkedServices.length === 0) {
                formResult.textContent = 'Please select at least one service.';
                formResult.className = 'form-result error';
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            formResult.textContent = '';

            try {
                const formData = new FormData(enquiryForm);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (data.success) {
                    formResult.textContent = '\u2713 Thank you! Your enquiry has been submitted. We will contact you shortly.';
                    formResult.className = 'form-result success';
                    enquiryForm.reset();
                    otherWrapper.classList.remove('visible');
                } else {
                    formResult.textContent = 'Something went wrong. Please try again or call us directly.';
                    formResult.className = 'form-result error';
                }
            } catch (error) {
                formResult.textContent = 'Network error. Please try again or call us at +91 79800 49050.';
                formResult.className = 'form-result error';
            }

            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Enquiry';
        });
    }
});
