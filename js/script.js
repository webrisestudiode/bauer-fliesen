/* ============================================================
   Bauer Fliesen & Naturstein – Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Mobile Menu ---------- */
  const toggle = document.querySelector('.navbar__toggle');
  const nav = document.querySelector('.navbar__nav');
  const cta = document.querySelector('.navbar__cta');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      if (cta) cta.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen.toString());
      // Animate hamburger
      const spans = toggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar')) {
        nav.classList.remove('open');
        if (cta) cta.classList.remove('open');
      }
    });
  }

  /* ---------- Sticky Navbar Shadow ---------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ---------- Active Nav Link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar__nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- FAQ Accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(i => i.classList.remove('open'));
        // Toggle current
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  /* ---------- Scroll Animation ---------- */
  const animatedEls = document.querySelectorAll('.animate-on-scroll');
  if (animatedEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animatedEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 0.1 + 's';
      observer.observe(el);
    });
  } else {
    animatedEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Counter Animation ---------- */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const duration = 1800;
    const start = performance.now();
    const isDecimal = el.dataset.decimal === 'true';

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value).toLocaleString('de-DE');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('.counter');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ---------- Cookie Banner ---------- */
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  if (cookieBanner) {
    // Check if already accepted
    if (!localStorage.getItem('bauer-cookie-consent')) {
      setTimeout(() => cookieBanner.classList.add('show'), 1500);
    }

    if (cookieAccept) {
      cookieAccept.addEventListener('click', () => {
        localStorage.setItem('bauer-cookie-consent', 'accepted');
        cookieBanner.classList.remove('show');
      });
    }

    if (cookieDecline) {
      cookieDecline.addEventListener('click', () => {
        localStorage.setItem('bauer-cookie-consent', 'declined');
        cookieBanner.classList.remove('show');
      });
    }
  }

  /* ---------- Personalized Banner (URL Params) ---------- */
  // Already handled inline via <script> in HTML, no action needed here.

  /* ---------- Form Validation ---------- */
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      const required = form.querySelectorAll('[required]');
      required.forEach(field => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          field.style.borderColor = '#e53e3e';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (valid) {
        const btn = form.querySelector('[type="submit"]');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Anfrage gesendet!';
        btn.disabled = true;
        btn.style.backgroundColor = '#2d8a4e';
        btn.style.borderColor = '#2d8a4e';

        setTimeout(() => {
          btn.innerHTML = original;
          btn.disabled = false;
          btn.style.backgroundColor = '';
          btn.style.borderColor = '';
          form.reset();
        }, 4000);
      }
    });
  });

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();

// ========================
// Firma Name Replacement
// ========================
(function () {
  var params = new URLSearchParams(window.location.search);
  var firma = params.get('firma');
  if (!firma) return;

  var demoNames = [
    'Bauer Fliesen & Naturstein München',
    'Bauer Fliesen & Naturstein',
    'Bauer Fliesen',
  ];

  function replaceText(node, oldStr, newStr) {
    if (node.nodeType === 3) {
      if (node.textContent.indexOf(oldStr) !== -1)
        node.textContent = node.textContent.split(oldStr).join(newStr);
    } else if (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
      for (var i = 0; i < node.childNodes.length; i++)
        replaceText(node.childNodes[i], oldStr, newStr);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    demoNames.forEach(function (n) {
      replaceText(document.body, n, firma);
    });
    document.title = demoNames.reduce(function (t, n) { return t.split(n).join(firma); }, document.title);
  });
})();
