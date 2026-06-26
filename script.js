document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // === ELEMENTS — Cache all DOM references
  // ============================================================
  const navbar         = document.getElementById('navbar');
  const hamburger      = document.querySelector('.hamburger');
  const navLinks       = document.querySelector('.nav-links');
  const navLinkItems   = document.querySelectorAll('.nav-link');
  const ctaButtons     = document.querySelectorAll('.cta-btn');
  const contactForm    = document.getElementById('contact-form');
  const formSuccess    = document.getElementById('form-success');
  const backToTopBtn   = document.getElementById('back-to-top');
  const hero           = document.querySelector('.hero');
  const heroShapes     = document.querySelector('.hero-shapes');
  const sections       = document.querySelectorAll('#home, #about, #services, #contact');
  const animateEls     = document.querySelectorAll('.animate');

  // Grid containers whose children receive staggered animation delays
  const staggerSelectors = [
    '.services-grid', '.benefits-grid', '.pricing-grid',
    '.profile-grid', '.media-grid', '.industries-grid',
    '.difference-grid', '.branding-list', '.process-timeline'
  ];


  // ============================================================
  // === 1. NAVBAR SCROLL EFFECT
  // ============================================================
  const SCROLL_THRESHOLD = 50;

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  // Run once on load in case page is already scrolled
  handleNavbarScroll();


  // ============================================================
  // === 2. ACTIVE NAV LINK HIGHLIGHTING
  // ============================================================
  function setActiveLink() {
    if (!sections.length || !navLinkItems.length) return;

    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop  = section.offsetTop - navbarHeight - 100;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
        currentSection = section.getAttribute('id');
      }
    });

    // If user scrolled to the very bottom, activate last section
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
      currentSection = sections[sections.length - 1].getAttribute('id');
    }

    navLinkItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();


  // ============================================================
  // === 3. SMOOTH SCROLL
  // ============================================================
  const NAVBAR_OFFSET = 80;

  function smoothScrollTo(targetSelector) {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    const targetPosition = target.offsetTop - NAVBAR_OFFSET;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  // Nav links
  navLinkItems.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        smoothScrollTo(href);
        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  // CTA buttons with hash hrefs
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        smoothScrollTo(href);
      }
    });
  });


  // ============================================================
  // === 4. MOBILE HAMBURGER MENU
  // ============================================================
  function closeMobileMenu() {
    if (hamburger) hamburger.classList.remove('active');
    if (navLinks)  navLinks.classList.remove('active');
  }

  function toggleMobileMenu() {
    if (hamburger) hamburger.classList.toggle('active');
    if (navLinks)  navLinks.classList.toggle('active');
  }

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Close menu when clicking a nav link (mobile)
  navLinkItems.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks || !hamburger) return;
    const isMenuOpen = navLinks.classList.contains('active');
    if (isMenuOpen && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  });


  // ============================================================
  // === 5. SCROLL ANIMATIONS
  // ============================================================

  // Apply staggered delays to children of grid/list containers
  staggerSelectors.forEach(selector => {
    const containers = document.querySelectorAll(selector);
    containers.forEach(container => {
      const children = container.children;
      Array.from(children).forEach((child, index) => {
        child.style.transitionDelay = `${index * 0.1}s`;
      });
    });
  });

  // IntersectionObserver for .animate elements
  if ('IntersectionObserver' in window) {
    const animateObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    animateEls.forEach(el => animateObserver.observe(el));
  } else {
    // Fallback: just add class immediately
    animateEls.forEach(el => el.classList.add('animated'));
  }


  // Helper to escape HTML tags to prevent script injection/XSS
  function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // ============================================================
  // === 6. CONTACT FORM HANDLING
  // ============================================================
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather field values
      const name    = contactForm.querySelector('[name="name"]') || contactForm.querySelector('#name');
      const email   = contactForm.querySelector('[name="email"]') || contactForm.querySelector('#email');
      const message = contactForm.querySelector('[name="message"]') || contactForm.querySelector('#message');

      const nameVal    = name    ? name.value.trim()    : '';
      const emailVal   = email   ? email.value.trim()   : '';
      const messageVal = message ? message.value.trim() : '';

      // Basic validation
      if (!nameVal || !emailVal || !messageVal) {
        alert('Please fill in all required fields.');
        return;
      }

      // Simple email format check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailVal)) {
        alert('Please enter a valid email address.');
        return;
      }

      // Loading state on submit button
      const submitBtn = contactForm.querySelector('button[type="submit"]') || contactForm.querySelector('.submit-btn');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';

      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';
      }

      // Success helper
      function showSuccessState() {
        if (submitBtn) {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.cursor = 'pointer';
        }

        // Show success message
        if (formSuccess) {
          formSuccess.classList.add('show');
        }

        // Reset form
        contactForm.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
          if (formSuccess) {
            formSuccess.classList.remove('show');
          }
        }, 5000);
      }

      // Honeypot spam check
      const botField = contactForm.querySelector('[name="bot-field"]');
      if (botField && botField.value.trim() !== '') {
        // Silently consume bot submissions and simulate success
        setTimeout(showSuccessState, 1000);
        return;
      }

      // Prepare URL-encoded parameters for Netlify Form Submission
      const bodyParams = new URLSearchParams();
      bodyParams.append('form-name', 'contact');
      bodyParams.append('name', sanitizeInput(nameVal));
      bodyParams.append('email', sanitizeInput(emailVal));
      bodyParams.append('message', sanitizeInput(messageVal));
      if (botField) {
        bodyParams.append('bot-field', botField.value);
      }

      // Submit Form via Fetch AJAX
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: bodyParams.toString()
      })
      .then(response => {
        if (response.ok) {
          showSuccessState();
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(() => {
        alert('There was a problem sending your message. Please check your internet connection and try again.');
        // Restore button state on error
        if (submitBtn) {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.cursor = 'pointer';
        }
      });
    });
  }


  // ============================================================
  // === 7. BACK TO TOP BUTTON
  // ============================================================
  const BACK_TO_TOP_THRESHOLD = 500;

  function handleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > BACK_TO_TOP_THRESHOLD) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTop, { passive: true });
  handleBackToTop();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ============================================================
  // === 8. COUNTER ANIMATION (optional enhancement)
  // ============================================================
  const counterEls = document.querySelectorAll('.counter, [data-count]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count') || el.textContent, 10);
    if (isNaN(target)) return;

    const duration = 2000; // 2 seconds
    const step = Math.ceil(target / (duration / 16)); // ~60fps
    let current = 0;

    const suffix = el.getAttribute('data-suffix') || '';

    function update() {
      current += step;
      if (current >= target) {
        current = target;
        el.textContent = current.toLocaleString() + suffix;
        return;
      }
      el.textContent = current.toLocaleString() + suffix;
      requestAnimationFrame(update);
    }

    el.textContent = '0' + suffix;
    requestAnimationFrame(update);
  }

  if (counterEls.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => counterObserver.observe(el));
  }


  // ============================================================
  // === 9. PARALLAX EFFECT ON HERO SHAPES
  // ============================================================
  let parallaxFrame = null;

  if (hero && heroShapes) {
    hero.addEventListener('mousemove', (e) => {
      // Only on desktop
      if (window.innerWidth <= 768) return;

      if (parallaxFrame) cancelAnimationFrame(parallaxFrame);

      parallaxFrame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Normalise to –1 … 1
        const dx = (mouseX - centerX) / centerX;
        const dy = (mouseY - centerY) / centerY;

        const children = heroShapes.children;
        Array.from(children).forEach((child, index) => {
          const intensity = (index + 1) * 12; // deeper layers move more
          const tx = dx * intensity;
          const ty = dy * intensity;
          child.style.transform = `translate(${tx}px, ${ty}px)`;
        });
      });
    });

    // Reset on mouse leave
    hero.addEventListener('mouseleave', () => {
      if (parallaxFrame) cancelAnimationFrame(parallaxFrame);
      if (heroShapes && heroShapes.children) {
        Array.from(heroShapes.children).forEach(child => {
          child.style.transform = 'translate(0, 0)';
          child.style.transition = 'transform 0.6s ease';
          // Remove transition after it completes so parallax stays fluid
          setTimeout(() => { child.style.transition = ''; }, 600);
        });
      }
    });
  }


  // ============================================================
  // === 10. TYPING / TEXT REVEAL EFFECT (optional)
  // ============================================================
  const heroTagline = document.querySelector('.hero-tagline, .hero .tagline, .hero p.subtitle');

  if (heroTagline) {
    const fullText = heroTagline.textContent;
    heroTagline.textContent = '';
    heroTagline.style.visibility = 'visible';

    let charIndex = 0;
    const typingSpeed = 35; // ms per character

    function typeChar() {
      if (charIndex < fullText.length) {
        heroTagline.textContent += fullText.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, typingSpeed);
      }
    }

    // Small delay before typing starts to let page settle
    setTimeout(typeChar, 800);
  }


  // ============================================================
  // === PERFORMANCE: Debounced resize handler
  // ============================================================
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Reset parallax on mobile
      if (window.innerWidth <= 768 && heroShapes) {
        Array.from(heroShapes.children).forEach(child => {
          child.style.transform = 'translate(0, 0)';
        });
      }
    }, 250);
  }, { passive: true });

});
